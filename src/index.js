// ::::::::::
// :: Game ::
// ::::::::::

const images     = require("./image.js").images;
const Keyboard   = require("./keyboard.js");
const Canvas     = require("./canvas.js");
const kaelin     = require("./kaelin.js");
const parse_cast = require("./parse_cast.js");
const dist       = ([ax,ay],[bx,by]) => Math.abs(ax-bx) + Math.abs(ay-by);
const CAST_TIME  = 8;
const TICK_TIME  = 2.0;
const now        = () => Date.now() / 1000;

// Renders the board to a canvas
const tile_size    = 32;
const pos_to_coord = ([i,j]) => [(i + 0.5) * tile_size, (j + 0.5) * tile_size];
const coord_to_pos = ([x,y]) => [Math.max(0, Math.min(Math.floor(x / tile_size - 0.5), 15)), Math.max(0, Math.min(Math.floor(y / tile_size - 0.5), 15))];

// Renders the game
const render_game = (game, canvas) => {

  var tick = game.ticks[Math.floor(game.index)];
  var board = kaelin.board_to_json(tick.board);

  var prev_tick = game.ticks[Math.floor(Math.max(game.index - 1, 0))];
  var prev_board = kaelin.board_to_json(prev_tick.board);

  // Finds hero positions
  var hero_pos = {};
  var prev_hero_pos = {};
  for (var j = 0; j < 16; ++j) {
    for (var i = 0; i < 16; ++i) {
      var unit = board[j * 16 + i];
      if (unit[0] === "Hero") {
        hero_pos[unit[1].hero] = [i,j];
      }
      var prev_unit = prev_board[j * 16 + i];
      if (prev_unit[0] === "Hero") {
        prev_hero_pos[prev_unit[1].hero] = [i,j];
      }
    }
  }

  // Clears screen
  canvas.context.clearRect(0, 0, canvas.width, canvas.height);
  if (game.index < game.ticks.length - 1) {
    canvas.context.fillStyle = "rgb(200,200,200)";
  } else {
    canvas.context.fillStyle = "rgb(230,230,230)";
  }
  canvas.context.rect(0, 0, canvas.width, canvas.height);
  canvas.context.fill();

  // Renders turn info
  
  if (game.casting && now() - game.casting < CAST_TIME) {
    var top_text = "Casting in " + (CAST_TIME - (now() - game.casting)).toFixed(2) + " seconds...";
  } else {
    var top_text = tick.text;
  }
  var bottom_text = "Tick " + Math.floor(game.index) + "/" + (game.ticks.length - 1) + ", Turn " + tick.turn + ".";
  canvas.context.font = "12px monospace";
  canvas.context.textAlign = "center"; 
  canvas.context.textBaseline = "middle"; 
  canvas.context.fillStyle = "black";
  canvas.context.fillText(bottom_text, tile_size * 8, tile_size * 16.75);
  canvas.context.fillText(top_text, tile_size * 8, tile_size * 0.25);

  // Draws tiles
  for (var j = 0; j < 16; ++j) {
    for (var i = 0; i < 16; ++i) {
      var [x,y] = pos_to_coord([i,j]);
      canvas.context.beginPath();
      canvas.context.rect(x, y, tile_size, tile_size);
      var unit = board[j * 16 + i];

      // Highlighst hero walk range
      if (  game.my_hero
        && hero_pos[game.my_hero]
        && dist([i,j], hero_pos[game.my_hero]) <= 3
        && (game.casting && now() - game.casting < CAST_TIME)) {
        canvas.context.fillStyle = "rgba(64,128,64,0.3)";
        canvas.context.fill();
      }

      // Highlights target & caster positions
      if (tick.cast) {
        if (dist(tick.cast[1], [i,j]) <= kaelin.get_skill_area(tick.cast[0])) {
          if (tick.cast[0] % 4 === 0) {
            canvas.context.fillStyle = "rgba(32,128,128,0.5)";
          } else {
            canvas.context.fillStyle = "rgba(128,32,32,0.5)";
          }
          canvas.context.fill();
        }
        if (unit[0] === "Hero" && unit[1].hero === Math.floor(tick.cast[0] / 4)) {
          canvas.context.fillStyle = "rgba(64,64,64,0.3)";
          canvas.context.fill();
        }
      }
      canvas.context.strokeStyle = "rgba(128,128,128,0.15)";
      canvas.context.stroke();
      canvas.context.closePath();
      // Coordinate
      canvas.context.font = "10px courier new";
      canvas.context.textAlign = "center"; 
      canvas.context.textBaseline = "middle"; 
      canvas.context.fillStyle = "rgb(64,64,64)";
      canvas.context.fillText(String(i.toString(16)) + String(j.toString(16)), x + tile_size * 0.5, y + tile_size * 0.5);
    }
  }

  // Draws units
  for (var j = 0; j < 16; ++j) {
    for (var i = 0; i < 16; ++i) {
      var [x,y] = pos_to_coord([i,j]);
      var unit  = board[j * 16 + i];
      switch (unit[0]) {
        case "Void":
          break;
        case "Item":
          if (unit[1].type === 2) {
            var image = images.item.hourglass;
            canvas.context.drawImage(image, x + tile_size * 0.5 - image.width / 2, y + tile_size * 0.5 - image.height / 2);
          } else {
            canvas.context.fillStyle = "rgb(64,64,64)";
            canvas.context.beginPath();
            canvas.context.rect(x, y, tile_size, tile_size);
            canvas.context.fill();
            canvas.context.closePath();
          }
          break;
        case "Goal":
          canvas.context.fillStyle = "rgb(128,64,64)";
          canvas.context.beginPath();
          canvas.context.rect(x, y, tile_size, tile_size);
          canvas.context.fill();
          canvas.context.closePath();
          break;
        case "Hero":
          canvas.context.font = "bold 10px courier new";
          canvas.context.textAlign = "center"; 
          canvas.context.textBaseline = "middle"; 
          canvas.context.fillStyle = "black";
          canvas.context.fillText(
            unit[1].life
            + (unit[1].defs ? "+" + unit[1].defs : "")
            + (unit[1].lock > 0 ? "L" : "")
            + (unit[1].mute > 0 ? "M" : "")
            + (unit[1].spec > 0 ? "*" : ""),
            x + 16,
            y + 27);
          var hero = unit[1].hero;
          var name = kaelin.hero_name[hero];
          if (name === "Croni") {
            var delta = now() - (game.begin_anim || 0);
            if (tick.cast && Math.floor(tick.cast[0] / 4) === hero && tick.cast[0] % 4 === 0) {
              var [px,py] = pos_to_coord(prev_hero_pos[hero]);
              var x = px + (x - px) * delta / TICK_TIME;
              var y = py + (y - py) * delta / TICK_TIME;
              var frames = images[name.toLowerCase()].move.left;
            } else if (tick.cast && Math.floor(tick.cast[0] / 4) === hero && tick.cast[0] % 4 === 3) {
              var frames = images[name.toLowerCase()].shadow_flux.left;
              if (delta > 0.7 && delta < 1.8) {
                var effect = images.effects.shadow_flux[Math.min(Math.floor((delta - 0.7) * 10), 10)];
                var [tx,ty] = pos_to_coord(tick.cast[1]);
                canvas.context.drawImage(effect, tx + tile_size * 0.5 - effect.width / 2, ty + tile_size * 0.5 - effect.height / 2);
              }
            } else {
              var frames = images[name.toLowerCase()].idle.left;
            }
            var image = frames[Math.floor(delta * 10) % frames.length];
          } else {
            var image = images[name.toLowerCase()].left[0];
          }
          canvas.context.drawImage(image, x + tile_size * 0.5 - image.width / 2, y + tile_size * 0.5 - image.height / 2);
          break;
      }
    }
  }

  if (game.my_hero !== null) {
    for (var n = 0; n < 4; ++n) {
      if (game.my_casts[n]) {
        var [i,j] = game.my_casts[n];
        var [x,y] = pos_to_coord([i,j]);
        canvas.context.font = "bold 24px monospace";
        canvas.context.textAlign = "center"; 
        canvas.context.textBaseline = "middle"; 
        canvas.context.fillStyle = "black";
        canvas.context.fillText("XSDF"[n], x + tile_size * 0.5, y + tile_size * 0.5);
      }
    }
      
  }
};

