// ::::::::::::
// :: Vector ::
// ::::::::::::

const add2 = ([ax,ay],[bx,by]) => [ax + bx, ay + by];

// :::::::::::::::
// :: Direction ::
// :::::::::::::::

const Right = 0;
const Down = 1;
const Left = 2;
const Up = 3;

const dir_delta = (dir) => {
  switch (dir) {
    case Right : return [ 1,  0];
    case Down  : return [ 0,  1];
    case Left  : return [-1,  0];
    case Up    : return [ 0, -1];
  }
};

const swap = (game, pos_a, pos_b) => {
  var a = get_thing(game, pos_a);
  var b = get_thing(game, pos_b);
  set_thing(game, pos_a, b);
  set_thing(game, pos_b, a);
  if (a.pid !== null) game.heroes[a.pid].pos = pos_b;
  if (b.pid !== null) game.heroes[b.pid].pos = pos_a;
};

const get_active_pos = (game) => {
  return game.heroes[game.turn % 10].pos;
};

const get_active_hero = (game) => {
  return get_thing(game, get_active_pos(game));
};

const walk = (game, a_pos, a_dir) => {
  var a_val = get_thing(game, a_pos);
  if (a_val && a_val.walks) {
    var b_pos = add2(a_pos, dir_delta(a_dir));
    var b_val = get_thing(game, b_pos);
    if (b_val && b_val.walkable) {
      a_val.steps += 1;
      console.log(a_val.steps);
      swap(game, a_pos, b_pos);
      if (a_val.steps >= a_val.speed) {
        end_turn(game);
      }
      return true;
    }
  }
  return false;
};

// :::::::::::
// :: Floor ::
// :::::::::::

const Empty = () => ({});

// :::::::::::
// :: Thing ::
// :::::::::::

const Void = () => ({
  pid: null,
  color: null,
  walks: false,
  walkable: true,
  speed: 0,
  hp: 0,
});

const Wall = () => ({
  pid: null,
  color: "#202020",
  walks: false,
  walkable: false,
  speed: 0,
  hp: 0,
});

const Throne = () => ({
  pid: null,
  color: "#E04020",
  walks: false,
  walkable: true,
  speed: 0,
  hp: 0,
});

const Guard = () => ({
  pid: null,
  color: "#203020",
  walks: true,
  walkable: false,
  speed: 0,
  hp: 32,
});

const Hero = (pid) => ({
  pid: pid,
  color: "#809080",
  walks: true,
  walkable: false,
  speed: 4,
  hp: 32,
  steps: 0,
});

// :::::::::
// :: Game ::
// :::::::::

const Game = (data) => {
  var heroes = {A: {}, B: {}};
  var dim = [data[0].length / 2, data.length];
  var map = data.map((line,j) => {
    var arr = [];
    for (var i = 0; i < dim[0]; ++i) {
      const pos = [i,j];
      const Floor = (chr) => {
        switch (chr) {
          default : return Empty();
        }
      }
      const Thing = (chr) => {
        switch (chr) {
          case "X" : return Wall();
          case "T" : return Throne();
          case "G" : return Guard();
          case "0" : heroes[0] = {pos}; return Hero(0);
          case "1" : heroes[1] = {pos}; return Hero(1);
          case "2" : heroes[2] = {pos}; return Hero(2);
          case "3" : heroes[3] = {pos}; return Hero(3);
          case "4" : heroes[4] = {pos}; return Hero(4);
          case "5" : heroes[5] = {pos}; return Hero(5);
          case "6" : heroes[6] = {pos}; return Hero(6);
          case "7" : heroes[7] = {pos}; return Hero(7);
          case "8" : heroes[8] = {pos}; return Hero(8);
          case "9" : heroes[9] = {pos}; return Hero(9);
          default  : return Void();
        }
      }
      arr[i] = [Floor(line[i * 2]), Thing(line[i * 2 + 1])];
    }
    return arr;
  });
  return {dim, map, heroes, turn: 0};
};

const end_turn = (game) => {
  var hero = get_active_hero(game);
  hero.steps = 0;
  game.turn += 1;
};

