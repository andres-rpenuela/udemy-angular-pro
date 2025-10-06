import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsideMenuComponent } from '@app/modules/shared/components/aside-menu/aside-menu.component';
import { FooterComponent } from "@app/modules/shared/components/footer/footer.component";
import { NavMenuComponent } from "@app/modules/shared/components/nav-menu/nav-menu.component";
import { sign } from 'crypto';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styles: [''],
  imports: [RouterOutlet, AsideMenuComponent, FooterComponent, NavMenuComponent]
})
export default class AdminLayoutComponent implements OnInit {

  isAuthenticated = signal(false);


  constructor() { }

  ngOnInit() {
  }

  onLogin() {
    this.isAuthenticated.set(true);
  }

  onLogout() {
    this.isAuthenticated.set(false);
  }

}
