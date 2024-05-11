import { Routes } from '@angular/router';
import {GameComponent} from "./game/game.component";
import {MenuComponent} from "./menu/menu.component";
import {SettingsComponent} from "./settings/settings.component";
import {HighscoresComponent} from "./highscores/highscores.component";

export const routes: Routes = [
  { path: 'game', component: GameComponent },
  { path: 'menu', component: MenuComponent},
  { path: '', redirectTo: '/menu', pathMatch: 'full' },
  { path: 'settings', component: SettingsComponent },
  { path: 'highscores', component: HighscoresComponent },
];
