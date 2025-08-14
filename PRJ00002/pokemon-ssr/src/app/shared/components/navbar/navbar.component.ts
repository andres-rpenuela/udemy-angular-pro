import { CommonModule } from '@angular/common';
import { Component, input, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'navbar',
  imports: [CommonModule,RouterLink,RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public title = input('Portafolio')
  public isOpen = signal(false);

  constructor() { }

  ngOnInit() {
  }

  toggleMenu(): void {
    this.isOpen.update(value => !value);
  }
}
