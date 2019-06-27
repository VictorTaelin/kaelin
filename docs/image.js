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
  //document.body.appendChild(image);
  return image;
};

// Images
const images = {
  item: {
    hourglass: Image("item/hourglass.png", [16,16], 1)
  },
  croni: {
    left: [
      Image("heroes/croni.png", [250,250], 1),
    ]
  },
  tophoro: {
    left: [
      Image("heroes/tophoro.png", [250,250], 1),
    ]
  },
  gonk: {
    left: [
      Image("heroes/gonk.png", [250,250], 1),
    ]
  },
  stanci: {
    left: [
      Image("heroes/stanci.png", [250,250], 1),
    ]
  },
  erkos: {
    left: [
      Image("heroes/erkos.png", [250,250], 1),
    ]
  },
  croni: {
    left: [
      Image("heroes/croni.png", [250,250], 1),
    ]
  },
  snarch: {
    left: [
      Image("heroes/snarch.png", [250,250], 1),
    ]
  },
  sirpix: {
    left: [
      Image("heroes/sirpix.png", [250,250], 1),
    ]
  },
  kenlua: {
    left: [
      Image("heroes/kenlua.png", [250,250], 1),
    ]
  },
  flina: {
    left: [
      Image("heroes/flina.png", [250,250], 1),
    ]
  },
  zagatur: {
    left: [
      Image("heroes/zagatur.png", [250,250], 1),
    ]
  },
  agdris: {
    left: [
      Image("heroes/agdris.png", [250,250], 1),
    ]
  },
  mewem: {
    left: [
      Image("heroes/mewem.png", [250,250], 1),
    ]
  },
  //thief: {
    //right: [
      //Image("thief/frame_00r.gif", [-28,-16], 1),
      //Image("thief/frame_01r.gif", [-28,-16], 1),
      //Image("thief/frame_02r.gif", [-28,-16], 1),
      //Image("thief/frame_03r.gif", [-28,-16], 1),
      //Image("thief/frame_04r.gif", [-28,-16], 1),
      //Image("thief/frame_05r.gif", [-28,-16], 1),
      //Image("thief/frame_06r.gif", [-28,-16], 1),
      //Image("thief/frame_07r.gif", [-28,-16], 1),
      //Image("thief/frame_08r.gif", [-28,-16], 1),
      //Image("thief/frame_09r.gif", [-28,-16], 1),
      //Image("thief/frame_10r.gif", [-28,-16], 1),
      //Image("thief/frame_11r.gif", [-28,-16], 1),
      //Image("thief/frame_12r.gif", [-28,-16], 1),
      //Image("thief/frame_13r.gif", [-28,-16], 1),
      //Image("thief/frame_14r.gif", [-28,-16], 1),
      //Image("thief/frame_15r.gif", [-28,-16], 1),
      //Image("thief/frame_16r.gif", [-28,-16], 1),
      //Image("thief/frame_17r.gif", [-28,-16], 1),
      //Image("thief/frame_18r.gif", [-28,-16], 1),
      //Image("thief/frame_19r.gif", [-28,-16], 1),
      //Image("thief/frame_20r.gif", [-28,-16], 1),
      //Image("thief/frame_21r.gif", [-28,-16], 1),
      //Image("thief/frame_22r.gif", [-28,-16], 1),
    //],
    //left: [
      //Image("thief/frame_00.gif", [-28,-16], 0),
      //Image("thief/frame_01.gif", [-28,-16], 0),
      //Image("thief/frame_02.gif", [-28,-16], 0),
      //Image("thief/frame_03.gif", [-28,-16], 0),
      //Image("thief/frame_04.gif", [-28,-16], 0),
      //Image("thief/frame_05.gif", [-28,-16], 0),
      //Image("thief/frame_06.gif", [-28,-16], 0),
      //Image("thief/frame_07.gif", [-28,-16], 0),
      //Image("thief/frame_08.gif", [-28,-16], 0),
      //Image("thief/frame_09.gif", [-28,-16], 0),
      //Image("thief/frame_10.gif", [-28,-16], 0),
      //Image("thief/frame_11.gif", [-28,-16], 0),
      //Image("thief/frame_12.gif", [-28,-16], 0),
      //Image("thief/frame_13.gif", [-28,-16], 0),
      //Image("thief/frame_14.gif", [-28,-16], 0),
      //Image("thief/frame_15.gif", [-28,-16], 0),
      //Image("thief/frame_16.gif", [-28,-16], 0),
      //Image("thief/frame_17.gif", [-28,-16], 0),
      //Image("thief/frame_18.gif", [-28,-16], 0),
      //Image("thief/frame_19.gif", [-28,-16], 0),
      //Image("thief/frame_20.gif", [-28,-16], 0),
      //Image("thief/frame_21.gif", [-28,-16], 0),
      //Image("thief/frame_22.gif", [-28,-16], 0),
    //],
  //}
};

module.exports = {Image, images};
