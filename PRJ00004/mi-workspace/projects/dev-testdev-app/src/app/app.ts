import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// Importar el side-menu de la libreria, como es un mone repo, se puede importar directamente
import { DevarpSideMenu } from 'devarp-side-menu';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DevarpSideMenu],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('dev-testdev-app');
}
