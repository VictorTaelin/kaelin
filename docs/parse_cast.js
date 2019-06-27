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

  var words = code.split(" ").slice(0, 5);
  while (words.length < 5) {
    words.push(".");
  }

  var hero = parse_hero(words[0]);
  try { var walk = words[1] === "." ? null : parse_pos(words[1]); } catch (e) { throw e + " (When parsing walk.)"; }
  try { var skl0 = words[2] === "." ? null : parse_pos(words[2]); } catch (e) { throw e + " (When parsing skill 0.)" };
  try { var skl1 = words[3] === "." ? null : parse_pos(words[3]); } catch (e) { throw e + " (When parsing skill 1.)" };
  try { var skl2 = words[4] === "." ? null : parse_pos(words[4]); } catch (e) { throw e + " (When parsing skill 2.)" };

  return [[hero * 4 + 0, walk], [hero * 4 + 1, skl0], [hero * 4 + 2, skl1], [hero * 4 + 3, skl2]];
};

module.exports = parse_cast;
