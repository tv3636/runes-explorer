import { AsepriteLayersAnimationLoaderPlugin } from "./plugins/asepriteLayersAnimationLoaderPlugin";
import TextTypingPlugin from "phaser3-rex-plugins/plugins/texttyping-plugin";
import { IntroScene } from "./scenes/IntroScene";
import { BootScene } from "./scenes/BootScene";
import { FallingScene } from "./scenes/FallingScene";

export default {
  pixelArt: true,
  backgroundColor: "000000",

  scene: [IntroScene, FallingScene, BootScene],

  scale: {
    mode: Phaser.Scale.RESIZE,
    zoom: 1 / window.devicePixelRatio,
    width: "100%",
    height: "100%",
    autoRound: true,
  },
  plugins: {
    global: [
      {
        key: "AsepriteLayersAnimationLoaderPlugin",
        plugin: AsepriteLayersAnimationLoaderPlugin,
        start: true,
        mapping: "myAsepriteLoader",
      },
      {
        key: "rexTextTyping",
        plugin: TextTypingPlugin,
        start: true,
      },
    ],
  },
};
