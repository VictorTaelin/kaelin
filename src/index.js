// ::::::::::::
// :: Vector ::
// ::::::::::::

const add2 = ([ax,ay],[bx,by]) => [ax + bx, ay + by];
const floor2 = ([ax,ay]) => [Math.floor(ax), Math.floor(ay)];

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
  dir: [1,0],
  hp: 0,
});

const Wall = () => ({
  pid: null,
  color: "#202020",
  walks: false,
  walkable: false,
  speed: 0,
  dir: [1,0],
  hp: 0,
});

const Throne = () => ({
  pid: null,
  color: "#E04020",
  walks: false,
  walkable: true,
  speed: 0,
  dir: [1,0],
  hp: 0,
});

const Guard = () => ({
  pid: null,
  color: "#203020",
  walks: true,
  walkable: false,
  speed: 0,
  dir: [1,0],
  hp: 32,
});

const Hero = (pid) => ({
  pid: pid,
  face: pid < 5 ? "right" : "left",
  dir: pid < 5 ? [1,0] : [-1,0],
  color: "#809080",
  walks: true,
  walkable: false,
  speed: 4,
  hp: 32,
  steps: 0,
  last_attack: 0,
  last_step: 0,
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
      hero.dir = {a:[-1,0], s:[0,1], d:[1,0], w:[0,-1]}[key];
      walk(game, pos);
      break;
    case "e":
    case "q":
    case "z":
    case "x":
    case "c":
      hero.last_attack = Date.now() / 1000;
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

const swap = (game, pos_a, pos_b) => {
  var a = get_thing(game, pos_a);
  var b = get_thing(game, pos_b);
  set_thing(game, pos_a, b);
  set_thing(game, pos_b, a);
  if (a.pid !== null) game.heroes[a.pid].pos = pos_b;
  if (b.pid !== null) game.heroes[b.pid].pos = pos_a;
};

const get_active_pos = (game, inc = 0) => {
  return game.heroes[(game.turn + (inc + 10)) % 10].pos;
};

const get_active_hero = (game, inc = 0) => {
  return get_thing(game, get_active_pos(game, inc));
};

const walk = (game, a_pos) => {
  var a_val = get_thing(game, a_pos);
  if (a_val && a_val.walks) {
    var b_pos = add2(a_pos, a_val.dir);
    var b_val = get_thing(game, b_pos);
    if (b_val && b_val.walkable) {
      a_val.steps += 1;
      a_val.last_step = Date.now() / 1000;
      //console.log(a_val.steps);
      swap(game, a_pos, b_pos);
      if (a_val.steps >= a_val.speed) {
        end_turn(game);
      }
      if (a_val.dir[0] > 0) {
        a_val.face = "right";
      } else if (a_val.dir[0] < 0) {
        a_val.face = "left";
      }
      return true;
    }
  }
  return false;
};


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


const images = {
  thief: {
    right: [
      Image("thief/frame_00r.gif", [-28,-6], 1),
      Image("thief/frame_01r.gif", [-28,-6], 1),
      Image("thief/frame_02r.gif", [-28,-6], 1),
      Image("thief/frame_03r.gif", [-28,-6], 1),
      Image("thief/frame_04r.gif", [-28,-6], 1),
      Image("thief/frame_05r.gif", [-28,-6], 1),
      Image("thief/frame_06r.gif", [-28,-6], 1),
      Image("thief/frame_07r.gif", [-28,-6], 1),
      Image("thief/frame_08r.gif", [-28,-6], 1),
      Image("thief/frame_09r.gif", [-28,-6], 1),
      Image("thief/frame_10r.gif", [-28,-6], 1),
      Image("thief/frame_11r.gif", [-28,-6], 1),
      Image("thief/frame_12r.gif", [-28,-6], 1),
      Image("thief/frame_13r.gif", [-28,-6], 1),
      Image("thief/frame_14r.gif", [-28,-6], 1),
      Image("thief/frame_15r.gif", [-28,-6], 1),
      Image("thief/frame_16r.gif", [-28,-6], 1),
      Image("thief/frame_17r.gif", [-28,-6], 1),
      Image("thief/frame_18r.gif", [-28,-6], 1),
      Image("thief/frame_19r.gif", [-28,-6], 1),
      Image("thief/frame_20r.gif", [-28,-6], 1),
      Image("thief/frame_21r.gif", [-28,-6], 1),
      Image("thief/frame_22r.gif", [-28,-6], 1),
    ],
    left: [
      Image("thief/frame_00.gif", [-28,-6], 0),
      Image("thief/frame_01.gif", [-28,-6], 0),
      Image("thief/frame_02.gif", [-28,-6], 0),
      Image("thief/frame_03.gif", [-28,-6], 0),
      Image("thief/frame_04.gif", [-28,-6], 0),
      Image("thief/frame_05.gif", [-28,-6], 0),
      Image("thief/frame_06.gif", [-28,-6], 0),
      Image("thief/frame_07.gif", [-28,-6], 0),
      Image("thief/frame_08.gif", [-28,-6], 0),
      Image("thief/frame_09.gif", [-28,-6], 0),
      Image("thief/frame_10.gif", [-28,-6], 0),
      Image("thief/frame_11.gif", [-28,-6], 0),
      Image("thief/frame_12.gif", [-28,-6], 0),
      Image("thief/frame_13.gif", [-28,-6], 0),
      Image("thief/frame_14.gif", [-28,-6], 0),
      Image("thief/frame_15.gif", [-28,-6], 0),
      Image("thief/frame_16.gif", [-28,-6], 0),
      Image("thief/frame_17.gif", [-28,-6], 0),
      Image("thief/frame_18.gif", [-28,-6], 0),
      Image("thief/frame_19.gif", [-28,-6], 0),
      Image("thief/frame_20.gif", [-28,-6], 0),
      Image("thief/frame_21.gif", [-28,-6], 0),
      Image("thief/frame_22.gif", [-28,-6], 0),
    ],
  }
};

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
}

window.onload = () => {
  // Game state
  var game = Game(default_map_data);
  var acts = [];

  // UI state
  var screen_width  = window.innerWidth;
  var screen_height = window.innerHeight;
  var tile_size     = 32;
  var canvas        = Canvas(screen_width, screen_height);
  var key           = Keyboard({down: key => { acts.push(key); act(game, key); }});
  var mouse         = Mouse();
  var center_pos    = [2, 32];
  var pos_to_coord  = ([i,j]) => [(i - center_pos[0]) * tile_size + screen_width * 0.5, (j - center_pos[1]) * tile_size + screen_height * 0.5];
  var screen_rad    = [Math.floor(screen_width / tile_size * 0.5 + 2), Math.floor(screen_height / tile_size * 0.5 + 2)]; // in tiles
  var focus_hero    = true;
  document.body.style.background = 'url("img/grass.png")';
  document.body.appendChild(canvas);

  // Performs camera movements
  const camera_movements = () => {
    var pressing_arrow = key.ArrowRight || key.ArrowLeft || key.ArrowDown || key.ArrowUp;
    var pushing_screen = mouse[0] < 16 || mouse[0] > screen_width - 16 || mouse[1] < 16 || mouse[1] > screen_height - 16;
    var pressing_space = key[" "];
    
    // Manual movements
    if (pressing_arrow || pushing_screen) {
      focus_hero = false;
      if (pressing_arrow) {
        center_pos[0] += ((key.ArrowRight||0) - (key.ArrowLeft||0)) * 12 / tile_size;
        center_pos[1] += ((key.ArrowDown||0) - (key.ArrowUp||0)) * 12 / tile_size;
      } 
      if (pushing_screen) {
        var push_dir = [mouse[0] - screen_width * 0.5, mouse[1] - screen_height * 0.5];
        var push_len = Math.sqrt(push_dir[0] * push_dir[0] + push_dir[1] * push_dir[1]);
        var push_vec = [push_dir[0] / push_len, push_dir[1] / push_len];
        center_pos[0] += push_vec[0];
        center_pos[1] += push_vec[1];
      }

    // Focus active hero
    } else if (pressing_space || focus_hero) {
      focus_hero = true;
      //var pid = game.turn % 10;
      // If the last active hero just moved, focus it for a while
      //var last_active_hero = get_active_hero(game, -1);
      //if (T - last_active_hero.last_step < walk_anim_duration) {
        //center_coord = walk_anim_pos(last_active_hero, get_active_pos(game, -1));
      // Otherwise, focus the actual active hero
      //} else {
      //center_coord = walk_anim_pos(get_active_hero(game), get_active_pos(game));
      //}
      center_pos = [...get_active_pos(game)];
    }
  };

  // Main loop
  const render = () => {

    // Time
    fps();
    var T = Date.now() / 1000;

    // User inputs
    camera_movements();
    var center_coord = pos_to_coord(center_pos);

    // Background
    document.body.style["background-position"] = "right " + center_coord[0] + "px bottom " + center_coord[1] + "px";

    // Clears screen
    canvas.context.clearRect(0, 0, screen_width, screen_height);

    // Draws grid
    for (var dj = -screen_rad[1]; dj <= screen_rad[1]; ++dj) {
      for (var di = -screen_rad[0]; di <= screen_rad[0]; ++di) {
        var [i,j] = [Math.floor(center_pos[0]) + di, Math.floor(center_pos[1]) + dj];
        var [x,y] = pos_to_coord([i, j]);
        var floor = get_floor(game, [i,j]);
        if (floor) {
          canvas.context.strokeStyle = "rgba(128,128,128,0.15)";
          canvas.context.beginPath();
          canvas.context.rect(x, y, tile_size, tile_size);
          canvas.context.stroke();
          canvas.context.closePath();
        }
      }
    }

    // Draws tiles
    for (var dj = -screen_rad[1]; dj <= screen_rad[1]; ++dj) {
      for (var di = -screen_rad[0]; di <= screen_rad[0]; ++di) {
        var [i,j] = [Math.floor(center_pos[0]) + di, Math.floor(center_pos[1]) + dj];
        var [x,y] = pos_to_coord([i, j]);
        var thing = get_thing(game, [i,j]);
        var floor = get_floor(game, [i,j]);

        // Thing
        if (thing && thing.color) {
          if (thing.pid !== null) {
            //var [x,y] = project(walk_anim_pos(thing, [i,j]));
            var frame = T - thing.last_attack < 1.375 ? Math.floor(((T - thing.last_attack) * 16) % 22) : 0;
            var image = images.thief[thing.face][frame];
            canvas.context.drawImage(image, x + image.offset[0] + tile_size * 0.5, y + image.offset[1] + tile_size * 0.5);
          } else {
            canvas.context.fillStyle = thing.color;
            canvas.context.beginPath();
            canvas.context.rect(x, y, tile_size, tile_size);
            canvas.context.fill();
            canvas.context.closePath();
          }
        }
      }
    }

    // Draws heroes
    //canvas.context.strokeStyle = canvas.context.fillStyle = "#000000";
    //var [x,y] = add2(project(pos), [-4, -4]);
    //canvas.context.beginPath();
    //canvas.context.rect(x, y, 8, 8);
    //canvas.context.fill();
    //canvas.context.closePath();

    // Draws minimap
    canvas.context.strokeStyle = canvas.context.fillStyle = "rgba(128,128,128,0.5)";
    canvas.context.beginPath();
    canvas.context.rect(screen_width - 128, screen_height - 128, 128, 128);
    canvas.context.fill();
    canvas.context.closePath();

    // Draws screen on minimap
    canvas.context.beginPath();
    canvas.context.fillStyle = "rgb(255,255,255,0.25)";
    var X0 = Math.min(Math.max(screen_width - 128 + (Math.floor(center_pos[0]) - screen_rad[0] - 0) * 2, screen_width - 128), screen_width);
    var Y0 = Math.min(Math.max(screen_height - 128 + (Math.floor(center_pos[1]) - screen_rad[1] - 0) * 2, screen_height - 128), screen_height);
    var X1 = Math.min(Math.max(screen_width - 128 + (Math.floor(center_pos[0]) + screen_rad[0] + 1) * 2, screen_width - 128), screen_width);
    var Y1 = Math.min(Math.max(screen_height - 128 + (Math.floor(center_pos[1]) + screen_rad[1] + 1) * 2, screen_height - 128), screen_height);
    canvas.context.rect(X0, Y0, X1 - X0, Y1 - Y0);
    canvas.context.fill();
    canvas.context.closePath();

    // Draws camera on minimap
    //canvas.context.beginPath();
    //canvas.context.fillStyle = "rgb(0,0,0)";
    //canvas.context.rect(screen_width - 128 + center_pos[0] * 2, screen_height - 128 + center_pos[1] * 2, 2, 2);
    //canvas.context.fill();
    //canvas.context.closePath();

    // Draws units on minimap
    for (var j = 0; j < game.dim[1]; ++j) {
      for (var i = 0; i < game.dim[1]; ++i) {
        var [x,y] = [screen_width - 128 + i * 2, screen_height - 128 + j * 2];
        var floor = get_floor(game, [i, j]);
        var thing = get_thing(game, [i, j]);

        // Thing
        if (thing && thing.color) {
          canvas.context.fillStyle = thing.color;
          canvas.context.beginPath();
          canvas.context.rect(x, y, 2, 2);
          canvas.context.fill();
          canvas.context.closePath();
        }
      }
    }


    window.requestAnimationFrame(render);
  };

  window.requestAnimationFrame(render);
};


// Walk animation
//var walk_anim_duration = 0.25;
//const walk_anim_pos = (thing, pos) => {
  //var x = pos[0] * tile_size;
  //var y = pos[1] * tile_size;
  //if (T - thing.last_step < walk_anim_duration) {
    //var s = (T - thing.last_step) / walk_anim_duration;
    //var d = thing.dir;
    //x -= (1 - s) * d[0] * tile_size;
    //y -= (1 - s) * d[1] * tile_size;
  //}
  //return [x,y];
//};
