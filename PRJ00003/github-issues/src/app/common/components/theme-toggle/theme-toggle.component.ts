import { Component, signal, effect } from '@angular/core';

@Component({
  selector: 'theme-toggle',
  standalone: true,
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.css']
})
export class ThemeToggleComponent {
  theme = signal<'light' | 'dark'>(
    localStorage.getItem('theme') === 'dark'
      ? 'dark'
      : localStorage.getItem('theme') === 'light'
        ? 'light'
        : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );

  constructor() {
    effect(() => {
      this.applyTheme(this.theme());
    });
  }

  toggleTheme() {
    const next = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(next);
    localStorage.setItem('theme', next);
  }

  private applyTheme(theme: 'light' | 'dark') {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
}
