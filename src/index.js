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
  face: pid < 4 ? "right" : "left",
  dir: pid < 4 ? [1,0] : [-1,0],
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

const get_active_pos = (game) => {
  return game.heroes[game.turn % 8].pos;
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
  " . . . . . . . . . . . . . . . . . . . . . . . . . X X X X X T X",//--------0
  " . . . . . . . . . . . . . . . . . . . . . . . . . X . . 7 6 . T",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 5 X",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 4 X",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . X",
  " . . . . . . . . . . . . . . . . . . . . . . . . . X . . . . . X",
  " . . . . . . . . . . . . . . . . . . . . . . . . . X X . . . X X",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",//-- 8
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",//---- 16
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",//-- 24
  " X X . . . X X . . . . . . . . . . . . . . . . . . . . . . . . .",
  " X . . . . . X . . . . . . . . . . . . . . . . . . . . . . . . .",
  " X . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " X 0 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " X 1 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
  " T . 2 3 . . X . . . . . . . . . . . . . . . . . . . . . . . . .",
  " X T X X X X X . . . . . . . . . . . . . . . . . . . . . . . . .",
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
  console.log(game);
  var acts = [];

  // UI state
  var screen_width  = window.innerWidth;
  var screen_height = window.innerHeight;
  var canvas        = Canvas(screen_width, screen_height);
  var tile_size     = 16;
  var key           = Keyboard({down: key => { acts.push(key); act(game, key); }});
  var pos_to_coord  = ([i,j]) => [i * tile_size, j * tile_size];
  //document.body.style.background = 'url("img/grass.png")';
  document.body.appendChild(canvas);

  // Performs camera movements
  // Main loop
  const render = () => {

    // Time
    fps();
    var T = Date.now() / 1000;

    // Clears screen
    canvas.context.clearRect(0, 0, screen_width, screen_height);

    // Draws grid
    for (var j = 0; j < game.dim[1]; ++j) {
      for (var i = 0; i < game.dim[0]; ++i) { 
        var [x,y] = pos_to_coord([i,j]);
        canvas.context.strokeStyle = "rgba(128,128,128,0.15)";
        canvas.context.beginPath();
        canvas.context.rect(x, y, tile_size, tile_size);
        canvas.context.stroke();
        canvas.context.closePath();
      }
    }

    // Draws tiles
    for (var j = 0; j < game.dim[1]; ++j) {
      for (var i = 0; i < game.dim[0]; ++i) { 
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

    window.requestAnimationFrame(render);
  };

  window.requestAnimationFrame(render);
};

