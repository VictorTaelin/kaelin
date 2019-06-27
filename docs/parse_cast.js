const kaelin = require("./kaelin.js");

const parse_cast = (code) => {
  const parse_hero = (str) => {
    switch (str.toLowerCase()) {
      case "to": var hero = kaelin.TOPHORO ; break;
      case "go": var hero = kaelin.GONK    ; break;
      case "st": var hero = kaelin.STANCI  ; break;
      case "h3": var hero = kaelin.HERO_3  ; break;
      case "er": var hero = kaelin.ERKOS   ; break;
      case "cr": var hero = kaelin.CRONI   ; break;
      case "sn": var hero = kaelin.SNARCH  ; break;
      case "h7": var hero = kaelin.HERO_7  ; break;
      case "si": var hero = kaelin.SIRPIX  ; break;
      case "ke": var hero = kaelin.KENLUA  ; break;
      case "fl": var hero = kaelin.FLINA   ; break;
      case "hb": var hero = kaelin.HERO_B  ; break;
      case "za": var hero = kaelin.ZAGATUR ; break;
      case "ag": var hero = kaelin.AGDRIS  ; break;
      case "me": var hero = kaelin.MEWEM   ; break;
      case "hf": var hero = kaelin.HERO_F  ; break;
      default: throw "Invalid hero `" + code.slice(0,2) + "\`.";
    }
    return hero;
  };

  const parse_pos = (pos) => {
    if (pos.length !== 2 || !/[0-9a-fA-F]/.test(pos[0]) || !/[0-9a-fA-F]/.test(pos[1])) {
      throw "Invalid position `" + pos + "`.";
    }
    return [parseInt(pos[0], 16), parseInt(pos[1], 16)];
  };

  const parse_dir = (str) => {
    switch(str) {
      case "^": case "w": var dir = [ 0, -1]; break;
      case "v": case "s": var dir = [ 0,  1]; break;
      case "<": case "a": var dir = [-1,  0]; break;
      case ">": case "d": var dir = [ 1,  0]; break;
      default: throw "Invalid direction `" + str + "`.";
    }
    return dir;
  };

  const parse_dirs = (str) => {
    var dirs = kaelin.Nil;
    for (var i = 0; i < str.length; ++i) {
      dirs = kaelin.Cons(parse_dir(str[i]))(dirs);
    };
    return dirs;
  };

  const parse_num = (str) => {
    var num = Number(str);
    if (isNaN(num)) {
      throw "Invalid number `" + str + "`.";
    }
    return num;
  };

  const parse_nil = (str) => {
    return 0;
  };

  const get_arg_parser = {
    [kaelin.TOPHORO + "_0"]: parse_num,
    [kaelin.TOPHORO + "_1"]: parse_pos,
    [kaelin.TOPHORO + "_2"]: parse_dir,
    [kaelin.GONK    + "_0"]: parse_num,
    [kaelin.GONK    + "_1"]: parse_pos,
    [kaelin.GONK    + "_2"]: parse_nil,
    [kaelin.STANCI  + "_0"]: parse_pos,
    [kaelin.STANCI  + "_1"]: parse_pos,
    [kaelin.STANCI  + "_2"]: parse_pos,
    [kaelin.ERKOS   + "_0"]: parse_pos,
    [kaelin.ERKOS   + "_1"]: parse_dir,
    [kaelin.ERKOS   + "_2"]: parse_num,
    [kaelin.CRONI   + "_0"]: parse_pos,
    [kaelin.CRONI   + "_1"]: parse_pos,
    [kaelin.CRONI   + "_2"]: parse_pos,
    [kaelin.SNARCH  + "_0"]: parse_nil,
    [kaelin.SNARCH  + "_1"]: parse_dir,
    [kaelin.SNARCH  + "_2"]: parse_dir,
    [kaelin.SIRPIX  + "_0"]: parse_pos,
    [kaelin.SIRPIX  + "_1"]: parse_pos,
    [kaelin.SIRPIX  + "_2"]: parse_dir,
    [kaelin.KENLUA  + "_0"]: parse_pos,
    [kaelin.KENLUA  + "_1"]: parse_pos,
    [kaelin.KENLUA  + "_2"]: parse_dir,
    [kaelin.FLINA   + "_0"]: parse_pos,
    [kaelin.FLINA   + "_1"]: parse_pos,
    [kaelin.FLINA   + "_2"]: parse_dir,
    [kaelin.ZAGATUR + "_0"]: parse_nil,
    [kaelin.ZAGATUR + "_1"]: parse_dir,
    [kaelin.ZAGATUR + "_2"]: parse_pos,
    [kaelin.AGDRIS  + "_0"]: parse_pos,
    [kaelin.AGDRIS  + "_1"]: parse_pos,
    [kaelin.AGDRIS  + "_2"]: parse_pos,
    [kaelin.MEWRU   + "_0"]: parse_pos,
    [kaelin.MEWRU   + "_1"]: parse_nil,
    [kaelin.MEWRU   + "_2"]: parse_pos,
  };

  var words = code.split(" ").slice(0, 5);
  if (words.length < 5) {
    throw "Invalid number of words on cast.";
  };

  var hero = parse_hero(words[0]);
  try { var walk = parse_dirs(words[1]); } catch (e) { throw e + " (on walk)"; }
  try { var skl0 = words[2] === "." ? null : get_arg_parser[hero + "_0"](words[2]); } catch (e) { throw e + " (When parsing skill 0.)" };
  try { var skl1 = words[3] === "." ? null : get_arg_parser[hero + "_1"](words[3]); } catch (e) { throw e + " (When parsing skill 1.)" };
  try { var skl2 = words[4] === "." ? null : get_arg_parser[hero + "_2"](words[4]); } catch (e) { throw e + " (When parsing skill 2.)" };

  return [[hero * 4 + 0, walk], [hero * 4 + 1, skl0], [hero * 4 + 2, skl1], [hero * 4 + 3, skl2]];
};

module.exports = parse_cast;
