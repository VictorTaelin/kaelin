// ::::::::::
// :: Game ::
// ::::::::::

const images     = require("./image.js").images;
const Keyboard   = require("./keyboard.js");
const Canvas     = require("./canvas.js");
const kaelin     = require("./kaelin.js");
const parse_cast = require("./parse_cast.js");

const skill_name = {
  0: "TOPHORO_WALK",
  1: "EARTH_ROOT",
  2: "EARTH_WALL",
  3: "EARTH_WAVE",
  4: "GONK_WALK",
  5: "GROUND_SLAM",
  6: "REVENGE",
  7: "EMPATHY",
  8: "STANCI_WALK",
  9: "RESTORE",
  10: "ESCORT",
  11: "DETAIN",
  16: "ERKOS_WALK",
  17: "FLAME_BALL",
  18: "FLAME_WAVE",
  19: "FLAME_NOVA",
  20: "CRONI_WALK",
  21: "SHADOW_BOND",
  22: "SHADOW_TRAP",
  23: "SHADOW_FLUX",
  24: "SNARCH_WALK",
  25: "QUICK_BOLT_0",
  26: "QUICK_BOLT_1",
  27: "BALLISTA",
  32: "SIRPIX_WALK",
  33: "STEALTH_MOVE",
  34: "STEALTH_STRIKE",
  35: "LOCKPICK",
  36: "KENLUA_WALK",
  37: "HASTE",
  38: "DODGE",
  39: "SLASH",
  40: "FLINA_WALK",
  41: "JAVELIN",
  42: "FLY",
  43: "GUST",
  48: "ZAGATUR_WALK",
  49: "NEEDLE",
  50: "WRAP",
  51: "SUMMON",
  52: "AGDRIS_WALK",
  53: "PROTECT",
  54: "SILENCE",
  55: "MEMENTO",
  56: "MEWEN_WALK",
  57: "TELEPORT",
  58: "PSYCHOCK",
  59: "IMPRISON",
};

const hero_name = {
  0: "Tophoro",
  1: "Gonk",
  2: "Stanci",
  3: "?????",
  4: "Erkos",
  5: "Croni",
  6: "Snarch",
  7: "?????",
  8: "Sirpix",
  9: "Kenlua",
  10: "Flina",
  11: "?????",
  12: "Zagatur",
  13: "Agdris",
  14: "Mewem",
  15: "?????",
};

const dist = ([ax,ay],[bx,by]) => Math.abs(ax-bx) + Math.abs(ay-by);

// Renders the board to a canvas
const tile_size = 32;

const pos_to_coord = ([i,j]) => [(i + 0.5) * tile_size, (j + 0.5) * tile_size];
const coord_to_pos = ([x,y]) => [Math.max(0, Math.min(Math.floor(x / tile_size - 0.5), 15)), Math.max(0, Math.min(Math.floor(y / tile_size - 0.5), 15))];

// Converts board to JSON
const unit_to_json = unit => {
  let case_void = ["Void"];
  let case_item = type => ["Item", {type}];
  let case_goal = side => ["Goal", {side}];
  let case_hero = side => hero => life => defs => eff1 => lock => mute => spec => ["Hero", {side, hero, life, defs, eff1, lock, mute, spec}];
  return kaelin.unit_to_scott(unit)(case_void)(case_item)(case_goal)(case_hero);
};

// Converts board to JSON
const board_to_json = (val, i = 0) => {
if (i < 8) {
  return board_to_json(val[0], i + 1).concat(board_to_json(val[1], i + 1));
} else {
  return [unit_to_json(val)];
}
};