const fm_string_to_string = str => {
  var read_4_chars = n => {
    var str = "";
    str += String.fromCharCode((n >>>  0) & 0xFF);
    str += String.fromCharCode((n >>>  8) & 0xFF);
    str += String.fromCharCode((n >>> 16) & 0xFF);
    str += String.fromCharCode((n >>> 24) & 0xFF);
    return str;
  };
  return str[1](w => ws => read_4_chars(w) + ws)("");
};

const serialize_casts = (game) => {
  if (game.my_hero !== null) {
    var cast = "@" + kaelin.hero_name[game.my_hero].slice(0, 2).toLowerCase();
    for (var n = 0; n < 4; ++n) {
      var pos = game.my_casts[n];
      cast += " " + (pos ? pos[0].toString(16) + pos[1].toString(16) : ".");
    }
    return cast;
  } else {
    return null;
  }
};

window.onload = () => {

  // Name
  if (!localStorage.getItem("name")) {
    localStorage.setItem("name", prompt("Your name:"));
  }
  var name = localStorage.getItem("name");

  // State
  var game;
  function new_game() {
    game = {
      index: 0,
      ticks: [{turn: 0, text: "Game begins.", cast: null, board: kaelin.new_board}],
      casts: [],
      mouse: [0,0],
      manual: false,
      turn: 0,
      begin_anim: null,
      my_hero: null,
      my_casts: [null, null, null, null]
    };
    render_game(game, canvas);
  };

  // Canvas
  var canvas = Canvas(tile_size * 16 + 32, tile_size * 16 + 32);
  document.getElementById("board_box").appendChild(canvas);

  const add_index = (add) => {
    if (add > 0 && game.index < game.ticks.length - 1) {
      game.index += 1;
      game.begin_anim = now();
      if (game.index === game.ticks.length - 1) {
        game.manual = false;
        post("Finish your casts. You have " + CAST_TIME + " seconds!", "log_green");
        game.casting = now();
        setTimeout(() => {
          var serialized = serialize_casts(game);
          game.my_casts = [null, null, null, null];
          if (serialized) {
            ws.send(name + ": " + serialized);
            post("Sending " + game.casts.length + " casts.", "log_green");
          } else {
            post("No casts for now.");
          }
          if (name === "SrPx") {
            setTimeout(() => {
              ws.send(name + ": /next");
            }, 1000);
          }
          render_game(game, canvas);
        }, CAST_TIME * 1000);
      }
    } else if (add < 0) {
      game.index = Math.max(game.index + add, 0);
      game.begin_anim = now();
      game.manual = true;
    }
  };

  // Keyboard
  document.body.onkeydown = e => {
    // Manually controls turns prev/next
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      add_index(e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 : 0);
    }

    // Selects cast positions
    if (/[xfds]/.test(e.key) && game.my_hero !== null) {
      var slot = ({f: 3, d: 2, s: 1, x: 0})[e.key];
      var tick = game.ticks[Math.floor(game.index)];
      var unit = kaelin.unit_to_json(kaelin.get_at(game.mouse)(tick.board)[1]);
      if (game.my_casts[slot] && dist(game.my_casts[slot], game.mouse) === 0) {
        game.my_casts[slot] = null;
      } else {
        game.my_casts[slot] = [game.mouse[0], game.mouse[1]];
      }
    }

    // Sends pass-turn command
    if (e.key === ".") {
      if (game.index < game.ticks.length - 1) {
        game.index = game.ticks.length - 1;
      } else {
        ws.send(name + ": " + "/next");
      }
    }

    // Sends casts
    //if (e.key === "Enter" || e.key === " ") {
      //send_casts();
    //}

    // Removes selected
    if (e.key === "Escape") {
      game.my_casts = [null, null, null, null];
    }

    render_game(game, canvas);
  };

  // Register mouse position
  canvas.onmousemove = e => {
    var [x,y] = [e.offsetX, e.offsetY];
    var [i,j] = coord_to_pos([x,y]);
    game.mouse = [i,j];
  };

  // Selects an unit
  canvas.onclick = e => {
    // Selects an unit
    var tick = game.ticks[Math.floor(game.index)];
    var unit = kaelin.unit_to_json(kaelin.get_at(game.mouse)(tick.board)[1]);
    if (unit[0] === "Hero") {
      game.my_hero = unit[1].hero;
      game.my_casts = [null, null, null, null];
    }
    render_game(game, canvas);
  };

  // Sends my casts
  const send_casts = () => {
    ws.send(name + ": " + serialize_casts(game));
    game.my_casts = [null, null, null, null];
  };

  // Posts something on chat
  const post = (msg, className) => { 
    var msg_el = document.createElement("div");
    msg_el.className = "message " + className;
    msg_el.innerText = msg;
    if (msg.slice(-5) !== "RESET") {
      chat.appendChild(msg_el);
    }
    chat_box.scrollTop = chat_box.scrollHeight;
  };

  // Messages
  let msgs = [];
  const on_message = (line) => {
    var player = line.slice(0, line.indexOf(":"));
    var msg = line.slice(line.indexOf(":") + 2);

    post(player + ": " + msg);

    // If it is a cast, parses it
    if (msg[0] === "@") {
      var new_casts = [];
      var lines = msg.split("@").filter(line => line.length > 0);
      for (var i = 0; i < lines.length; ++i) {
        try {
          new_casts = new_casts.concat(parse_cast(lines[i]).filter(cast => cast[1] !== null));
        } catch (e) {
          post("[ERROR] On cast " + i + ": " + e, "red_log");
        }
      }
      game.casts = game.casts.concat(new_casts);
      post("Added " + new_casts.length + " casts to turn " + game.turn + "! Total: " + game.casts.length + ".", "green_log");
    }

    if (msg === "/next") {
      var casts = kaelin.sort_casts(game.casts);
      for (var i = 0; i < casts.length; ++i) {
        var show_args = args => typeof args === "object" ? args[0].toString(16) + args[1].toString(16) : String(args);
        var hero = kaelin.hero_name[Math.floor(casts[i][0] / 4)];
        var skill = kaelin.skill_name[casts[i][0]];
        var args = "(" + show_args(casts[i][1]) + ")";
        var turn_message = hero + " used " + skill + args + ".";
        var tick = game.ticks[game.ticks.length - 1];
        var new_board = kaelin.cast(casts[i])(tick.board);
        game.ticks.push({
          turn: game.turn,
          text: turn_message,
          cast: casts[i],
          board: new_board
        });
      };
      game.ticks.push({
        turn: game.turn,
        text: "End turn.",
        cast: null,
        board: kaelin.end_turn(game.ticks[game.ticks.length - 1].board)
      });
      post("Completed turn " + game.turn + " with " + game.casts.length + " casts!", "green_log");
      ++game.turn;
      game.casts = [];
      render_game(game, canvas);
    }

    if (msg === "$") {
      game.casts = [];
      game.ticks.push([0, "Game begins.", [skill, args], kaelin.new_board]);
      game.turn = 0;
      post("Starting a new game!", "green_log");
    }

    if (msg === "RESET") {
      new_game();
      chat.innerHTML = "";
    }
  }

  // Connection
  const ws = new WebSocket("ws://" + location.host + "/chat");
  ws.onopen = function open() {};
  ws.onmessage = (data) => on_message(data.data);

  // Chat
  var chat = document.createElement("div");
  var chat_box = document.getElementById("chat_box");
  var input = document.getElementById("input");
  chat.style.width = "100%";
  chat.style.height = "100%";
  chat_box.appendChild(chat);
  input.onkeypress = function(e) {
    if (e.key === "Enter") {
      ws.send(name + ": " + input.value);
      setTimeout(() => {
        input.value = "";
      }, 0);
    }
  };

  // Tips
  var tips_box = document.getElementById("tips_box");
  var tips = [
    "Hero    | Skill S           | Skill D             | Skill F",
    "------- | ----------------- | ------------------- | -----------------",
    "TOPHORO | Earth_Root*       | Earth_Wall*         | Earth_Rise       ",
    "GONK    | Empathy*          | Revenge*            | Ground_Slam      ",
    "STANCI  | Restore*          | Escort*             | Detain*          ",
    "ERKOS   | Flame_Ball        | Flame_Wave          | Flame_Nova       ",
    "CRONI   | Shadow_Bond*      | Shadow_Trap*        | Shadow_Flux      ",
    "SNARCH  | Ballista*         | Quick_Bolt_0*       | Quick_Bolt_1*    ",
    "SIRPIX  | Stealth_Move*     | Stealth_Strike*     | Lockpick         ",
    "KENLUA  | Haste*            | Dodge*              | Slash            ",
    "FLINA   | Javelin*          | Fly                 | Gust             ",
    "ZAGATUR | Wrap*             | Needle              | Summon           ",
    "AGDRIS  | Memento*          | Silence*            | Protect*         ",
    "MEWRU   | Teleport*         | Psychock            | Imprison         ",

  ].join("\n");
  tips_box.innerText = tips;

  // Animation
  setInterval(() => {
    if (!game.manual && game.index < game.ticks.length - 1) {
      add_index(1);
      //game.index += 1;
      render_game(game, canvas);
    }
  }, TICK_TIME * 1000);

  // Rendering
  setInterval(() => {
    render_game(game, canvas);
  }, 100);

  new_game();
};
