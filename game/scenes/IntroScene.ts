import events from "../events";

const BREAKPOINT = 768;
const elements: any = [
  'animated'
];

export function fadeIn(
  scene: Phaser.Scene,
  gameObject: Phaser.GameObjects.Sprite,
  duration = 500
) {
  gameObject.setAlpha(0);
  scene.tweens.add({
    targets: gameObject,
    alpha: { value: 1, duration, ease: "Power1" },
  });
}

export class IntroScene extends Phaser.Scene {
  gameScene: any;
  layer: any;
  landscape: any;

  bootScene: any;

  constructor() {
    super("IntroScene");
  }

  preload() {
    this.load.path = "/static/game/";
    this.load.image("background", "background.png")

    this.load.path = "/static/game/intro/";
    this.load.image("staticImage", "staticImage.png")

    for (var element of elements) {
      this.load.aseprite(element, `${element}.png`, `${element}.json`);
    }
  }

  create() {
    const self = this;
    this.cameras.main.setRoundPixels(true);
    this.layer = this.add.container();

    const tileBgWidth = this.cameras.main.width;

    this.landscape = this.add.container();
    this.layer.add(this.landscape);

    const worldView = this.cameras.main.worldView;
    const centerX = worldView.centerX;
    const centerY = worldView.centerY;

    const staticImage = this.add.sprite(
      centerX,
      200,
      "staticImage",
      0
    );
    staticImage.setDisplaySize(158,200);
    staticImage.setInteractive({ useHandCursor: true }).on("pointerup", () => {
      this.scene.launch("FallingScene");
      this.bootScene = this.scene.get("FallingScene");
      this.scene.remove("IntroScene");
    });
    this.landscape.add(staticImage);

    const add = (name: string) => {
      (this as any).myAsepriteLoader?.createFromAseprite(name);
      (this as any)[name] = this.add.sprite(centerX, 200, name, 0);
      fadeIn(this, (this as any)[name]);

      (this as any)[name].play({
        key: `play-${name}`,
        repeat: -1,
      });
    };

    for (var element of elements) {
      add(element);
    }
    

    this.updateCamera();
    //this.addParallax();
    this.cameras.main.fadeIn(500, 0, 0, 0);

  }

  updateCamera() {
    const width = this.scale.gameSize.width;
    const height = this.scale.gameSize.height;
    const centerX = width / 2;
    const centerY = height / 2;

    const camera = this.cameras.main;
    const desktop = this.scale.gameSize.width >= BREAKPOINT;

    const mobile = !desktop;
    if (mobile) {
      const zoom = 1;
      camera.setZoom(zoom);
      camera.setPosition(0, 0);
      camera.scrollY = 0;
    } else {
      const zoom = 2;
      camera.setZoom(zoom);
      camera.setPosition(0, 0);
      camera.scrollY = -height / 4;
    }

    const textureManager = this.scene.systems.textures;
    const bgFrame = textureManager.getFrame("background");
    const bgWidthScaled = bgFrame.width;

    const tilePosX = (centerX - bgWidthScaled / 2) * -1;
    const tilePosY = 0;

    this.landscape.each((tile: any) => {
      tile.width = width;
      tile.height = bgFrame.height;
      tile.tilePositionX = tilePosX;
      tile.tilePositionY = tilePosY;
    });
  }

  update() {
    this.game.events.emit(events.ON_UPDATE);
  }

  resize() {
    this.updateCamera();
  }

  

}