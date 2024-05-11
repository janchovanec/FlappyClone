import { Component, OnInit } from '@angular/core';
import {NgForOf} from "@angular/common";
import {
  IonApp,
  IonButton,
  IonButtons, IonContent,
  IonFooter,
  IonHeader,
  IonIcon, IonItem, IonLabel, IonList, IonListHeader,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";
import {Router} from "@angular/router";

@Component({
  selector: 'app-highscores',
  templateUrl: './highscores.component.html',
  styleUrls: ['./highscores.component.scss'],
  imports: [
    NgForOf,
    IonApp,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonButtons,
    IonContent,
    IonIcon,
    IonList,
    IonListHeader,
    IonLabel,
    IonItem,
    IonFooter
  ],
  standalone: true
})
export class HighscoresComponent  implements OnInit {
  highscores: any;
  router : Router;
  constructor(router : Router) {
    this.highscores = [];
    this.router = router;
  }

  ngOnInit() {
    this.highscores = this.loadHighscores();


  }

  loadHighscores() {
    let hs = localStorage.getItem('scoreboard');
    let highscores: any[] = [];
    if (hs) {
      highscores = JSON.parse(hs);
      highscores.sort((a,b) => b.score - a.score);
      return highscores;
    }
    return [];
  }

  onResetHighscores() {
    // Prompt user to confirm
    if (!confirm('Are you sure you want to reset the highscores?')) {
      return;
    }

    localStorage.removeItem('scoreboard');
    this.highscores = [];
  }

  onBack() {
    this.router.navigate(['/menu']);
  }

}