const act = (game, key) => {
  var pos  = get_active_pos(game);
  var hero = get_active_hero(game);
  switch (key) {
    case "a":
    case "s":
    case "d":
    case "w":
      walk(game, pos, ({a: Left, s: Down, d: Right, w: Up})[key]);
      break;
    case "Enter":
      end_turn(game);
      break;
  }
};
const get_floor = (game, pos) => game.map[pos[1]] && game.map[pos[1]][pos[0]] && game.map[pos[1]][pos[0]][0] || null;
const get_thing = (game, pos) => game.map[pos[1]] && game.map[pos[1]][pos[0]] && game.map[pos[1]][pos[0]][1] || null;
const set_floor = (game, pos, thing) => game.map[pos[1]][pos[0]][0] = thing;
const set_thing = (game, pos, thing) => game.map[pos[1]][pos[0]][1] = thing;

const default_map_data = [
// |               ,               ;               .               |               ,               ;               ,               |
  " X . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",//--------0
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",//-- 8
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",//---- 16
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",//-- 24
  " X X X X X . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . X X X X X",
  " X . . . X . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . X . . . X",
  " X . . . X X X X X X X X X X . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . X X X X X X X X X X . . . X",
  " X . . . . . . . . . . . . X . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . X . . . . . . . . . . . . X",
  " X . X G G G G G G G G X . X . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . X . X G G G G G G G G X . X",
  " X . 0 . . . . . . . . X G X . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . X G X . . . . . . . . 5 . X",
  " X X 1 . . . . . . . . . . . . . . . . . . . . . . . . . . . . X X . . . . . . . . . . . . . . . . . . . . . . . . . . . . 6 X X",
  " X T 2 . . . . . . . . . . . . . . . . . . . . . . . . . . . . X X . . . . . . . . . . . . . . . . . . . . . . . . . . . . 7 T X",//-------- 32
  " X X 3 . . . . . . . . . . . . . . . . . . . . . . . . . . . . X X . . . . . . . . . . . . . . . . . . . . . . . . . . . . 8 X X",
  " X . 4 . . . . . . . . X G X . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . X G X . . . . . . . . 9 . X",
  " X . X G G G G G G G G X . X . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . X . X G G G G G G G G X . X",
  " X . . . . . . . . . . . . X . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . X . . . . . . . . . . . . X",
  " X . . . X X X X X X X X X X . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . X X X X X X X X X X . . . X",
  " X . . . X . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . X . . . X",
  " X X X X X . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . X X X X X",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",//-- 40
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",//---- 48
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",//-- 56
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
];                                                                                                                                  //-------- 64

// :::::::::::::::
// :: Rendering ::
// :::::::::::::::

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

const Keyboard = (callbacks) => {
  callbacks.down = callbacks.down || function(){};
  callbacks.up = callbacks.up || function(){};
  var key = {};
  document.addEventListener("keydown", e => { key[e.key] = 1; callbacks.down(e.key); });
  document.addEventListener("keyup", e => { key[e.key] = 0; callbacks.up(e.key); });
  return key;
};

const Mouse = () => {
  var mouse = [window.innerWidth * 0.5, window.innerHeight * 0.5];
  document.addEventListener("mousemove", e => { mouse[0] = e.pageX; mouse[1] = e.pageY; });
  document.addEventListener("mouseout", e => { mouse[0] = e.pageX; mouse[1] = e.pageY; });
  return mouse;
};

