// Image
const Image = (src) => {
  var image = document.createElement("img");
  image.src = "img/" + src;
  //image.onload = () => {
    //if (flip) offset[0] = - offset[0];
    //offset[0] -= image.width * 0.5;
    //offset[1] -= image.height * 0.5;
  //};
  //image.offset = offset;
  //document.body.appendChild(image);
  return image;
};

// Images
const images = {
  effects: {
    shadow_flux: [
      Image("effects/shadow_flux/shadow_flux-0.png"),
      Image("effects/shadow_flux/shadow_flux-1.png"),
      Image("effects/shadow_flux/shadow_flux-2.png"),
      Image("effects/shadow_flux/shadow_flux-3.png"),
      Image("effects/shadow_flux/shadow_flux-4.png"),
      Image("effects/shadow_flux/shadow_flux-5.png"),
      Image("effects/shadow_flux/shadow_flux-6.png"),
      Image("effects/shadow_flux/shadow_flux-7.png"),
      Image("effects/shadow_flux/shadow_flux-8.png"),
      Image("effects/shadow_flux/shadow_flux-9.png"),
      Image("effects/shadow_flux/shadow_flux-10.png"),
    ]
  },
  item: {
    hourglass: Image("item/hourglass.png")
  },
  tophoro: {
    left: [
      Image("heroes/tophoro.png"),
    ]
  },
  gonk: {
    left: [
      Image("heroes/gonk.png"),
    ]
  },
  stanci: {
    left: [
      Image("heroes/stanci.png"),
    ]
  },
  erkos: {
    left: [
      Image("heroes/erkos.png"),
    ]
  },
  croni: {
    idle: {
      left: [
        Image("croni/Idle/Croni_Idle_00.png"),
        Image("croni/Idle/Croni_Idle_01.png"),
        Image("croni/Idle/Croni_Idle_02.png"),
        Image("croni/Idle/Croni_Idle_03.png"),
        Image("croni/Idle/Croni_Idle_04.png"),
        Image("croni/Idle/Croni_Idle_05.png"),
        Image("croni/Idle/Croni_Idle_06.png"),
        Image("croni/Idle/Croni_Idle_07.png"),
        Image("croni/Idle/Croni_Idle_08.png"),
        Image("croni/Idle/Croni_Idle_09.png"),
        Image("croni/Idle/Croni_Idle_10.png"),
        Image("croni/Idle/Croni_Idle_11.png"),
        Image("croni/Idle/Croni_Idle_12.png"),
        Image("croni/Idle/Croni_Idle_13.png"),
        Image("croni/Idle/Croni_Idle_14.png"),
        Image("croni/Idle/Croni_Idle_15.png"),
        Image("croni/Idle/Croni_Idle_16.png"),
        Image("croni/Idle/Croni_Idle_17.png"),
        Image("croni/Idle/Croni_Idle_18.png"),
        Image("croni/Idle/Croni_Idle_19.png"),
        Image("croni/Idle/Croni_Idle_20.png"),
        Image("croni/Idle/Croni_Idle_21.png"),
        Image("croni/Idle/Croni_Idle_22.png"),
        Image("croni/Idle/Croni_Idle_23.png"),
      ]
    },
    move: {
      left: [
        Image("croni/Move_LR/Croni_Move_LR_0.png"),
        Image("croni/Move_LR/Croni_Move_LR_1.png"),
        Image("croni/Move_LR/Croni_Move_LR_2.png"),
        Image("croni/Move_LR/Croni_Move_LR_3.png"),
        Image("croni/Move_LR/Croni_Move_LR_4.png"),
        Image("croni/Move_LR/Croni_Move_LR_5.png"),
        Image("croni/Move_LR/Croni_Move_LR_6.png"),
        Image("croni/Move_LR/Croni_Move_LR_7.png"),
      ]
    },
    shadow_flux: {
      left: [
        Image("croni/Attack_LR/Croni_Attack_LR_00.png"),
        Image("croni/Attack_LR/Croni_Attack_LR_01.png"),
        Image("croni/Attack_LR/Croni_Attack_LR_02.png"),
        Image("croni/Attack_LR/Croni_Attack_LR_03.png"),
        Image("croni/Attack_LR/Croni_Attack_LR_04.png"),
        Image("croni/Attack_LR/Croni_Attack_LR_05.png"),
        Image("croni/Attack_LR/Croni_Attack_LR_06.png"),
        Image("croni/Attack_LR/Croni_Attack_LR_07.png"),
        Image("croni/Attack_LR/Croni_Attack_LR_08.png"),
        Image("croni/Attack_LR/Croni_Attack_LR_09.png"),
        Image("croni/Attack_LR/Croni_Attack_LR_10.png"),
        Image("croni/Attack_LR/Croni_Attack_LR_11.png"),
        Image("croni/Attack_LR/Croni_Attack_LR_12.png"),
        Image("croni/Attack_LR/Croni_Attack_LR_13.png"),
        Image("croni/Attack_LR/Croni_Attack_LR_14.png"),
        Image("croni/Attack_LR/Croni_Attack_LR_15.png"),
        Image("croni/Attack_LR/Croni_Attack_LR_16.png"),
        Image("croni/Attack_LR/Croni_Attack_LR_17.png"),
        Image("croni/Attack_LR/Croni_Attack_LR_18.png"),
        Image("croni/Attack_LR/Croni_Attack_LR_19.png"),
      ]
    }
  },
  snarch: {
    left: [
      Image("heroes/snarch.png"),
    ]
  },
  sirpix: {
    left: [
      Image("heroes/sirpix.png"),
    ]
  },
  kenlua: {
    left: [
      Image("heroes/kenlua.png"),
    ]
  },
  flina: {
    left: [
      Image("heroes/flina.png"),
    ]
  },
  zagatur: {
    left: [
      Image("heroes/zagatur.png"),
    ]
  },
  agdris: {
    left: [
      Image("heroes/agdris.png"),
    ]
  },
  mewem: {
    left: [
      Image("heroes/mewem.png"),
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
