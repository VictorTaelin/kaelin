// ::::::::::
// :: Game ::
// ::::::::::

const fm = require("formality-core");
const {infs, defs} = fm.core.parse(require("./../../formality-core/examples"));
const compile = name => fm.to_js.compile(defs[name], defs);
const Cons = compile("Cons");
const Nil  = compile("Nil");
const
  [new_board,
  [exec_casts_with,
  [empty_casts,
  [cast,
  [get_hero_skill,
  ]]]]] = compile("kaelin");

// :::::::::::::::
// :: Rendering ::
// :::::::::::::::

// FPS meter
const fps = (function fps() {
  var fps = 0;
  var frames = 0;
  var last = Date.now() / 1000;
  return function frame() {
    ++frames;
    if (Date.now() / 1000 - last > 1) {
      fps = frames;
      console.log("fps:" + fps);
      frames = 0;
      last = Date.now() / 1000;
    }
  };
})();

// Keyboard
const Keyboard = (callbacks) => {
  callbacks.down = callbacks.down || function(){};
  callbacks.up = callbacks.up || function(){};
  var key = {};
  document.addEventListener("keydown", e => { key[e.key] = 1; callbacks.down(e.key); });
  document.addEventListener("keyup", e => { key[e.key] = 0; callbacks.up(e.key); });
  return key;
};

// Image
const Image = (src, offset, flip) => {
  var image = document.createElement("img");
  image.src = "img/" + src;
  image.onload = () => {
    if (flip) offset[0] = - offset[0];
    offset[0] -= image.width * 0.5;
    offset[1] -= image.height * 0.5;
  };
  image.offset = offset;
  return image;
};

// Images
const images = {
  thief: {
    right: [
      Image("thief/frame_00r.gif", [-28,-16], 1),
      Image("thief/frame_01r.gif", [-28,-16], 1),
      Image("thief/frame_02r.gif", [-28,-16], 1),
      Image("thief/frame_03r.gif", [-28,-16], 1),
      Image("thief/frame_04r.gif", [-28,-16], 1),
      Image("thief/frame_05r.gif", [-28,-16], 1),
      Image("thief/frame_06r.gif", [-28,-16], 1),
      Image("thief/frame_07r.gif", [-28,-16], 1),
      Image("thief/frame_08r.gif", [-28,-16], 1),
      Image("thief/frame_09r.gif", [-28,-16], 1),
      Image("thief/frame_10r.gif", [-28,-16], 1),
      Image("thief/frame_11r.gif", [-28,-16], 1),
      Image("thief/frame_12r.gif", [-28,-16], 1),
      Image("thief/frame_13r.gif", [-28,-16], 1),
      Image("thief/frame_14r.gif", [-28,-16], 1),
      Image("thief/frame_15r.gif", [-28,-16], 1),
      Image("thief/frame_16r.gif", [-28,-16], 1),
      Image("thief/frame_17r.gif", [-28,-16], 1),
      Image("thief/frame_18r.gif", [-28,-16], 1),
      Image("thief/frame_19r.gif", [-28,-16], 1),
      Image("thief/frame_20r.gif", [-28,-16], 1),
      Image("thief/frame_21r.gif", [-28,-16], 1),
      Image("thief/frame_22r.gif", [-28,-16], 1),
    ],
    left: [
      Image("thief/frame_00.gif", [-28,-16], 0),
      Image("thief/frame_01.gif", [-28,-16], 0),
      Image("thief/frame_02.gif", [-28,-16], 0),
      Image("thief/frame_03.gif", [-28,-16], 0),
      Image("thief/frame_04.gif", [-28,-16], 0),
      Image("thief/frame_05.gif", [-28,-16], 0),
      Image("thief/frame_06.gif", [-28,-16], 0),
      Image("thief/frame_07.gif", [-28,-16], 0),
      Image("thief/frame_08.gif", [-28,-16], 0),
      Image("thief/frame_09.gif", [-28,-16], 0),
      Image("thief/frame_10.gif", [-28,-16], 0),
      Image("thief/frame_11.gif", [-28,-16], 0),
      Image("thief/frame_12.gif", [-28,-16], 0),
      Image("thief/frame_13.gif", [-28,-16], 0),
      Image("thief/frame_14.gif", [-28,-16], 0),
      Image("thief/frame_15.gif", [-28,-16], 0),
      Image("thief/frame_16.gif", [-28,-16], 0),
      Image("thief/frame_17.gif", [-28,-16], 0),
      Image("thief/frame_18.gif", [-28,-16], 0),
      Image("thief/frame_19.gif", [-28,-16], 0),
      Image("thief/frame_20.gif", [-28,-16], 0),
      Image("thief/frame_21.gif", [-28,-16], 0),
      Image("thief/frame_22.gif", [-28,-16], 0),
    ],
  }
};

