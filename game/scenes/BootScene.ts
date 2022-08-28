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
  cards: any;
  curtain: any;
  frog: any;
  kraken: any;
  pc: any;
  chair: any;
  chimera: any;
  sword: any;
  food: any;
  professor: any;

  initialScrollY: number;

  constructor() {
    super("BootScene");
    this.initialScrollY = 0;
  }

  preload() {
    this.load.path = "/static/game/";
    this.load.image("background", "background.png")

    this.load.aseprite("cards", "cards.png", "cards.json");
    this.load.aseprite("curtain", "curtain.png", "curtain.json");
    this.load.aseprite("frog", "frog.png", "frog.json");
    this.load.aseprite("kraken", "kraken.png", "kraken.json");
    this.load.aseprite("pc", "PC.png", "PC.json");
    this.load.aseprite("chair", "chair.png", "chair.json");
    this.load.aseprite("chimera", "chimera.png", "chimera.json");
    this.load.aseprite("sword", "sword.png", "sword.json");
    this.load.aseprite("food", "food.png", "food.json");

    this.load.aseprite("professor", "professor_reading.png", "professor_reading.json");
    
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

    const background = this.add.sprite(
      centerX,
      200,
      "background",
      0
    );
    background.setDisplaySize(803,334);
    //background.setOrigin(0, 0);
    this.landscape.add(background);
    
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

    for (var name of []) {
      let layer = this.add.sprite(
        centerX,
        200,
        name,
        0
      );
      layer.setDisplaySize(803,334);
      //layer.setOrigin(0, 0);
      this.landscape.add(layer);
    }

    (this as any).myAsepriteLoader?.createFromAseprite("cards");
    this.cards = this.add.sprite(centerX, 200, "cards", 0);
    fadeIn(this, this.cards);
    this.cards.play({
      key: "play-cards",
      repeat: -1,
    });

    (this as any).myAsepriteLoader?.createFromAseprite("curtain");
    this.curtain = this.add.sprite(centerX, 200, "curtain", 0);
    fadeIn(this, this.curtain);

    this.curtain.setInteractive({ useHandCursor: true, pixelPerfect: true }).on("pointerup", () => {
      console.log('clicked curtain!');
      this.curtain.play({
        key: "play-curtain",
        repeat: false,
      });
    });

    (this as any).myAsepriteLoader?.createFromAseprite("frog");
    this.frog = this.add.sprite(centerX, 200, "frog", 0);
    fadeIn(this, this.frog);

    this.frog.setInteractive({ useHandCursor: true, pixelPerfect: true }).on("pointerup", () => {
      console.log('clicked frog!');
      this.frog.play({
        key: "play-frog",
        repeat: false,
      });
    });

    (this as any).myAsepriteLoader?.createFromAseprite("kraken");
    this.kraken = this.add.sprite(centerX, 200, "kraken", 0);
    fadeIn(this, this.kraken);
    this.kraken.play({
      key: "play-kraken",
      repeat: -1,
    });

    (this as any).myAsepriteLoader?.createFromAseprite("pc");
    this.pc = this.add.sprite(centerX, 200, "pc", 0);
    fadeIn(this, this.pc);
    this.pc.play({
      key: "play-PC",
      repeat: -1,
    });

    (this as any).myAsepriteLoader?.createFromAseprite("chimera");
    this.chimera = this.add.sprite(centerX, 200, "chimera", 0);
    fadeIn(this, this.chimera);
    this.chimera.play({
      key: "play-chimera",
      repeat: -1,
    });

    (this as any).myAsepriteLoader?.createFromAseprite("sword");
    this.sword = this.add.sprite(centerX, 200, "sword", 0);
    fadeIn(this, this.sword);

    this.sword.setInteractive({ useHandCursor: true, pixelPerfect: true }).on("pointerup", () => {
      console.log('clicked sword!');
      this.sword.play({
        key: "play-sword",
        repeat: false,
      });
    });

    (this as any).myAsepriteLoader?.createFromAseprite("food");
    this.food = this.add.sprite(centerX, 200, "food", 0);
    fadeIn(this, this.food);

    this.food.setInteractive({ useHandCursor: true, pixelPerfect: true }).on("pointerup", () => {
      console.log('clicked food!');
      this.food.play({
        key: "play-food",
        repeat: false,
      });
    });

    (this as any).myAsepriteLoader?.createFromAseprite("chair");
    this.chair = this.add.sprite(centerX, 200, "chair", 0);
    
    
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
