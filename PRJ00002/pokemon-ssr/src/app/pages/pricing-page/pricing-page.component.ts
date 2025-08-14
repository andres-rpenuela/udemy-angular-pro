import { Component, inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'pricing-page',
  templateUrl: './pricing-page.component.html',
  styleUrls: ['./pricing-page.component.css']
})
export default class PricingPageComponent implements OnInit {

  // Coger Ttile, Meta,... de `planfrom-browser`
  // privado, porque no queremos que llegue al tempalte
  private title = inject(Title);
  private meta = inject(Meta);

  constructor() { }

  ngOnInit() {
    // cambia <title> del Head del Html
    this.title.setTitle('Pricing Page')
    // añade/cambia el meta
    this.meta.updateTag({name:'description',content: 'Este es mi Pricing Page'});
    this.meta.updateTag({name:'og:title',content: 'Este es mi Pricing Page'});
    this.meta.updateTag({name:'keywords',content: 'Hola,Andres,Mundo,Fernando,Angular,PRO'});
  }

}
