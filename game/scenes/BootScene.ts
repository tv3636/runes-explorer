import events from "../events";

const BREAKPOINT = 768;
const elements = [
  'cards',
  'curtain',
  'frog',
  'kraken',
  'pc',
  'chair',
  'chimera',
  'food',
  'cybercracks',
]

const steps: any = {
  cards: 4,
  curtain: 2,
  food: 2,
  sword: 2
}

const static_elements = [
  'chair'
]

const looping = [
  'cybercracks'
]

const dialogue = [
  'Oh! Hello there!',
  'I was wondering when you might arrive…I hope the landing wasn’t too rough.',
  'Congratulations on making it anyway, and don’t worry, you are safe here.',
  'I imagine you have some questions.',
  'What would you like to know?',
]

const questions: any = {
  'What would you like to know?': [
    'Where am I?',
    'How did I get here?',
    'Who are you?',
    'What is Forgotten Runes?'
  ]
}

const responses: any = {
  'Where am I?': 'My home! …Calista’s Citadel. Anyway, this is my study. The books I have collected here are to help people like you to understand Forgotten Runes and the Runiverse!',
  'How did I get here?': 'I ask myself the same question all the time! {*Professor laughs*} Quite the journey, huh? You fell into our Universe through a worm-hole by the looks of it, but you’re in the right place.',
  'Who are you?': 'Me? I’m the Professor. This is my place and as you can see… I collect books.',
  'What is Forgotten Runes?': 'Great Question! Let’s see…where did I put that book…'
}

let curLine: any;
let mainDialog = true;
let answers: any = [];

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
  food: any;
  cybercracks: any;
  professor: any;

  textbox: any;
  typing: any;

  initialScrollY: number;

  constructor() {
    super("BootScene");
    this.initialScrollY = 0;
  }

  preload() {
    this.load.path = "/static/game/";
    this.load.image("background", "background.png");
    this.load.aseprite('professor', `professor.png`, `professor.json`);

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

    const step: any = {};
    const stepSprites = Object.keys(steps);
    
    for (var element of stepSprites) {
      step[element] = 0;
    }    

    this.showDialogue();

    const background = this.add.sprite(
      centerX,
      200,
      "background",
      0
    );
    background.setDisplaySize(803,334);
    //background.setOrigin(0, 0);
    this.landscape.add(background);

    const baseAdd = (name: string) => {
      (this as any).myAsepriteLoader?.createFromAseprite(name);
      (this as any)[name] = this.add.sprite(centerX, 200, name, 0);
      fadeIn(this, (this as any)[name]);
    }
    
    const add = (name: string) => {
      baseAdd(name);

      if (!static_elements.includes(name) && !looping.includes(name)) {
        (this as any)[name].setInteractive({ useHandCursor: true, pixelPerfect: true }).on("pointerup", () => {
          (this as any)[name].play({
            key: stepSprites.includes(name) ? `play-${name}-${step[name]}` : `play-${name}`,
            repeat: false,
          });

          if (stepSprites.includes(name)) {
            step[name] = (step[name] + 1) % steps[name]
          }
        });
      } else if (looping.includes(name)) {
        (this as any)[name].play({
          key: `play-${name}`,
          repeat: -1,
        });
      }
    };

    for (var element of elements) {
      add(element);
    }


    baseAdd('professor');
    this.professor.setPosition(centerX, 272);
    this.professor.scale = 1.65;
    this.professor.play({
      key: `idle`,
      repeat: -1,
    })
    
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

  showDialogue() {
    let centerX = this.cameras.main.worldView.centerX;
    let wrap_width = 350;

    this.textbox = this.add.rectangle(centerX + 15, 340, wrap_width, 75, 0x808080, 0.5);
    this.textbox.setInteractive({ 
      useHandCursor: true, 
      hitArea: new Phaser.Geom.Rectangle(0, 0, wrap_width, 50),
      callback: Phaser.Geom.Rectangle.Contains,
    });

    this.textbox.on('pointerdown',  () => {
      console.log('clicked textbox');
      this.updateLine();
    });

    let dialogueStyle = {
      fontFamily: "Alagard",
      fontSize: "20px",
      color: "white",
      metrics: {
        fontSize: 43,
        ascent: 35,
        descent: 8,
      },
      wordWrap: {
        width: wrap_width * 1.75
      },
    }

    const summonText = this.add.text(0, 0, "", dialogueStyle);
    let yStart = 305;
    
    summonText.scale = 0.5;
    summonText.lineSpacing = -15;
    summonText.setOrigin(0, 0);
    summonText.setPosition(centerX - 140, yStart);
    summonText.depth = 1;

    const rexTextTyping = this.plugins.get("rexTextTyping") as any;
    if (rexTextTyping) {
      this.typing = rexTextTyping.add(summonText, {
        speed: 30,
      });

      this.updateLine();
      
      this.typing.on('complete', () =>{
        if (curLine in questions && mainDialog) {
          for (var i = 0; i < questions[curLine].length; i++) {
            let lineHeight = 12;
            let answer = this.add.text(centerX - 140, yStart + 8 + ((i + 1) * lineHeight), questions[curLine][i], dialogueStyle);
            answer.scale = 0.5;
            answer.setStroke('black', 5);
            answer.setInteractive({ 
              useHandCursor: true, 
              hitArea: new Phaser.Geom.Rectangle(0, 0, answer.width, answer.height),
              callback: Phaser.Geom.Rectangle.Contains,
            });
            answer.on('pointerdown',  () => {
              for (var a of answers) {
                a.destroy();
              }
              this.updateLine(responses[questions[curLine][i]]);              
            });

            answer.on('pointerover', function () {
              answer.setShadow(5, 5, 'black', 5);
            })

            answer.on('pointerout', function () {
              answer.setShadow(0, 0, undefined, 0);
            })

            answers.push(answer);
          }
        }

        // Professor animation
        if (this.typing.text == 'Great Question! Let’s see…where did I put that book…') {
          this.walk('right', 200);
        }

      });
    }
  }

  walk(direction: string, distance: number) {
    this.professor.play({
      key: direction,
      repeat: -1
    })

    let endpoint = this.professor.x + distance;
    let speed = 55;

    let move = (x: number) => {
      console.log(this.professor.x, this.professor.x + x);
      this.professor.x += x;

      if (this.professor.x < endpoint) {
        setTimeout(() => {
          move(distance/speed);
        }, speed);
      } else {
        this.professor.play({
          key: 'book reading',
          repeat: -1,
        })
      }
    };

    move(distance/speed);
  }

  updateLine(newline?: string) {
    if (!newline) {
      if (dialogue.length > 0) {
        curLine = dialogue.shift();
      }

      this.typing.start(curLine);
      mainDialog = true;      
    } else if (newline) {
      this.typing.start(newline);
      mainDialog = false;
    }    
  }
}
