import Phaser from "phaser";
import Bird from "./bird";
import Background from "./background";
import Pipe from "./pipe";
import {SettingsInterface} from "../settings/settings";
import {Router} from "@angular/router";

export default class MainScene extends Phaser.Scene {
  private bird!: Bird;
  private background!: Background;
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private music!: Phaser.Sound.BaseSound;
  public screenHeight: number = 0;
  public screenWidth: number = 0;
  public loadedSettings: SettingsInterface;
  private Router: Router;
  private scrollSpeed: number = 1;

  // Arrays to hold pipe parts
  private pipes : Pipe[] = [];

  constructor(router: Router) {
    super('main');
    this.Router = router;
    let settings = localStorage.getItem('settings');
    if (settings) {
      this.loadedSettings = JSON.parse(settings);
    } else {
      this.loadedSettings = {
        scrollSpeed: 1,
        volume: 50,
        vibration: true,
        skin: 'flappybird',
        customSkinPath: undefined
      };
    }
  }

  preload() {
    this.load.image('cowbird', 'assets/img/cowboy.png');
    this.load.image('japanbird', 'assets/img/japan.png');
    this.load.image('flappybird', 'assets/img/flappybird.png');
    this.load.image('robotbird', 'assets/img/robot.png');
    this.load.image('background1', 'assets/img/background1.png');
    this.load.image('background2', 'assets/img/background2.png');
    this.load.image('centerPipe', 'assets/img/centerPipe.png');
    this.load.image('pipeCap', 'assets/img/capPipe.png');
    this.load.audio('backgroundMusic', 'assets/audio/background1.mp3');
    this.load.audio('collisionSound', 'assets/audio/pipecollision.mp3');
    this.load.audio('scoreSound', 'assets/audio/score.mp3');
    this.load.image('customBird', this.loadedSettings.customSkinPath);
  }

  create() {
    // Load settings from local storage
    this.screenHeight = Number(this.game.config.height);
    this.screenWidth = Number(this.game.config.width);

    // Background music
    this.music = this.sound.add('backgroundMusic', {loop: true, volume: this.loadedSettings.volume/440});

    this.music.play();

    // Adjust gravity
    this.matter.world.setGravity(0, 0.981 * this.screenHeight/640);

    this.background = new Background(this);

    // Lay the first pipes
    this.layPipeRandom.call(this, this.screenWidth * 0.5555 + this.screenWidth*0.2);
    this.layPipeRandom.call(this, this.screenWidth * 0.9722 + this.screenWidth*0.2);
    this.layPipeRandom.call(this, this.screenWidth * 1.3889 + this.screenWidth*0.2);
    this.layPipeRandom.call(this, this.screenWidth * 1.8056 + this.screenWidth*0.2);


    this.bird = new Bird(this, this.screenWidth/4, this.screenHeight/2, this.loadedSettings.skin);

    // Collision check
    this.matter.world.on('collisionstart', (event: any, bodyA: { gameObject: any; }, bodyB: { gameObject: any; }) => {
      if (bodyA.gameObject === this.bird.bird || bodyB.gameObject === this.bird.bird) {
        this.sound.add('collisionSound', {volume: this.loadedSettings.volume/100}).play();
        this.gameOver();
      }
    });

    // Score text
    this.scoreText = this.add.text(this.screenWidth/2, this.screenWidth/7, String(this.score),
      {
        fontSize: `${this.screenWidth/360 * 52}px`,
        color: '#ffffff',
        fontFamily: 'Impact',
        stroke: '#000000',
        strokeThickness: this.screenWidth/360 * 6
      }).setOrigin(0.5).setDepth(1000);

    // Out of bounds check
    this.matter.world.on('beforeupdate', () => {
      if (this.bird.bird.y > this.screenHeight ||
        this.bird.bird.y < 0) {
        this.gameOver();
      } else if (!this.pipes[0].passed && this.bird.bird.x > this.pipes[0].x && this.bird.bird.x < this.pipes[0].x + this.pipes[0].pipeWidth) {
        this.score++;
        this.sound.add('scoreSound', {volume: this.loadedSettings.volume/100}).play();
        this.scoreText.setText(String(this.score));
        this.pipes[0].passed = true;
      }
    });


    // Jump on click
    this.input.on('pointerdown', () => {
      if (this.loadedSettings.vibration) {
        navigator.vibrate(50);
      }
      this.bird.jump();
    });
  }

