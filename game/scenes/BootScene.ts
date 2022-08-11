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
  professor: any;

  initialScrollY: number;

  constructor() {
    super("BootScene");
    this.initialScrollY = 0;
  }

  preload() {
    this.load.path = "/static/game/";
    this.load.image("background_layer1", "background_layer1.png")
    this.load.image("background_layer2", "background_layer2.png")
    this.load.image("backgroundlayer3_cybercracks", "background layer 3 _ cyber cracks.png")
    this.load.image("backgroundlayer4_floor", "background layer 4_floor.png")
    this.load.image("backgroundlayer5_ceiling", "background layer 5_ceiling.png")
    this.load.image("backgroundlayer6_carpets", "background layer 6_carpets.png")
    /*
    this.load.image("cardpony", "card pony.png")
    this.load.image("cardheart", "card heart.png")
    this.load.image("runiversemap", "runiverse map.png")
    this.load.image("chair1", "chair1.png")
    this.load.image("sleepingchimeracub", "sleeping chimera cub.png")
    this.load.image("lamp2", "lamp2.png")
    this.load.image("fistank", "fistank.png")
    this.load.image("rabbithole", "rabbit hole.png")
    this.load.image("largebookshelve1", "large bookshelve 1.png")
    this.load.image("sword2", "sword2.png")
    this.load.image("outsideneon", "outside neon.png")
    this.load.image("bowlorramen", "bowl or ramen.png")
    this.load.image("lightsoff", "lights off.png")
    this.load.image("lightknob", "light knob.png")
    this.load.image("cardsoul", "card soul.png")
    this.load.image("dottacurtainopen", "dotta curtain open.png")
    this.load.image("wallneon1", "wall neon1.png")
    this.load.image("smallbookshelve.", "small bookshelve..png")
    this.load.image("sleepingchimeracubeyes", "sleeping chimera cub eyes.png")
    this.load.image("lavalamp", "lavalamp.png")
    this.load.image("lights1", "lights1.png")
    this.load.image("sofa", "sofa.png")
    this.load.image("dottacurtainclosed", "dotta curtain closed.png")
    this.load.image("card_spade", "card_spade.png")
    this.load.image("professor_reading", "professor_reading.png")
    this.load.image("sword", "sword.png")
    this.load.image("plant3", "plant3.png")
    this.load.image("arcademagicmachinel", "arcade magic machinel.png")
    this.load.image("plant2", "plant2.png")
    this.load.image("PC", "PC.png")
    this.load.image("wallcomputer", "wall computer.png")
    this.load.image("wallcabinet1", "wall cabinet1.png")
    this.load.image("cheeseburger", "cheeseburger.png")
    this.load.image("professor_reading.json", "professor_reading.json")
    this.load.image("plant5", "plant5.png")
    this.load.image("sidetable3.", "side table 3..png")
    this.load.image("plant4", "plant4.png")
    this.load.image("cabinet1", "cabinet1.png")
    this.load.image("paintings1", "paintings1.png")
    this.load.image("litteringbooks", "littering books.png")
    this.load.image("window1", "window1.png")
    this.load.image("desk1", "desk1.png")
    this.load.image("dottapainting", "dotta painting.png")
    this.load.image("staff", "staff.png")
    this.load.image("sundial", "sundial.png")
    */

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
      "background_layer1",
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

    //'bowlorramen', 'cabinet1', 'card_spade', 'cardheart', 'cardpony', 'cardsoul', 'chair1', 'cheeseburger', 'desk1', 'dottacurtainclosed', 'dottacurtainopen', 'dottapainting', 'fistank', 'lamp2', 'largebookshelve1', 'lavalamp', 'lightknob', 'lights1', 'lightsoff', 'litteringbooks', 'outsideneon', 'paintings1', 'plant2', 'plant3', 'plant4', 'plant5', 'professor_reading', 'professor_reading.json', 'rabbithole', 'runiversemap', 'sidetable3.', 'sleepingchimeracub', 'sleepingchimeracubeyes', 'smallbookshelve.', 'sofa', 'staff', 'sundial', 'sword', 'sword2', 'wallcabinet1', 'wallcomputer', 'wallneon1', 'window1', 'PC', 'arcademagicmachinel'


    for (var name of ['background_layer2', 'backgroundlayer3_cybercracks', 'backgroundlayer4_floor', 'backgroundlayer5_ceiling', 'backgroundlayer6_carpets']) {
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

    (this as any).myAsepriteLoader?.createFromAseprite("professor");
    this.professor = this.add.sprite(centerX, 280, "professor", 0);
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
    const bgFrame = textureManager.getFrame("background_layer1");
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
