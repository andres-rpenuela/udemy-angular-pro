import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'floating-home-btn',
  standalone: true,
  imports: [RouterModule],
  template: `
    <a routerLink="/" class="fixed top-6 left-6 z-50 bg-blue-600 hover:bg-blue-700 text-white dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-blue-300 rounded-full shadow-lg p-4 flex items-center justify-center transition-colors">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0h6" />
      </svg>
    </a>
  `,
  styles: [`
    a { box-shadow: 0 4px 16px rgba(0,0,0,0.15); }
    a:active { transform: scale(0.95); }
  `]
})
export class FloatingHomeBtnComponent {}
