import { Component, OnInit } from '@angular/core';
import {
  IonApp,
  IonButton,
  IonButtons,
  IonContent, IonFooter,
  IonHeader,
  IonIcon, IonImg, IonItem, IonLabel, IonList, IonMenuButton, IonRange,
  IonTitle, IonToggle,
  IonToolbar,
  GestureController, IonSelect, IonSelectOption, IonGrid, IonCol, IonRow
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import {FormsModule} from "@angular/forms";
import {SettingsInterface} from "./settings"
import {NgClass} from "@angular/common";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";


@Component({
  selector: 'app-settings',
  standalone: true,
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  imports: [IonButton, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonIcon, IonLabel, IonApp, IonFooter, IonRange, IonList, IonItem, IonToggle, IonImg, FormsModule, IonSelect, IonSelectOption, IonGrid, IonCol, IonRow, NgClass]
})
export class SettingsComponent  implements OnInit {
  settings: SettingsInterface = {
    scrollSpeed: 1,
    volume: 50,
    vibration: true,
    skin: 'flappybird',
    customSkinPath: undefined
  };

  constructor(
    private gestureCtrl: GestureController,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadSettings();
  }

  onSpeedChange(event: any) {
    this.settings.scrollSpeed = event.detail.value;
    this.saveSettings(this.settings);
  }

  onVolumeChange(event: any) {
    this.settings.volume = event.detail.value;
    this.saveSettings(this.settings);
  }

  onVibrationChange(event: any) {
    this.settings.vibration = event.detail.checked;
    this.saveSettings(this.settings);
  }

  saveSettings(settings: any) {
    console.log('Saving');
    localStorage.setItem('settings', JSON.stringify(settings));
  }

  loadSettings() {
    console.log('Loading');
    const settings = localStorage.getItem('settings');
    if (settings) {
      this.settings = JSON.parse(settings);
    }
  }

  onSkinSelect(skin: string) {
    this.settings.skin = skin;
    this.saveSettings(this.settings);
  }

  async onCustomSkin() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt,
        width: 500,
        height: 500,
      });

      if (!image || !image.webPath) {
        return;
      }
      const response = await fetch(image.webPath);
      const blob = await response.blob();
      const bitmap = await createImageBitmap(blob);

      const maxSize = 512; // Maximum width/height of the image
      const scale = Math.min(maxSize / bitmap.width, maxSize / bitmap.height);

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        return;
      }

      canvas.width = bitmap.width * scale;
      canvas.height = bitmap.height * scale;

      context.beginPath();
      context.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 2, 0, Math.PI * 2);
      context.clip();

      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

      this.settings.customSkinPath = canvas.toDataURL();

      this.saveSettings(this.settings);
    } catch (error) {
      console.error(error);
    }
  }

  onBack() {
    this.router.navigate(['/menu']);
  }

}
