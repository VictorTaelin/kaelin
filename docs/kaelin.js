const fm = require("formality-core");

//try {
  var code = require("./../../formality-core/examples/_export_to_webpack_.js");
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