window.onload = () => {
  // Initialize canvas and defaults
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  var W = canvas.width = window.innerWidth;
  var H = canvas.height = window.innerHeight;
  canvas.style.margin = "0px";
  canvas.style.padding = "0px";
  ctx.font = "10px Arial";
  ctx.textBaseline = "middle"; 
  ctx.textAlign = "center";
  document.body.appendChild(canvas);
  document.body.style.background = "#404040";

  // Game state
  var game = Game(default_map_data);
  var acts = [];
  var move = (key) => {
    acts.push(key);
    act(game, key);
  };

  // Renderer state
  var project  = ([x,y]) => [x - pos[0] + W * 0.5, y - pos[1] + H * 0.5];
  var unproject = ([x,y]) => [x + pos[0] - W * 0.5, y + pos[1] - H * 0.5];
  var key = Keyboard({down: key => move(key)});
  var mouse = Mouse();
  var SIZ = 48;
  var pos = [0,SIZ*game.dim[1]*0.5];

  // Main loop
  const render = () => {

    // Time
    fps();
    var T = Date.now() / 1000;

    // heroes position
    pos[0] += ((key.ArrowRight||0) - (key.ArrowLeft||0)) * 12;
    pos[1] += ((key.ArrowDown||0) - (key.ArrowUp||0)) * 12;
    var idx = [Math.floor(pos[0] / SIZ), Math.floor(pos[1] / SIZ)];
    var ofs = [pos[0] % SIZ, pos[1] % SIZ];
    var scr = [Math.floor(W / SIZ * 0.5 + 2), Math.floor(H / SIZ * 0.5 + 2)]; // screen radius

    // Camera movement
    if ( mouse[0] <     16
      || mouse[0] > W - 16
      || mouse[1] <     16
      || mouse[1] > H - 16) {
      var dir = [mouse[0] - W * 0.5, mouse[1] - H * 0.5];
      var len = Math.sqrt(dir[0] * dir[0] + dir[1] * dir[1]);
      var mov = [dir[0] / len * 32, dir[1] / len * 32];
      pos[0] += mov[0];
      pos[1] += mov[1];
    }
    if (key[" "]) {
      var pid = game.turn % 10;
      pos[0] = game.heroes[pid].pos[0] * SIZ;
      pos[1] = game.heroes[pid].pos[1] * SIZ;
    }

    // Clears screen
    ctx.clearRect(0, 0, W, H);

    // Draws tiles
    for (var dj = -scr[1]; dj <= scr[1]; ++dj) {
      for (var di = -scr[0]; di <= scr[0]; ++di) {
        var [i,j] = [idx[0] + di, idx[1] + dj];
        var [x,y] = project([i * SIZ, j * SIZ]);
        var thing = get_thing(game, [i,j]);
        var floor = get_floor(game, [i,j]);

        // Info
        if (floor) {
          ctx.strokeStyle = "#606060";
          ctx.beginPath();
          ctx.rect(x, y, SIZ, SIZ);
          ctx.stroke();
          ctx.closePath();
          ctx.fillStyle = "#A0A0A0";
          ctx.fillText(i, x + SIZ * 0.5, y + SIZ * 0.25);
          ctx.fillText(j, x + SIZ * 0.5, y + SIZ * 0.75);
        }

        // Thing
        if (thing && thing.color) {
          ctx.fillStyle = thing.color;
          ctx.beginPath();
          ctx.rect(x, y, SIZ, SIZ);
          ctx.fill();
          ctx.closePath();
        }
      }
    }

    // Draws heroes
    //ctx.strokeStyle = ctx.fillStyle = "#000000";
    //var [x,y] = add2(project(pos), [-4, -4]);
    //ctx.beginPath();
    //ctx.rect(x, y, 8, 8);
    //ctx.fill();
    //ctx.closePath();

    // Draws minimap
    ctx.strokeStyle = ctx.fillStyle = "rgba(128,128,128,0.5)";
    ctx.beginPath();
    ctx.rect(W - 128, H - 128, 128, 128);
    ctx.fill();
    ctx.closePath();

    // Draws screen on minimap
    ctx.beginPath();
    ctx.fillStyle = "rgb(255,255,255,0.25)";
    var X0 = Math.min(Math.max(W - 128 + (idx[0] - scr[0] - 0) * 2, W - 128), W);
    var Y0 = Math.min(Math.max(H - 128 + (idx[1] - scr[1] - 0) * 2, H - 128), H);
    var X1 = Math.min(Math.max(W - 128 + (idx[0] + scr[0] + 1) * 2, W - 128), W);
    var Y1 = Math.min(Math.max(H - 128 + (idx[1] + scr[1] + 1) * 2, H - 128), H);
    ctx.rect(X0, Y0, X1 - X0, Y1 - Y0);
    ctx.fill();
    ctx.closePath();

    // Draws camera on minimap
    //ctx.beginPath();
    //ctx.fillStyle = "rgb(0,0,0)";
    //ctx.rect(W - 128 + idx[0] * 2, H - 128 + idx[1] * 2, 2, 2);
    //ctx.fill();
    //ctx.closePath();

    // Draws units on minimap
    for (var j = 0; j < game.dim[1]; ++j) {
      for (var i = 0; i < game.dim[1]; ++i) {
        var [x,y] = [W - 128 + i * 2, H - 128 + j * 2];
        var floor = get_floor(game, [i, j]);
        var thing = get_thing(game, [i, j]);

        // Thing
        if (thing && thing.color) {
          ctx.fillStyle = thing.color;
          ctx.beginPath();
          ctx.rect(x, y, 2, 2);
          ctx.fill();
          ctx.closePath();
        }
      }
    }


    window.requestAnimationFrame(render);
  };

  window.requestAnimationFrame(render);
};
