const fm = require("formality-core");
const {infs, defs} = fm.core.parse(require("./../../formality-core/examples"));

// ::::::::::::
// :: Vector ::
// ::::::::::::

const add2 = ([ax,ay],[bx,by]) => [ax + bx, ay + by];
const floor2 = ([ax,ay]) => [Math.floor(ax), Math.floor(ay)];

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
  //console.log(require("./main.f

  console.log("ata", defs);
  console.log(fm.to_js.compile(defs.new_board, defs));

  // Game state
  //var game = Game(default_map_data);
  //console.log(game);
  //var acts = [];

  // UI state
  //var screen_width  = window.innerWidth;
  //var screen_height = window.innerHeight;
  //var canvas        = Canvas(screen_width, screen_height);
  //var tile_size     = 16;
  //var key           = Keyboard({down: key => { acts.push(key); act(game, key); }});
  //var pos_to_coord  = ([i,j]) => [i * tile_size, j * tile_size];
  ////document.body.style.background = 'url("img/grass.png")';
  //document.body.appendChild(canvas);

  // Performs camera movements
  // Main loop
  //const render = () => {

    //// Time
    //fps();
    //var T = Date.now() / 1000;

    //// Clears screen
    //canvas.context.clearRect(0, 0, screen_width, screen_height);

    //// Draws grid
    //for (var j = 0; j < game.dim[1]; ++j) {
      //for (var i = 0; i < game.dim[0]; ++i) { 
        //var [x,y] = pos_to_coord([i,j]);
        //canvas.context.strokeStyle = "rgba(128,128,128,0.15)";
        //canvas.context.beginPath();
        //canvas.context.rect(x, y, tile_size, tile_size);
        //canvas.context.stroke();
        //canvas.context.closePath();
      //}
    //}

    //// Draws tiles
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
    //}

    //window.requestAnimationFrame(render);
  //};

  //window.requestAnimationFrame(render);
};

