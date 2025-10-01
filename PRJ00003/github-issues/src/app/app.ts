import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeToggleComponent } from "./common/components/theme-toggle/theme-toggle.component";
import { FloatingHomeBtnComponent } from "./common/components/floating-home-btn/floating-home-btn.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ThemeToggleComponent, FloatingHomeBtnComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('github-issues');
}
