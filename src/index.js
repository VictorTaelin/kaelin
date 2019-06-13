// ::::::::::
// :: Game ::
// ::::::::::

const fm = require("formality-core");
const {infs, defs} = fm.core.parse(require("./../../formality-core/examples"));
const compile = name => fm.to_js.compile(defs[name], defs);
const K = {
  new_board: compile("new_board"),
  step: compile("step")
};

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
const render_board = (game_board, canvas) => {
  // Utils
  const tile_size = 24;
  const pos_to_coord = ([i,j]) => [i * tile_size, j * tile_size];

  // Converts board to JSON
  const piece_to_json = val => {
    let case_air    = ["Air"];
    let case_wall   = ["Wall"];
    let case_cliff  = ["Cliff"];
    let case_throne = side => ["Throne", {side}];
    let case_unit   = side => hero => hp => ["Unit", {side, hero, hp}];
    return val(case_air)(case_wall)(case_cliff)(case_throne)(case_unit);
  };
  const board_to_json = (val, i = 0) => {
    if (i < 10) {
      return board_to_json(val[0], i + 1).concat(board_to_json(val[1], i + 1));
    } else {
      return [piece_to_json(val)];
    }
  };
  const board = board_to_json(game_board);

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
        case "Cliff":
          canvas.context.fillStyle = "rgb(64,128,64)";
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
          break;
      }
    }
  }
};

window.onload = () => {
  // Name
  if (!localStorage.getItem("name")) {
    localStorage.setItem("name", prompt("Your name:"));
  }
  var name = localStorage.getItem("name");

  // State
  var game = null;

  // Messages
  let msgs = [];
  const new_msg = (data) => {
    var player = data.slice(0, data.indexOf(":"));
    var msg = data.slice(data.indexOf(":") + 2);

    // Performs command
    if (msg[0] === "/") {
      var cmd = msg.slice(1, msg.indexOf(" "));
      var arg = msg.slice(msg.indexOf(" ") + 1).split(" ");
      switch (cmd) {
        case "new":
          game = {
            players: arg,
            board: K.new_board
          }
        break;
        case "step":
          const pos = JSON.parse(arg[0]);
          const dir = JSON.parse(arg[1]);
          game.board = K.step(pos)(dir)(game.board);
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
      render_board(game.board, canvas); 
    }
    window.requestAnimationFrame(render);
  };

  window.requestAnimationFrame(render);
};


// Draws tiles
//for (var j = 0; j < game.dim[1]; ++j) {
  //for (var i = 0; i < game.dim[0]; ++i) { 
    //var [x,y] = pos_to_coord([i, j]);
    //var thing = get_thing(game, [i,j]);
    //var floor = get_floor(game, [i,j]);

    //// Thing
    //if (thing && thing.color) {
      //if (thing.pid !== null) {
        ////var [x,y] = project(walk_anim_pos(thing, [i,j]));
        //var frame = T - thing.last_attack < 1.375 ? Math.floor(((T - thing.last_attack) * 16) % 22) : 0;
        //var image = images.thief[thing.face][frame];
        //canvas.context.drawImage(image, x + image.offset[0] + tile_size * 0.5, y + image.offset[1] + tile_size * 0.5);
      //} else {
        //canvas.context.fillStyle = thing.color;
        //canvas.context.beginPath();
        //canvas.context.rect(x, y, tile_size, tile_size);
        //canvas.context.fill();
        //canvas.context.closePath();
      //}
    //}
  //}
