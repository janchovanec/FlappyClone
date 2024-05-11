import Phaser from "phaser";
import MainScene from "./MainScene";

export default class Background {
  private background1: Phaser.GameObjects.Image;
  private background2: Phaser.GameObjects.Image;

  constructor(scene: MainScene) {
    this.background1 = scene.add.image(scene.screenWidth, scene.screenHeight / 2, 'background1',);
    this.background2 = scene.add.image(scene.screenWidth - this.background1.displayWidth*2, scene.screenHeight / 2, 'background2',);
    let scaleRatio = scene.screenHeight / this.background2.height;
    this.background1.setScale(scaleRatio).setScrollFactor(0);
    this.background2.setScale(scaleRatio).setScrollFactor(0);
  }

  scrollBackground(scrollSpeed: number) {
    this.background1.x += scrollSpeed*0.8;
    this.background2.x += scrollSpeed*0.8;

    if (this.background1.x + this.background1.displayWidth / 2 < 0) {
      this.background1.x = this.background1.displayWidth + this.background2.x;
    }
    if (this.background2.x + this.background2.displayWidth / 2 < 0) {
      this.background2.x = this.background2.displayWidth + this.background1.x;
    }
  }

}
