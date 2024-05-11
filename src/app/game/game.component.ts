import {Component, OnDestroy, OnInit, ElementRef } from '@angular/core';
import * as Phaser from 'phaser';
import MainScene from './MainScene';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})

export class GameComponent implements  OnInit, OnDestroy {
  phaserGame!: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;
  router: Router;


  constructor(private elementRef: ElementRef, router: Router) {
    this.router = router;
    this.config = {
      type: Phaser.AUTO,
      width: window.innerHeight * 0.5625 * window.devicePixelRatio,
      height: window.innerHeight * window.devicePixelRatio,
      parent: this.elementRef.nativeElement,
      physics: {
        default: 'matter',
        matter: {
          gravity: {x: 0, y: 0.981},
          debug: false
        }
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'phaser-game-container',

      },
      scene: [new MainScene(this.router)]
    };
  }

  ngOnInit() {
    this.phaserGame = new Phaser.Game(this.config);
  }

  ngOnDestroy() {
    this.phaserGame.destroy(true);
  }
}

