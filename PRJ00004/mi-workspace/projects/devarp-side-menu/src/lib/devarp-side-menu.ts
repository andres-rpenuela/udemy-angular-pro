import { Component, input, output } from '@angular/core';
import {  RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'lib-devarp-side-menu',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: 'devarp-side-menu.html',
  styles: ``
})
export class DevarpSideMenu {
  isAuthenticated = input(false);

  inSignOn = output();
  outSignOn = output();

}