  override update() {
    this.scrollSpeed = -this.screenWidth/360*(1+this.loadedSettings.scrollSpeed/100);
    this.background.scrollBackground(this.scrollSpeed);
    this.movePipes.call(this);
    this.replacePipe.call(this);
    this.bird.update();
  }


  movePipes() {
    this.pipes.forEach(pipe => {
      pipe.move(this.scrollSpeed);
    });
  }

  replacePipe() {
    let pipe = this.pipes[0];

    if (pipe.x + pipe.pipeWidth/2 < 0) {
      this.pipes.shift();
      this.layPipeRandom(this.screenWidth * 1.6667);
    }
  }

  layPipeRandom(x: number) {
    let randomHeight = Phaser.Math.Between(this.screenHeight*0.5, this.screenHeight*0.2);
    let randomGap = Phaser.Math.Between(this.screenHeight*0.2, this.screenHeight*0.35);
    let pipe = new Pipe(this, x, randomHeight, randomGap);

    this.pipes.push(pipe);
  }


  gameOver() {
    // Vibrate
    if (this.loadedSettings.vibration) {
      navigator.vibrate([300,20,300,20,300]);
    }
    //Bounce off the screen
    this.bird.bird.setVelocityY(-1);
    this.bird.bird.setVelocityX(-2);
    this.bird.bird.setAngularVelocity(2);
    let noCollisionCat = this.matter.world.nextCategory();
    this.bird.bird.setCollisionCategory(noCollisionCat);
    // Tint the bird red
    this.bird.bird.setTint(0xfe0000);
    // Write Game Over on top of everything
    let szMod = this.screenWidth/360;

    let goText = this.add.text(this.screenWidth/2, this.screenHeight/5, 'GAME OVER',
      {fontSize: `${szMod * 40}px`,
        color: '#ff0000',
        fontStyle: 'bold',
        fontFamily: 'Impact',
        shadow: {
          offsetX: 2 * szMod,
          offsetY: 2 * szMod,
          color: '#000',
          blur: 2 * szMod,
          stroke: true,
          fill: true
        }
      }).setOrigin(0.5).setRotation(-0.1).setDepth(1000);

    // Text animation
    this.tweens.add({
      targets: goText,
      scale: {start: 1, to: 1.2},
      duration: 500,
      ease: 'Power1',
      yoyo: true,
      repeat: -1
    });

    // Show end screen
    let endScreen = this.add.rectangle(this.screenWidth/2, this.screenHeight/2, this.screenWidth*0.9, this.screenHeight/3, 0x000000, 0.7).setDepth(999);
    let endText = this.add.text(this.screenWidth/2, this.screenHeight/2-this.screenHeight/7, 'Enter your nickname', {
      fontSize: `${szMod/devicePixelRatio * 20}px`,
      color: '#ffffff',
      fontFamily: 'Impact',
      stroke: '#000000',
      strokeThickness: szMod * 3
    }).setOrigin(0.5).setDepth(1000);

    let input = document.createElement('input');
    input.type = 'text';
    input.style.position = 'absolute';
    input.style.top = '50%';
    input.style.left = '50%';
    input.style.width = '17ch';
    input.style.height = '2ch';
    input.style.padding = '10px';
    input.style.borderRadius = '8px';
    input.style.transform = 'translate(-50%, -50%)';
    input.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    input.style.border = '1px solid #ffffff';
    input.style.fontSize = `${szMod/devicePixelRatio * 20}px`;
    input.style.color = '#ffffff';
    input.style.textAlign = 'center';
    input.maxLength = 12;
    document.body.appendChild(input);
    input.focus();

    let buttonHolder = document.createElement('div');
    buttonHolder.style.position = 'absolute';
    buttonHolder.style.top = '60%';
    buttonHolder.style.left = '50%';
    buttonHolder.style.transform = 'translate(-50%, -50%)';
    buttonHolder.style.width = '{this.screenWidth/2}px';
    buttonHolder.style.display = 'flex';
    buttonHolder.style.justifyContent = 'space-around';
    buttonHolder.style.alignItems = 'center';
    buttonHolder.style.padding = '10px';
    buttonHolder.style.borderRadius = '5px';


    let submit = document.createElement('ion-icon');
    submit.setAttribute('name', 'checkmark');
    submit.src = 'assets/icon/save-outline.svg';
    submit.style.transform = 'translate(0%, 0%)';
    submit.style.fontSize = `${szMod/devicePixelRatio  * 20}px`;
    submit.style.fontWeight = 'bold';
    submit.style.padding = '10px 20px';
    submit.style.backgroundColor = 'orange';
    submit.style.color = '#000000';
    submit.style.border = 'none';
    submit.style.borderRadius = '10px';
    submit.style.cursor = 'pointer';
    submit.style.width = '3ch';
    submit.style.marginRight = '10px';
    submit.style.boxShadow = '2px 2px 1px 3px #000000';
    submit.addEventListener('touchstart', () => {
      submit.style.boxShadow = '0 0 0 0';
      submit.style.transform = 'translate(2px, 2px)';
    });
    submit.addEventListener('touchend', () => {
      submit.style.boxShadow = '2px 2px 1px 3px #000000';
      submit.style.transform = 'translate(0%, 0%)';
    });

    submit.addEventListener('click', () => {
      this.saveScore((typeof input.value !== "string" || input.value === "" ? 'Anonymous' : input.value));
      this.music.stop();
      this.Router.navigateByUrl('/menu');
      input.remove();
      submit.remove();
      toMenu.remove();
    });
    buttonHolder.appendChild(submit);


    let toMenu = document.createElement('ion-icon');
    toMenu.setAttribute('name', 'home');
    toMenu.src = 'assets/icon/home-outline.svg';
    toMenu.style.transform = 'translate(0%, 0%)';
    toMenu.style.fontSize = `${szMod/devicePixelRatio * 20}px`;
    toMenu.style.fontWeight = 'bold';
    toMenu.style.padding = '10px 20px';
    toMenu.style.backgroundColor = 'orange';
    toMenu.style.color = '#000000';
    toMenu.style.border = 'none';
    toMenu.style.borderRadius = '10px';
    toMenu.style.cursor = 'pointer';
    toMenu.style.width = '3ch';
    toMenu.style.marginLeft = '10px';
    toMenu.style.boxShadow = '2px 2px 1px 3px #000000';
    toMenu.addEventListener('touchstart', () => {
      toMenu.style.boxShadow = '0 0 0 0';
      toMenu.style.transform = 'translate(2px, 2px)';
    });
    toMenu.addEventListener('touchend', () => {
      toMenu.style.boxShadow = '2px 2px 1px 3px #000000';
      toMenu.style.transform = 'translate(0%, 0%)';
    });

    toMenu.addEventListener('click', () => {
      this.music.stop();
      this.Router.navigateByUrl('/menu');
      input.remove();
      submit.remove();
      toMenu.remove();
    });
    buttonHolder.appendChild(toMenu);


    document.body.appendChild(buttonHolder);
    // Stop the game
    this.input.off('pointerdown');
    this.matter.world.off('collisionstart');
    this.matter.world.off('beforeupdate');
  }

  saveScore(nickname: string) {
    let scoreboard = localStorage.getItem('scoreboard');
    let scoreArray = [];
    if (scoreboard) {
      scoreArray = JSON.parse(scoreboard);
    }
    let date = new Date();
    scoreArray.push({name: nickname, score: this.score, date: date.toLocaleString()});
    localStorage.setItem('scoreboard', JSON.stringify(scoreArray));

  }

}
