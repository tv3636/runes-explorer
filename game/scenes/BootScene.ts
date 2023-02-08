import events from "../events";

const BREAKPOINT = 768;
const FIRST_WALK = 180;
const FLOOR = 266;

const elements = [
  'bookshelve_1',
  'bookshelve_2',
  'cards',
  'curtain',  
  'kraken',
  'PC',  
  'chimera',
  'food',
  'cybercracks',
  'lightknob',
  'tv',
  'frog',
  'pc_screen',
  'chair',
  'rabbit',
  'machine',
  'nightshadeplant',
  'brain',
  'staff',
]

const steps: any = {
  cards: 4,
  curtain: 2,
  food: 2,
  sword: 2,
  nightshadeplant: 2,
}

const static_elements = [
  'chair',
  'bookshelve_1'
]

const looping = [
  'cybercracks'
]

const connected: any = {
  'pc_screen': 'PC'
}

const hidden = [
  'pc_screen',
  'bookshelve_2',
  'machine',
]

const repeats: any = {
  'chimera': 2
}

let dialogue = [
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
  lightknob: any;
  professor: any;
  professor_enlightened: any;
  tv: any;
  bookshelve_1: any;
  pc_screen: any;
  rabbit: any;
  bookshelve_2: any;
  machine: any;
  nightshadeplant: any;
  brain: any;
  staff: any;
  flash: any;

  summonText: any;
  textbox: any;
  typing: any;

  initialScrollY: number;
  centerX: any;

  constructor() {
    super("BootScene");
    this.initialScrollY = 0;
  }

  preload() {
    this.load.path = "/static/game/";
    this.load.image("background", "background.png");
    this.load.image("background_black", "background-black.png");
    this.load.aseprite('professor', `professor.png`, `professor.json`);
    this.load.aseprite('professor_enlightened', 'professor_enlightened.png', 'professor_enlightened.json');
    this.load.aseprite('flash', 'flash.png', 'flash.json');

    for (var element of elements) {
      this.load.aseprite(element, `${element}.png`, `${element}.json`);
    }
  }

  create() {
    this.cameras.main.setRoundPixels(true);
    this.layer = this.add.container();

    this.landscape = this.add.container();
    this.layer.add(this.landscape);

    const worldView = this.cameras.main.worldView;
    this.centerX = worldView.centerX;

    const step: any = {};
    const stepSprites = Object.keys(steps);

    const connectedSprites = Object.keys(connected);

    // TODO - figure out how to enable this
    this.lights.enable()
    this.lights.addLight(0, this.centerX, 100);
    
    for (var element of stepSprites) {
      step[element] = 0;
    }    

    this.showDialogue();

    const background = this.add.sprite(
      this.centerX,
      200,
      "background",
      0
    );
    background.setDisplaySize(803,334);
    //background.setOrigin(0, 0);
    this.landscape.add(background);

    const baseAdd = (name: string) => {
      (this as any).myAsepriteLoader?.createFromAseprite(name);
      (this as any)[name] = this.add.sprite(this.centerX, 200, name, 0).setPipeline('Light2D');
      fadeIn(this, (this as any)[name]);

      if (hidden.includes(name)) {
        (this as any)[name].visible = false;
      }
    }
    
    const add = (name: string) => {
      baseAdd(name);

      if (!static_elements.includes(name) && !looping.includes(name)) {        
        (this as any)[connectedSprites.includes(name) ? connected[name] : name].setInteractive({ useHandCursor: true, pixelPerfect: true }).on("pointerup", () => {
          (this as any)[name].visible = true;
          (this as any)[name].play({
            key: stepSprites.includes(name) ? `play-${name}-${step[name]}` : `play-${name}`,
            repeat: Object.keys(repeats).includes(name) ? repeats[name] : false,
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


    // Add special elements
    baseAdd('professor');
    this.professor.setPosition(this.centerX, FLOOR);
    this.professor.scale = 2;
    this.professor.play({
      key: `idle`,
      repeat: -1,
    })

    baseAdd('professor_enlightened');
    this.professor_enlightened.visible = false;
    this.professor_enlightened.setPosition(this.centerX + FIRST_WALK + 7.5, FLOOR - 97);
    this.professor_enlightened.scale = 2;

    baseAdd('flash');
    this.flash.visible = false;
    

    // Set camera
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
    let wrap_width = 350;

    this.textbox = this.add.rectangle(this.centerX + 15, 340, wrap_width, 75, 0x808080, 0.5);
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

    this.summonText = this.add.text(0, 0, "", dialogueStyle);
    let yStart = 305;
    
    this.summonText.scale = 0.5;
    this.summonText.lineSpacing = -15;
    this.summonText.setOrigin(0, 0);
    this.summonText.setPosition(this.centerX - 140, yStart);
    this.summonText.depth = 1;

    const rexTextTyping = this.plugins.get("rexTextTyping") as any;
    if (rexTextTyping) {
      this.typing = rexTextTyping.add(this.summonText, {
        speed: 30,
      });

      this.updateLine();
      
      this.typing.on('complete', () =>{
        if (curLine in questions && mainDialog) {
          for (var i = 0; i < questions[curLine].length; i++) {
            let lineHeight = 12;
            let answer = this.add.text(this.centerX - 140, yStart + 8 + ((i + 1) * lineHeight), questions[curLine][i], dialogueStyle);
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

        // Professor walks over to book
        if (this.typing.text == 'Great Question! Let’s see…where did I put that book…') {
          this.walk('right', FIRST_WALK);
        }

        // Professor opens book
        if (this.typing.text == 'Let me warn you, this isn’t any ordinary book… Hold on tight.') {
          this.professor.play({
            key: 'book thinking',
            repeat: -1
          })
        }

        // Professor flips through book
        if (this.typing.text == 'Now if I can just find the right page…') {
          this.professor.play({
            key: 'book reading',
            repeat: -1
          })
        }

        // Professor enlightenment animation
        if (this.typing.text == 'Ah ha! Here we go!') {
          this.openBook();
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
    let speed = 50; // lower speed is faster

    let move = (x: number) => {
      this.professor.x += x;

      if (this.professor.x < endpoint) {
        setTimeout(() => {
          move(distance/speed);
        }, speed);
      } else {
        this.professor.play({
          key: 'book grab',
          repeat: 0,
        })

        dialogue = [
          'Let me warn you, this isn’t any ordinary book… Hold on tight.',
          'Now if I can just find the right page…',
          'Ah ha! Here we go!',          
        ]

        this.updateLine();
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

  openBook() {
    this.professor.visible = false;
    this.professor_enlightened.visible = true;
    this.flash.visible = true;

    let titleStyle = {
      fontFamily: "Alagard",
      fontSize: "44px",
      color: "white",
      metrics: {
        fontSize: 43,
        ascent: 35,
        descent: 8,
      },
      wordWrap: { width: 10000 },
    }

    this.professor_enlightened.play({
      key: 'main',
      repeat: 0,
    })

    this.flash.play({
      key: 'play-flash',
      repeat: 0,
    })

    setTimeout(() => {
      const black_background = this.add.sprite(
        this.centerX,
        180,
        "background_black",
        0
      );
      black_background.setAlpha(0);
      black_background.setDisplaySize(803,434);
      this.tweens.add({
        targets: black_background,
        alpha: { value: 1, duration: 1000, ease: "Power1" },
      });

      this.summonText.visible = false;

      const titleText = this.add.text(this.centerX - 350, 200, "Book 1 - What is Forgotten Runes?", titleStyle);
      titleText.setAlpha(0);
      this.tweens.add({
        targets: titleText,
        alpha: { value: 1, duration: 250, ease: "Power1"}
      });

      setTimeout(() => {              
        this.tweens.add({
          targets: titleText,
          alpha: { value: 0, duration: 1000, ease: "Power1"}
        });
        
        setTimeout(() => {          
          dialogue = ['Oops! I always forget it starts like this. Can you help me turn the lights on?'];
          this.updateLine();
          this.summonText.visible = true;

          (this as any).myAsepriteLoader?.createFromAseprite('lightknob');
          this.lightknob = this.add.sprite(this.centerX, 200, 'lightknob', 0).setPipeline('Light2D');
          this.lightknob.setInteractive({ useHandCursor: true, pixelPerfect: true }).on("pointerup", () => {
            this.professor_enlightened.visible = false;
            this.flash.visible = false;
            this.professor.visible = true;
            this.professor.play({
              key: 'idle',
              repeat: -1
            })               
            
            this.lightknob.visible = false;
            this.bookshelve_1.visible = false;
            this.bookshelve_2.visible = true;
            this.brain.visible = false;
            this.staff.visible = false;
            this.machine.visible = true;
            black_background.visible = false;                      
            
            dialogue = [
              'Thanks. That’s much better.',
              'Shall we get started?',
              'Truth be told. It’s hard to define everything Forgotten Runes is. The answer is still being discovered.',
              'On a basic level: Forgotten Runes is a whole world of collaborative story-telling led by the Magic Machine.',
              'Do you want to turn it on?'
            ]
            this.updateLine();
          });
        }, 1000);        
      }, 5000);                            
    }, 8000);
  }

}
