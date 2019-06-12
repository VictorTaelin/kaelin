/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// ::::::::::::\n// :: Vector ::\n// ::::::::::::\n\nconst add2 = ([ax,ay],[bx,by]) => [ax + bx, ay + by];\nconst floor2 = ([ax,ay]) => [Math.floor(ax), Math.floor(ay)];\n\n// :::::::::::\n// :: Floor ::\n// :::::::::::\n\nconst Empty = () => ({});\n\n// :::::::::::\n// :: Thing ::\n// :::::::::::\n\nconst Void = () => ({\n  pid: null,\n  color: null,\n  walks: false,\n  walkable: true,\n  speed: 0,\n  dir: [1,0],\n  hp: 0,\n});\n\nconst Wall = () => ({\n  pid: null,\n  color: \"#202020\",\n  walks: false,\n  walkable: false,\n  speed: 0,\n  dir: [1,0],\n  hp: 0,\n});\n\nconst Throne = () => ({\n  pid: null,\n  color: \"#E04020\",\n  walks: false,\n  walkable: true,\n  speed: 0,\n  dir: [1,0],\n  hp: 0,\n});\n\nconst Guard = () => ({\n  pid: null,\n  color: \"#203020\",\n  walks: true,\n  walkable: false,\n  speed: 0,\n  dir: [1,0],\n  hp: 32,\n});\n\nconst Hero = (pid) => ({\n  pid: pid,\n  face: pid < 4 ? \"right\" : \"left\",\n  dir: pid < 4 ? [1,0] : [-1,0],\n  color: \"#809080\",\n  walks: true,\n  walkable: false,\n  speed: 4,\n  hp: 32,\n  steps: 0,\n  last_attack: 0,\n  last_step: 0,\n});\n\n// :::::::::\n// :: Game ::\n// :::::::::\n\nconst Game = (data) => {\n  var heroes = {A: {}, B: {}};\n  var dim = [data[0].length / 2, data.length];\n  var map = data.map((line,j) => {\n    var arr = [];\n    for (var i = 0; i < dim[0]; ++i) {\n      const pos = [i,j];\n      const Floor = (chr) => {\n        switch (chr) {\n          default : return Empty();\n        }\n      }\n      const Thing = (chr) => {\n        switch (chr) {\n          case \"X\" : return Wall();\n          case \"T\" : return Throne();\n          case \"G\" : return Guard();\n          case \"0\" : heroes[0] = {pos}; return Hero(0);\n          case \"1\" : heroes[1] = {pos}; return Hero(1);\n          case \"2\" : heroes[2] = {pos}; return Hero(2);\n          case \"3\" : heroes[3] = {pos}; return Hero(3);\n          case \"4\" : heroes[4] = {pos}; return Hero(4);\n          case \"5\" : heroes[5] = {pos}; return Hero(5);\n          case \"6\" : heroes[6] = {pos}; return Hero(6);\n          case \"7\" : heroes[7] = {pos}; return Hero(7);\n          default  : return Void();\n        }\n      }\n      arr[i] = [Floor(line[i * 2]), Thing(line[i * 2 + 1])];\n    }\n    return arr;\n  });\n  return {dim, map, heroes, turn: 0};\n};\n\nconst end_turn = (game) => {\n  var hero = get_active_hero(game);\n  hero.steps = 0;\n  game.turn += 1;\n};\n\nconst act = (game, key) => {\n  var pos  = get_active_pos(game);\n  var hero = get_active_hero(game);\n  switch (key) {\n    case \"a\":\n    case \"s\":\n    case \"d\":\n    case \"w\":\n      hero.dir = {a:[-1,0], s:[0,1], d:[1,0], w:[0,-1]}[key];\n      walk(game, pos);\n      break;\n    case \"e\":\n    case \"q\":\n    case \"z\":\n    case \"x\":\n    case \"c\":\n      hero.last_attack = Date.now() / 1000;\n      break;\n    case \"Enter\":\n      end_turn(game);\n      break;\n  }\n};\n\nconst get_floor = (game, pos) => game.map[pos[1]] && game.map[pos[1]][pos[0]] && game.map[pos[1]][pos[0]][0] || null;\nconst get_thing = (game, pos) => game.map[pos[1]] && game.map[pos[1]][pos[0]] && game.map[pos[1]][pos[0]][1] || null;\nconst set_floor = (game, pos, thing) => game.map[pos[1]][pos[0]][0] = thing;\nconst set_thing = (game, pos, thing) => game.map[pos[1]][pos[0]][1] = thing;\n\nconst swap = (game, pos_a, pos_b) => {\n  var a = get_thing(game, pos_a);\n  var b = get_thing(game, pos_b);\n  set_thing(game, pos_a, b);\n  set_thing(game, pos_b, a);\n  if (a.pid !== null) game.heroes[a.pid].pos = pos_b;\n  if (b.pid !== null) game.heroes[b.pid].pos = pos_a;\n};\n\nconst get_active_pos = (game) => {\n  return game.heroes[game.turn % 8].pos;\n};\n\nconst get_active_hero = (game, inc = 0) => {\n  return get_thing(game, get_active_pos(game, inc));\n};\n\nconst walk = (game, a_pos) => {\n  var a_val = get_thing(game, a_pos);\n  if (a_val && a_val.walks) {\n    var b_pos = add2(a_pos, a_val.dir);\n    var b_val = get_thing(game, b_pos);\n    if (b_val && b_val.walkable) {\n      a_val.steps += 1;\n      a_val.last_step = Date.now() / 1000;\n      //console.log(a_val.steps);\n      swap(game, a_pos, b_pos);\n      if (a_val.steps >= a_val.speed) {\n        end_turn(game);\n      }\n      if (a_val.dir[0] > 0) {\n        a_val.face = \"right\";\n      } else if (a_val.dir[0] < 0) {\n        a_val.face = \"left\";\n      }\n      return true;\n    }\n  }\n  return false;\n};\n\n\nconst default_map_data = [\n// |               ,               ;               .               |               ,               ;               ,               |\n  \" . . . . . . . . . . . . . . . . . . . . . . . . . X X X X X T X\",//--------0\n  \" . . . . . . . . . . . . . . . . . . . . . . . . . X . . 7 6 . T\",\n  \" . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 5 X\",\n  \" . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 4 X\",\n  \" . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . X\",\n  \" . . . . . . . . . . . . . . . . . . . . . . . . . X . . . . . X\",\n  \" . . . . . . . . . . . . . . . . . . . . . . . . . X X . . . X X\",\n  \" . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\",\n  \" . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\",//-- 8\n  \" . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\",\n  \" . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\",\n  \" . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\",\n  \" . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\",\n  \" . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\",\n  \" . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\",\n  \" . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\",\n  \" . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\",//---- 16\n  \" . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\",\n  \" . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\",\n  \" . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\",\n  \" . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\",\n  \" . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\",\n  \" . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\",\n  \" . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\",\n  \" . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\",//-- 24\n  \" X X . . . X X . . . . . . . . . . . . . . . . . . . . . . . . .\",\n  \" X . . . . . X . . . . . . . . . . . . . . . . . . . . . . . . .\",\n  \" X . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\",\n  \" X 0 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\",\n  \" X 1 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\",\n  \" T . 2 3 . . X . . . . . . . . . . . . . . . . . . . . . . . . .\",\n  \" X T X X X X X . . . . . . . . . . . . . . . . . . . . . . . . .\",\n];                                                                                                                                  //-------- 64\n\n// :::::::::::::::\n// :: Rendering ::\n// :::::::::::::::\n\nconst fps = (function fps() {\n  var fps = 0;\n  var frames = 0;\n  var last = Date.now() / 1000;\n  return function frame() {\n    ++frames;\n    if (Date.now() / 1000 - last > 1) {\n      fps = frames;\n      console.log(\"fps:\" + fps);\n      frames = 0;\n      last = Date.now() / 1000;\n    }\n  };\n})();\n\nconst Keyboard = (callbacks) => {\n  callbacks.down = callbacks.down || function(){};\n  callbacks.up = callbacks.up || function(){};\n  var key = {};\n  document.addEventListener(\"keydown\", e => { key[e.key] = 1; callbacks.down(e.key); });\n  document.addEventListener(\"keyup\", e => { key[e.key] = 0; callbacks.up(e.key); });\n  return key;\n};\n\nconst Image = (src, offset, flip) => {\n  var image = document.createElement(\"img\");\n  image.src = \"img/\" + src;\n  image.onload = () => {\n    if (flip) offset[0] = - offset[0];\n    offset[0] -= image.width * 0.5;\n    offset[1] -= image.height * 0.5;\n  };\n  image.offset = offset;\n  return image;\n};\n\n\nconst images = {\n  thief: {\n    right: [\n      Image(\"thief/frame_00r.gif\", [-28,-16], 1),\n      Image(\"thief/frame_01r.gif\", [-28,-16], 1),\n      Image(\"thief/frame_02r.gif\", [-28,-16], 1),\n      Image(\"thief/frame_03r.gif\", [-28,-16], 1),\n      Image(\"thief/frame_04r.gif\", [-28,-16], 1),\n      Image(\"thief/frame_05r.gif\", [-28,-16], 1),\n      Image(\"thief/frame_06r.gif\", [-28,-16], 1),\n      Image(\"thief/frame_07r.gif\", [-28,-16], 1),\n      Image(\"thief/frame_08r.gif\", [-28,-16], 1),\n      Image(\"thief/frame_09r.gif\", [-28,-16], 1),\n      Image(\"thief/frame_10r.gif\", [-28,-16], 1),\n      Image(\"thief/frame_11r.gif\", [-28,-16], 1),\n      Image(\"thief/frame_12r.gif\", [-28,-16], 1),\n      Image(\"thief/frame_13r.gif\", [-28,-16], 1),\n      Image(\"thief/frame_14r.gif\", [-28,-16], 1),\n      Image(\"thief/frame_15r.gif\", [-28,-16], 1),\n      Image(\"thief/frame_16r.gif\", [-28,-16], 1),\n      Image(\"thief/frame_17r.gif\", [-28,-16], 1),\n      Image(\"thief/frame_18r.gif\", [-28,-16], 1),\n      Image(\"thief/frame_19r.gif\", [-28,-16], 1),\n      Image(\"thief/frame_20r.gif\", [-28,-16], 1),\n      Image(\"thief/frame_21r.gif\", [-28,-16], 1),\n      Image(\"thief/frame_22r.gif\", [-28,-16], 1),\n    ],\n    left: [\n      Image(\"thief/frame_00.gif\", [-28,-16], 0),\n      Image(\"thief/frame_01.gif\", [-28,-16], 0),\n      Image(\"thief/frame_02.gif\", [-28,-16], 0),\n      Image(\"thief/frame_03.gif\", [-28,-16], 0),\n      Image(\"thief/frame_04.gif\", [-28,-16], 0),\n      Image(\"thief/frame_05.gif\", [-28,-16], 0),\n      Image(\"thief/frame_06.gif\", [-28,-16], 0),\n      Image(\"thief/frame_07.gif\", [-28,-16], 0),\n      Image(\"thief/frame_08.gif\", [-28,-16], 0),\n      Image(\"thief/frame_09.gif\", [-28,-16], 0),\n      Image(\"thief/frame_10.gif\", [-28,-16], 0),\n      Image(\"thief/frame_11.gif\", [-28,-16], 0),\n      Image(\"thief/frame_12.gif\", [-28,-16], 0),\n      Image(\"thief/frame_13.gif\", [-28,-16], 0),\n      Image(\"thief/frame_14.gif\", [-28,-16], 0),\n      Image(\"thief/frame_15.gif\", [-28,-16], 0),\n      Image(\"thief/frame_16.gif\", [-28,-16], 0),\n      Image(\"thief/frame_17.gif\", [-28,-16], 0),\n      Image(\"thief/frame_18.gif\", [-28,-16], 0),\n      Image(\"thief/frame_19.gif\", [-28,-16], 0),\n      Image(\"thief/frame_20.gif\", [-28,-16], 0),\n      Image(\"thief/frame_21.gif\", [-28,-16], 0),\n      Image(\"thief/frame_22.gif\", [-28,-16], 0),\n    ],\n  }\n};\n\nfunction Canvas(width, height) {\n  var canvas = document.createElement(\"canvas\");\n  canvas.width = width;\n  canvas.height = height;\n  canvas.style.margin = \"0px\";\n  canvas.style.padding = \"0px\";\n\n  var context = canvas.getContext(\"2d\");\n  context.imageSmoothingEnabled = false;\n  context.font = \"10px Arial\";\n  context.textBaseline = \"middle\"; \n  context.textAlign = \"center\";\n\n  canvas.context = context;\n\n  return canvas;\n}\n\nwindow.onload = () => {\n  // Game state\n  var game = Game(default_map_data);\n  console.log(game);\n  var acts = [];\n\n  // UI state\n  var screen_width  = window.innerWidth;\n  var screen_height = window.innerHeight;\n  var canvas        = Canvas(screen_width, screen_height);\n  var tile_size     = 16;\n  var key           = Keyboard({down: key => { acts.push(key); act(game, key); }});\n  var pos_to_coord  = ([i,j]) => [i * tile_size, j * tile_size];\n  //document.body.style.background = 'url(\"img/grass.png\")';\n  document.body.appendChild(canvas);\n\n  // Performs camera movements\n  // Main loop\n  const render = () => {\n\n    // Time\n    fps();\n    var T = Date.now() / 1000;\n\n    // Clears screen\n    canvas.context.clearRect(0, 0, screen_width, screen_height);\n\n    // Draws grid\n    for (var j = 0; j < game.dim[1]; ++j) {\n      for (var i = 0; i < game.dim[0]; ++i) { \n        var [x,y] = pos_to_coord([i,j]);\n        canvas.context.strokeStyle = \"rgba(128,128,128,0.15)\";\n        canvas.context.beginPath();\n        canvas.context.rect(x, y, tile_size, tile_size);\n        canvas.context.stroke();\n        canvas.context.closePath();\n      }\n    }\n\n    // Draws tiles\n    for (var j = 0; j < game.dim[1]; ++j) {\n      for (var i = 0; i < game.dim[0]; ++i) { \n        var [x,y] = pos_to_coord([i, j]);\n        var thing = get_thing(game, [i,j]);\n        var floor = get_floor(game, [i,j]);\n\n        // Thing\n        if (thing && thing.color) {\n          if (thing.pid !== null) {\n            //var [x,y] = project(walk_anim_pos(thing, [i,j]));\n            var frame = T - thing.last_attack < 1.375 ? Math.floor(((T - thing.last_attack) * 16) % 22) : 0;\n            var image = images.thief[thing.face][frame];\n            canvas.context.drawImage(image, x + image.offset[0] + tile_size * 0.5, y + image.offset[1] + tile_size * 0.5);\n          } else {\n            canvas.context.fillStyle = thing.color;\n            canvas.context.beginPath();\n            canvas.context.rect(x, y, tile_size, tile_size);\n            canvas.context.fill();\n            canvas.context.closePath();\n          }\n        }\n      }\n    }\n\n    window.requestAnimationFrame(render);\n  };\n\n  window.requestAnimationFrame(render);\n};\n\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });