const fm = require("formality-core");

//try {
  var code = require("./../../moonad/formality/stdlib/_export_to_webpack_.js");
//} catch (e) {
  //var code = require("./../../formality-core/examples/_export_to_node_.js");
//}

const {infs, defs} = fm.core.parse(code);
const compile      = name => fm.to_js.compile(defs[name], defs);
const Cons         = compile("Cons");
const Nil          = compile("Nil");
const
  [new_board,
  [cast,
  [print_board,
  [unit_to_scott,
  [get_skill_priority,
  [get_skill_area,
  [get_at,
  [end_turn,
  [TOPHORO,
  [GONK,
  [STANCI,
  [HERO_03,
  [ERKOS,
  [CRONI,
  [SNARCH,
  [HERO_07,
  [SIRPIX,
  [KENLUA,
  [FLINA,
  [HERO_11,
  [ZAGATUR,
  [AGDRIS,
  [MEWEM,
  [HERO_15,
  ]]]]]]]]]]]]]]]]]]]]]]]]
  = compile("kaelin");

const sort_casts = casts => {
  var map = {};
  for (var i = 0; i < casts.length; ++i) {
    map[get_skill_priority(casts[i][0])] = casts[i];
  }
  var new_casts = [];
  for (var i = 0; i < 64; ++i) {
    if (map[i]) {
      new_casts.push(map[i]);
    }
  }
  return new_casts;
};

const skill_name = {
  0: "TOPHORO_WALK",
  1: "EARTH_ROOT",
  2: "EARTH_WALL",
  3: "EARTH_RISE",
  4: "GONK_WALK",
  5: "EMPATHY",
  6: "REVENGE",
  7: "GROUND_SLAM",
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
  25: "BALLISTA",
  26: "QUICK_BOLT_0",
  27: "QUICK_BOLT_1",
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

// Converts board to JSON
const unit_to_json = unit => {
  let case_void = ["Void"];
  let case_item = type => ["Item", {type}];
  let case_goal = side => ["Goal", {side}];
  let case_hero = side => hero => life => defs => eff1 => lock => mute => spec => ["Hero", {side, hero, life, defs, eff1, lock, mute, spec}];
  return unit_to_scott(unit)(case_void)(case_item)(case_goal)(case_hero);
};

// Converts board to JSON
const board_to_json = (val, i = 0) => {
  if (i < 8) {
    return board_to_json(val[0], i + 1).concat(board_to_json(val[1], i + 1));
  } else {
    return [unit_to_json(val)];
  }
};

module.exports = {
  sort_casts,
  Cons,
  Nil,
  new_board,
  cast,
  print_board,
  unit_to_scott,
  get_skill_priority,
  get_skill_area,
  get_at,
  end_turn,
  skill_name,
  hero_name,
  unit_to_json,
  board_to_json,
  TOPHORO,
  GONK,
  STANCI,
  HERO_03,
  ERKOS,
  CRONI,
  SNARCH,
  HERO_07,
  SIRPIX,
  KENLUA,
  FLINA,
  HERO_11,
  ZAGATUR,
  AGDRIS,
  MEWEM,
  HERO_15,
};
