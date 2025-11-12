import { Component, input, OnInit, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-aside-menu',
  templateUrl: './aside-menu.component.html',
  styles: [''],
  imports: [RouterLink, RouterLinkActive]
})
export class AsideMenuComponent implements OnInit {

  isAuthenticated = input(false);

  onSignIn = output();
  onSignOut = output();


  constructor() { }

  ngOnInit() {
  }

}
