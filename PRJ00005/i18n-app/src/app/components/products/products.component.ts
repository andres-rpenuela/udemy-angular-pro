import { Component, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { LenguageSelectorComponent } from "../lenguage-selector/lenguage-selector.component";
import { TranslateModule } from '@ngx-translate/core';
import { CurrencyPipe } from '@angular/common';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  imports: [RouterLink, LenguageSelectorComponent, TranslateModule, CurrencyPipe]
})
export default class ProductsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