// Creates a new canvas
function Canvas(width, height) {
  var canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.style.margin = "0px";
  canvas.style.padding = "0px";

  var context = canvas.getContext("2d");
  context.imageSmoothingEnabled = false;
  context.font = "10px Arial";
  context.textBaseline = "middle"; 
  context.textAlign = "center";

  canvas.context = context;

  return canvas;
};

// Renders the board to a canvas
const render_board = (game, canvas) => {
  // Utils
  const tile_size = 24;
  const pos_to_coord = ([i,j]) => [i * tile_size, j * tile_size];

  // Converts anims to JSON
  const anims_to_json = anims => {
    const list_to_json = list => {
      let case_cons = pos => poss => [pos].concat(list_to_json(poss));
      let case_nil  = [];
      return list(case_cons)(case_nil);
    };
    let case_skip = null;
    let case_text = text => ["Text", {text}];
    let case_path = path => ["Path", {path: list_to_json(path)}];
    let case_area = area => ["Area", {area: list_to_json(area)}];
    let case_many = list => { throw "TODO"; };
    return anims(case_skip)(case_text)(case_path)(case_area)(case_many);
  };

  // Converts board to JSON
  const piece_to_json = val => {
    let case_air    = ["Air"];
    let case_wall   = ["Wall"];
    let case_throne = side => ["Throne", {side}];
    let case_unit   = side => hero => hp => ["Unit", {side, hero, hp}];
    return val(case_air)(case_wall)(case_throne)(case_unit);
  };

  // Converts board to JSON
  const board_to_json = (val, i = 0) => {
    if (i < 10) {
      return board_to_json(val[0], i + 1).concat(board_to_json(val[1], i + 1));
    } else {
      return [piece_to_json(val)];
    }
  };

  // Makes board
  const board = board_to_json(game.board);
  const anims = game.anims ? anims_to_json(game.anims) : null;

  // Clears
  canvas.context.clearRect(0, 0, canvas.width, canvas.height);

  // Draws grid
  for (var j = 0; j < 32; ++j) {
    for (var i = 0; i < 32; ++i) {
      var [x,y] = pos_to_coord([i,j]);
      canvas.context.strokeStyle = "rgba(128,128,128,0.15)";
      canvas.context.beginPath();
      canvas.context.rect(x, y, tile_size, tile_size);
      canvas.context.stroke();
      canvas.context.closePath();
    }
  }

  // Draws pieces
  for (var j = 0; j < 32; ++j) {
    for (var i = 0; i < 32; ++i) {
      var [x,y] = pos_to_coord([i,j]);
      var piece = board[j * 32 + i];
      switch (piece[0]) {
        case "Air":
          break;
        case "Wall":
          canvas.context.fillStyle = "rgb(64,64,64)";
          canvas.context.beginPath();
          canvas.context.rect(x, y, tile_size, tile_size);
          canvas.context.fill();
          canvas.context.closePath();
          break;
        case "Throne":
          canvas.context.fillStyle = "rgb(128,64,64)";
          canvas.context.beginPath();
          canvas.context.rect(x, y, tile_size, tile_size);
          canvas.context.fill();
          canvas.context.closePath();
          break;
        case "Unit":
          if (piece[1].side === 0) {
            canvas.context.fillStyle = "rgb(128,128,256)";
            canvas.context.beginPath();
            canvas.context.rect(x, y, tile_size, tile_size);
            canvas.context.fill();
            canvas.context.closePath();
          } else {
            canvas.context.fillStyle = "rgb(256,128,128)";
            canvas.context.beginPath();
            canvas.context.rect(x, y, tile_size, tile_size);
            canvas.context.fill();
            canvas.context.closePath();
          }
          canvas.context.font = "8 monospace";
          canvas.context.textAlign = "center"; 
          canvas.context.textBaseline = "middle"; 
          canvas.context.fillStyle = "white";
          canvas.context.fillText(hero_to_icon[piece[1].hero] || "??", x + 12, y + 6);
          canvas.context.fillText(piece[1].hp, x + 12, y + 18);
          break;
      }
    }
  }

  // Draws anims
  if (anims) {
    switch (anims[0]) {
      case "Path":
        var path = anims[1].path;
        canvas.context.save();
        for (var i = 0; i < path.length - 1; ++i) {
          var pos_a = pos_to_coord([path[i + 0][0] + 0.5, path[i + 0][1] + 0.5]);
          var pos_b = pos_to_coord([path[i + 1][0] + 0.5, path[i + 1][1] + 0.5]);
          canvas.context.beginPath();
          canvas.context.lineWidth = 6;
          canvas.context.strokeStyle = "rgb(0,0,0)";
          canvas.context.moveTo(pos_a[0], pos_a[1]);
          canvas.context.lineTo(pos_b[0], pos_b[1]);
          canvas.context.stroke();
          //canvas.context.endPath();
        }
        canvas.context.restore();
      break;
      case "Area":
        var area = anims[1].area;
        console.log("area anims", JSON.stringify(area));
        canvas.context.save();
        for (var i = 0; i < area.length; ++i) {
          var pos = pos_to_coord([area[i][0] + 0.5, area[i][1] + 0.5]);
          canvas.context.beginPath();
          canvas.context.fillStyle = "rgb(64,64,64)";
          canvas.context.arc(pos[0], pos[1], 6, 0, 2 * Math.PI);
          canvas.context.fill();
          //canvas.context.endPath();
        }
        canvas.context.restore();
      break;
    }
  };
};