// Renders the game
const render_game = (game, canvas) => {

  var tick = game.ticks[game.index];
  var board = board_to_json(tick[3]);

  // Clears
  canvas.context.clearRect(0, 0, canvas.width, canvas.height);
  canvas.context.fillStyle = "rgb(220,220,220)";
  canvas.context.rect(0, 0, canvas.width, canvas.height);
  canvas.context.fill();

  // Renders turn info
  var tick_info = "Tick " + game.index + "/" + (game.ticks.length - 1) + ", Turn " + tick[0] + ": " + tick[1];
  canvas.context.font = "12px monospace";
  canvas.context.textAlign = "center"; 
  canvas.context.textBaseline = "middle"; 
  canvas.context.fillStyle = "black";
  canvas.context.fillText(tick_info, tile_size * 8, tile_size * 16.75);

  // Draws grid
  for (var j = 0; j < 16; ++j) {
    for (var i = 0; i < 16; ++i) {
      var [x,y] = pos_to_coord([i,j]);
      // Rectangle
      
      canvas.context.beginPath();
      canvas.context.rect(x, y, tile_size, tile_size);
      if (tick[2]) {
        var unit = unit_to_json(kaelin.get_at([i,j])(tick[3])[1]);
        if (dist(tick[2][1], [i,j]) <= kaelin.get_skill_area(tick[2][0])) {
          if (tick[2][0] % 4 === 0) {
            canvas.context.fillStyle = "rgba(32,128,128,0.5)";
          //} else if (unit[0] === "Hero" && unit[1].side === 0) {
            //canvas.context.fillStyle = "rgba(32,32,128,0.5)";
          } else {
            canvas.context.fillStyle = "rgba(128,32,32,0.5)";
          }
          canvas.context.fill();
        }
        if (unit[0] === "Hero" && unit[1].hero === Math.floor(tick[2][0] / 4)) {
          canvas.context.fillStyle = "rgba(64,64,64,0.3)";
          canvas.context.fill();
        }
      } else if (game.selected && dist(game.selected[0], [i,j]) === 0) {
        canvas.context.fillStyle = "rgba(64,64,64,0.3)";
        canvas.context.fill();
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

  //canvas.context.drawImage(images.croni.right[0], tile_size * 2, tile_size * 2 - 10);
  //canvas.context.drawImage(images.thief.right[0], tile_size * 1 + 16 + images.thief.right[0].offset[0], tile_size * 2 + 16 + images.thief.right[0].offset[1]);

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
          canvas.context.fillText(unit[1].life + (unit[1].lock > 0 ? "L" : "") + (unit[1].mute > 0 ? "M" : "") + (unit[1].spec > 0 ? "*" : ""), x + 16, y + 27);
          var image = images[hero_name[unit[1].hero].toLowerCase()].left[0];
          canvas.context.drawImage(image, x + tile_size * 0.5 - image.width / 2, y + tile_size * 0.5 - image.height / 2);
          break;
      }
    }
  }

  if (game.selected) {
    for (var n = 0; n < 4; ++n) {
      if (game.selected[n + 2]) {
        var [i,j] = game.selected[n + 2];
        var [x,y] = pos_to_coord([i,j]);
        canvas.context.font = "bold 24px monospace";
        canvas.context.textAlign = "center"; 
        canvas.context.textBaseline = "middle"; 
        canvas.context.fillStyle = "black";
        canvas.context.fillText("XFDS"[n], x + tile_size * 0.5, y + tile_size * 0.5);
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

window.onload = () => {

  // Name
  if (!localStorage.getItem("name")) {
    localStorage.setItem("name", prompt("Your name:"));
  }
  var name = localStorage.getItem("name");

  // State
  var game = {
    index: 0,
    ticks: [[0,"Game begins.",null,kaelin.new_board]],
    casts: [],
    mouse: [0,0],
    turn: 0,
    selected: null,
  };

  // Canvas
  var canvas = Canvas(tile_size * 16 + 32, tile_size * 16 + 32);
  document.getElementById("board_box").appendChild(canvas);

  // Keyboard
  document.body.onkeydown = e => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      var add = e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 : 0;
      game.index = Math.max(0, Math.min(game.index + add, game.ticks.length - 1));
    }
    if ((e.key === "f" || e.key === "d" || e.key === "s") && game.selected) {
      var slot = ({f: 1, d: 2, s: 3})[e.key];
      var unit = unit_to_json(kaelin.get_at(game.mouse)(game.ticks[game.index][3])[1]);
      game.selected[slot + 2] = [game.mouse[0], game.mouse[1]];
      console.log(game.selected);
    }
    if (e.key === ".") {
      if (game.index < game.ticks.length - 1) {
        game.index = game.ticks.length - 1;
      } else {
        ws.send(name + ": " + ".");
      }
    }
    if (e.key === "Enter" || e.key === " ") {
      if (e.shiftKey) {
        ws.send(name + ": " + ".");
      } else if (game.selected) {
        var cast = "@" + hero_name[game.selected[1]].slice(0, 2).toLowerCase();
        for (var n = 0; n < 4; ++n) {
          var pos = game.selected[n + 2];
          cast += " " + (pos ? pos[0].toString(16) + pos[1].toString(16) : ".");
        }
        ws.send(name + ": " + cast);
        game.selected = null;
      }
    }
    if (e.key === "Escape") {
      game.selected = null;
    }
  };

  // Mouse
  canvas.onmousemove = e => {
    // Registers the mouse position
    var [x,y] = [e.offsetX, e.offsetY];
    var [i,j] = coord_to_pos([x,y]);
    game.mouse = [i,j];
  };
  canvas.onclick = e => {
    // Selects an unitt
    var unit = unit_to_json(kaelin.get_at(game.mouse)(game.ticks[game.index][3])[1]);
    if (game.selected) {
      game.selected[2] = [game.mouse[0], game.mouse[1]];
    }
    if (unit[0] === "Hero") {
      game.selected = [[game.mouse[0],game.mouse[1]], unit[1].hero, null, null, null, null];
    }
  };

  // Messages
  let msgs = [];
  const on_message = (line) => {
    const post = (msg, className) => { 
      var msg_el = document.createElement("div");
      msg_el.className = "message " + className;
      msg_el.innerText = msg;
      chat.appendChild(msg_el);
    };

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

    if (msg === ".") {
      //var casts = game.casts.sort((a,b) => kaelin.get_skill_priority(a[0]) - kaelin.get_skill_priority(b[0]));
      var casts = kaelin.sort_casts(game.casts);
      for (var i = 0; i < casts.length; ++i) {
        var show_args = args => typeof args === "object" ? args[0].toString(16) + args[1].toString(16) : String(args);
        var hero = hero_name[Math.floor(casts[i][0] / 4)];
        var skill = skill_name[casts[i][0]];
        var args = skill.indexOf("WALK") === -1 ? "(" + show_args(casts[i][1]) + ")" : "";
        var turn_message = hero + " used " + skill + args + ".";
        game.ticks.push([game.turn, turn_message, casts[i], kaelin.cast(casts[i])(game.ticks[game.ticks.length - 1][3])]);
      };
      game.ticks.push([game.turn, "End turn.", null, kaelin.end_turn(game.ticks[game.ticks.length - 1][3])]);
      post("Completed turn " + game.turn + " with " + game.casts.length + " casts!", "green_log");
      ++game.turn;
      game.casts = [];
    }

    if (msg === "$") {
      game.casts = [];
      game.ticks.push([0, "Game begins.", [skill, args], kaelin.new_board]);
      game.turn = 0;
      post("Starting a new game!", "green_log");
    }



    // Performs command
    //if (msg[0] === "/") {
      //var sep = msg.indexOf(" ") === -1 ? msg.length : msg.indexOf(" ");
      //var cmd = msg.slice(1, sep);
      //var arg = msg.slice(sep + 1).split(" ");
      ////console.log("...", cmd, arg);
      //switch (cmd) {
        //case "new":
          //game = {
            //players: arg,
            //casts: [],
            //anims: null,
            //board: new_board,
            //turn: 0
          //};
          ////var casts = empty_casts; 
          ////var casts = cast(134)([29,1])(t => t(Cons([0,1])(Cons([0,1])(Cons([1,0])(Nil)))))(casts);
          ////var casts = cast(176)([30,1])(t => t([0,1]))(casts);
          ////var casts = make_casts("to wv, cr wv", game.board);
          ////game.board = exec_casts(casts)(game.board)[0];
          //break;
        //case "do":

          //// TODO: validate
          //game.casts.push(arg.join(" "));

          //if (game.casts.length >= 2) {

            //// Create casts objects from user inputs
            //var casts = make_casts(game.casts.join(","), game.board);

            //// Gets frames and new board from Kaelin
            //var frames = [];
            //var board = exec_casts_with(hero_skill => anims => board => {
              //frames.push([hero_skill, anims, board]);
              //return board;
            //})(casts)(game.board);
            //frames.push([null, null, board]);
            //frames.reverse();

            //// Removes casts, sets board to new state
            //game.casts = [];
            //game.board = board;
            //game.turn++;

            //// Clears previous animation, starts animating this turn
            //clearInterval(stepper);
            //var interval = () => {
              //var frame = frames.pop();
              //if (frame) {
                //var [hero_skill, anims, board] = frame;
                //if (typeof hero_skill === "object" && hero_skill !== null) {
                  //console.log("Hero " + hero_to_icon[hero_skill[0]] + " used " + hero_skill[1] + ".");
                //}
                //game.anims = anims;
                //game.board = board;
              //}
            //};
            //console.log("# Turn " + game.turn);
            //interval();
            //stepper = setInterval(interval, 2000);


            ////const display_anims = anims => {
              ////var case_cons = str => strs => {
                ////console.log("-", fm_string_to_string(str[1]));
                ////display_anims(strs);
              ////};
              ////var case_nil = null;
              ////return anims(case_cons)(case_nil);
            ////};
            ////display_anims(result[1]);
          //}
          //break;
      //}
    //};

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
    "Hero    | Skill F           | Skill D             | Skill S",
    "------- | ----------------- | ------------------- | -----------------",
    "TOPHORO | Earth_Root*       | Earth_Wall*         | Earth_Rise       ",
    "GONK    | Empathy*          | Revenge*            | Ground_Slam      ",
    "STANCI  | Restore*          | Escort*             | Detain*          ",
    "ERKOS   | Flame_Ball        | Flame_Wave          | Flame_Nova       ",
    "CRONI   | Shadow_Bond*      | Shadow_Trap*        | Shadow_Flux      ",
    "SNARCH  | Quick_Bolt_0*     | Quick_Bolt_1*       | Ballista*        ",
    "SIRPIX  | Stealth_Move*     | Stealth_Strike*     | Lockpick         ",
    "KENLUA  | Haste*            | Dodge*              | Slash            ",
    "FLINA   | Javelin*          | Fly                 | Gust             ",
    "ZAGATUR | Wrap*             | Needle              | Summon           ",
    "AGDRIS  | Memento*          | Silence*            | Protect*         ",
    "MEWRU   | Teleport*         | Psychock            | Imprison         ",

  ].join("\n");
  tips_box.innerText = tips;

  // Main loop
  const render = () => {
    //if (game) {
      render_game(game, canvas); 
    //
    chat_box.scrollTop = chat_box.scrollHeight;
    window.requestAnimationFrame(render);
  };

  window.requestAnimationFrame(render);
};
