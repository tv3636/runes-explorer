import events from "../events";

const BREAKPOINT = 768;

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

export class BootScene extends Phaser.Scene {
  gameScene: any;
  layer: any;
  landscape: any;
  room: any;
  professor: any;

  web3Controller: undefined;

  initialScrollY: number;

  constructor() {
    super("BootScene");
    this.initialScrollY = 0;
  }

  preload() {
    this.load.path = "/static/game/";
    this.load.aseprite("room", "room.png", "room.json");
    this.load.aseprite("professor", "professor_reading.png", "professor_reading.json");
  }

  create() {
    const self = this;
    this.cameras.main.setRoundPixels(true);
    this.layer = this.add.container();

    const tileBgWidth = this.cameras.main.width;

    this.landscape = this.add.container();
    this.layer.add(this.landscape);

    /*
    const background = this.add.tileSprite(
      0,
      0,
      tileBgWidth,
      this.cameras.main.height,
      "room"
    );
    background.setOrigin(0, 0);
    this.landscape.add(background);
    */

    const add = ({ name }: { name: string }) => {
      const layer = this.add.tileSprite(
        0,
        0,
        tileBgWidth,
        this.cameras.main.height,
        name
      );
      layer.setOrigin(0, 0);
      this.landscape.add(layer);
    };
    
    const worldView = this.cameras.main.worldView;
    const centerX = worldView.centerX;

    (this as any).myAsepriteLoader?.createFromAseprite("professor");
    this.professor = this.add.sprite(centerX, 100, "professor", 0);
    this.professor.depth = 1;
    fadeIn(this, this.professor);
    this.professor.play({
      key: "play",
      repeat: -1,
    });

    

    this.scene.launch("HomeScene");
    this.gameScene = this.scene.get("HomeScene");
    this.updateCamera();
    //this.addParallax();

    this.cameras.main.fadeIn(500, 0, 0, 0);
  }

  addParallax() {
    const camera = this.cameras.main;
    this.initialScrollY = camera.scrollY;

    const minScroll = this.initialScrollY;
    const maxScroll = -220;

    this.input.on(
      "wheel",
      (
        deltaY: number,
      ) => {
        const camera = this.cameras.main;

        camera.scrollY += deltaY * 0.01;
        camera.scrollY = Phaser.Math.Clamp(
          camera.scrollY,
          minScroll,
          maxScroll
        );

        let i = 0;
        this.landscape.each((tile: any, idx: number) => {
          tile.tilePositionY += deltaY * 0.05 * i;

          const maxTileY = i * 20;
          tile.tilePositionY = Phaser.Math.Clamp(
            tile.tilePositionY,
            0,
            maxTileY
          );
          i++;
        });

      }
    );
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
    const bgFrame = textureManager.getFrame("room");
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