import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Device } from '@capacitor/device';
import {
  IonApp,
  IonButton,
  IonButtons,
  IonContent, IonFooter,
  IonHeader, IonIcon, IonLabel,
  IonMenuButton,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";



@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [IonButton, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonIcon, IonLabel, IonApp, IonFooter],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  batteryStatus: number = -1;
  constructor(private router: Router) {
    this.getBatteryStatus();
  }

  startGame() {
    this.router.navigateByUrl('/game');
  }

  about() {
    // Implement this method to navigate to the about page or show about info
    console.log('About clicked');
  }

  getBatteryStatus() {
    Device.getBatteryInfo().then((info) => {
      if (info.batteryLevel !== undefined) {
        this.batteryStatus = info.batteryLevel*100;
      }
      else {
        this.batteryStatus = -1;
      }
    });
  }

  showSettings() {
    this.router.navigateByUrl('/settings');
  }

  showHighscores() {
    this.router.navigateByUrl('/highscores');
  }

  protected readonly Math = Math;
  protected readonly Number = Number;
}