// Maps a hero icon to its id
const icon_to_hero = {
  to: 0,
  go: 1,
  er: 6,
  cr: 7,
  sn: 8,
  si: 12,
  ke: 13,
  fl: 14,
  st: 18,
  za: 24,
  ag: 25,
  me: 26,
};

// Maps a hero to its icon
const hero_to_icon = (() => {
  var map = {};
  for (var icon in icon_to_hero) {
    map[icon_to_hero[icon]] = icon;
  }
  return map;
})();


// Gets hero positions from board
const get_hero_positions = (board_or_piece, i = 0, idx = 0, map = {}) => {
  if (i < 10) {
    let board = board_or_piece;
    get_hero_positions(board[0], i + 1, idx * 2 + 0, map);
    get_hero_positions(board[1], i + 1, idx * 2 + 1, map);
  } else {
    let piece       = board_or_piece;
    let case_air    = null;
    let case_wall   = null;
    let case_throne = side => null;
    let case_unit   = side => hero => hp => map[hero] = [idx % 32, (idx / 32) >>> 0];
    piece(case_air)(case_wall)(case_throne)(case_unit);
  }
  return map;
};

// make_casts
// | Converts a textual cast format to a casts array
// : {code  : String}
//   {board : (Array ~10 Unit)}
//   (Array ~8 (Maybe [Pos, ArgTup]))
const make_casts = (code, board) => { 

  // Parses a skill argument in textual format
  const parse_arg = arg => {
    if (arg[0] === "[") {
      return JSON.parse(arg);
    } else if (arg.indexOf("&") !== -1) {
      return arg.split("&").map(parse_arg).reverse().reduce((res,arg) => Cons(arg)(res), Nil);
    } else if ("<>^v".indexOf(arg[0]) !== -1) {
      var dir_of = {">": [1,0], "v": [0,1], "<": [-1,0], "^": [0,-1]};
      return arg.split("").reverse().reduce((rest,arg) => Cons(dir_of[arg])(rest), Nil);
    } else if ("urld".indexOf(arg[0]) !== -1) {
      var dir_of = {"r": [1,0], "d": [0,1], "l": [-1,0], "u": [0,-1]};
      return dir_of[arg[0]];
    } else {
      throw "Incorrect arg: " + arg;
    }
  };

  // Gets hero positions from board
  var hero_pos = get_hero_positions(board);

  // Initializes an empty castst array
  var casts = empty_casts;

  // Gets list of commands (a command is a hero icon, plus many casts)
  var cmds = code.split(",").filter(s => s.length > 0);
  for (let i = 0; i < cmds.length; ++i) {
    
    // Gets the words of the ith command
    let cmd = cmds[i];
    if (cmd.length === 0) continue;
    while (cmd[0] === " ") cmd = cmd.slice(1);
    let words = cmd.split(" ").filter(s => s.length > 0);

    // Gets the hero of this command
    let hero = icon_to_hero[words[0]];
    if (hero === undefined) throw "Invalid hero: `" + words[0] + "`.";

    // For each cast
    for (let j = 1; j < words.length; ++j) {
      // Gets the skill of this cast
      //console.log(hero, Number(words[j][0]), get_hero_skill(hero)(Number(words[j][0])));
      let skill = get_hero_skill(hero)(Number(words[j][0]));
      if (skill === undefined) throw "Invalid skill: `" + words[j][0] + "`.";

      // Builds the array of arguments
      let arg = parse_arg(words[j].slice(1));

      // Adds it to the casts array
      casts = cast(skill)(hero_pos[hero])(arg)(casts);
    }
  }
  return casts;
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
  var game = null;
  var stepper = null;

  // Messages
  let msgs = [];
  const new_msg = (data) => {
    var player = data.slice(0, data.indexOf(":"));
    var msg = data.slice(data.indexOf(":") + 2);

    // Performs command
    if (msg[0] === "/") {
      var sep = msg.indexOf(" ") === -1 ? msg.length : msg.indexOf(" ");
      var cmd = msg.slice(1, sep);
      var arg = msg.slice(sep + 1).split(" ");
      //console.log("...", cmd, arg);
      switch (cmd) {
        case "new":
          game = {
            players: arg,
            casts: [],
            anims: null,
            board: new_board,
            turn: 0
          };
          //var casts = empty_casts; 
          //var casts = cast(134)([29,1])(t => t(Cons([0,1])(Cons([0,1])(Cons([1,0])(Nil)))))(casts);
          //var casts = cast(176)([30,1])(t => t([0,1]))(casts);
          //var casts = make_casts("to wv, cr wv", game.board);
          //game.board = exec_casts(casts)(game.board)[0];
          break;
        case "do":

          // TODO: validate
          game.casts.push(arg.join(" "));

          if (game.casts.length >= 2) {

            // Create casts objects from user inputs
            var casts = make_casts(game.casts.join(","), game.board);

            // Gets frames and new board from Kaelin
            var frames = [];
            var board = exec_casts_with(hero_skill => anims => board => {
              frames.push([hero_skill, anims, board]);
              return board;
            })(casts)(game.board);
            frames.push([null, null, board]);
            frames.reverse();

            // Removes casts, sets board to new state
            game.casts = [];
            game.board = board;
            game.turn++;

            // Clears previous animation, starts animating this turn
            clearInterval(stepper);
            var interval = () => {
              var frame = frames.pop();
              if (frame) {
                var [hero_skill, anims, board] = frame;
                if (typeof hero_skill === "object" && hero_skill !== null) {
                  console.log("Hero " + hero_to_icon[hero_skill[0]] + " used " + hero_skill[1] + ".");
                }
                game.anims = anims;
                game.board = board;
              }
            };
            console.log("# Turn " + game.turn);
            interval();
            stepper = setInterval(interval, 2000);


            //const display_anims = anims => {
              //var case_cons = str => strs => {
                //console.log("-", fm_string_to_string(str[1]));
                //display_anims(strs);
              //};
              //var case_nil = null;
              //return anims(case_cons)(case_nil);
            //};
            //display_anims(result[1]);
          }
          break;
      }
    };

    // Adds to interface
    var msg_el = document.createElement("div");
    msg_el.className = "message";
    msg_el.innerText = player + ": " + msg;
    chat.appendChild(msg_el);
  }

  // Connection
  const ws = new WebSocket("ws://" + location.host + "/chat");
  ws.onopen = function open() {};
  ws.onmessage = (data) => new_msg(data.data);

  // Canvas
  var canvas = Canvas(24 * 32, 24 * 32);
  document.getElementById("board_box").appendChild(canvas);

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
        chat_box.scrollTop = chat_box.scrollHeight;
      }, 0);
    }
  };

  // Main loop
  const render = () => {
    if (game) {
      render_board(game, canvas); 
    }
    window.requestAnimationFrame(render);
  };

  window.requestAnimationFrame(render);
};
