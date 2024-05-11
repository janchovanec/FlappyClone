import Phaser from 'phaser';
import MainScene from "./MainScene";

export default class Pipe {
  public passed: boolean;
  private centerPipeSky: Phaser.Physics.Matter.Sprite;
  private pipeCapSky: Phaser.Physics.Matter.Sprite;
  private centerPipeGround: Phaser.Physics.Matter.Sprite;
  private pipeCapGround: Phaser.Physics.Matter.Sprite;

  constructor(scene : MainScene, x: number, height: number, gap: number) {
    let widthScale = 0.3 * scene.screenWidth / 800;
    this.passed = false;

    this.centerPipeSky = scene.matter.add.sprite(x, height/2, 'centerPipe');
    this.centerPipeSky.setScale(widthScale,height);
    this.pipeCapSky = scene.matter.add.sprite(x, height, 'pipeCap');
    this.pipeCapSky.setScale(widthScale);
    this.pipeCapSky.setFlipY(true);

    this.pipeCapSky.setIgnoreGravity(true);
    this.pipeCapSky.setStatic(true);
    this.centerPipeSky.setIgnoreGravity(true);
    this.centerPipeSky.setStatic(true);
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    let otherHeight = scene.screenHeight-height-gap;

    this.centerPipeGround = scene.matter.add.sprite(x, scene.screenHeight-otherHeight/2, 'centerPipe');
    this.centerPipeGround.setScale(widthScale, otherHeight);

    this.pipeCapGround = scene.matter.add.sprite(x, height+gap, 'pipeCap');
    this.pipeCapGround.setScale(widthScale);
    this.pipeCapGround.setIgnoreGravity(true);
    this.pipeCapGround.setStatic(true);
    this.centerPipeGround.setIgnoreGravity(true);
    this.centerPipeGround.setStatic(true);
  }

  move(x: number) {
    this.centerPipeSky.x += x;
    this.pipeCapSky.x += x;
    this.centerPipeGround.x += x;
    this.pipeCapGround.x += x;
  }

  get x() {
    return this.centerPipeSky.x;
  }

  get pipeWidth() {
    return this.pipeCapSky.displayWidth;
  }

}
