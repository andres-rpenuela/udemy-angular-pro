import { Component, inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.css']
})
export default class AboutPageComponent implements OnInit {

  // Coger Ttile, Meta,... de `planfrom-browser`
  // privado, porque no queremos que llegue al tempalte
  private title = inject(Title);
  private meta = inject(Meta);


  constructor() { }

  ngOnInit() {
    // cambia <title> del Head del Html
    this.title.setTitle('About Page')
    // añade/cambia el meta
    this.meta.updateTag({name:'description',content: 'Este es mi About Page'});
    this.meta.updateTag({name:'og:title',content: 'Este es mi About Page'});
    this.meta.updateTag({name:'keywords',content: 'Hola,Andres,Mundo,Fernando,Angular,PRO'});
  }

}
