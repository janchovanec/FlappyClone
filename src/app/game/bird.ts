import Phaser from 'phaser';

export default class Bird {
  bird: Phaser.Physics.Matter.Sprite;
  velocity: number;

  constructor(scene: any, x: number, y: number, skin: string) {
    this.bird = scene.matter.add.sprite(x, y, skin) as Phaser.Physics.Matter.Sprite;
    this.bird.setScale(scene.screenWidth / this.bird.width * 0.15);
    this.bird.setCircle((this.bird.displayWidth / 2)*0.75);
    this.bird.setIgnoreGravity(false);
    this.bird.setFixedRotation();
    this.velocity = -1/96  * scene.screenWidth;
  }
  jump() {
    if (this.bird.angle > -20) {
      this.bird.angle = -20;
    }
    this.bird.angle -= 40;
    this.bird.setVelocityY(this.velocity);
  }
  update() {
    if (this.bird.angle < 60) {
      this.bird.angle += 5;
    }
  }
}
