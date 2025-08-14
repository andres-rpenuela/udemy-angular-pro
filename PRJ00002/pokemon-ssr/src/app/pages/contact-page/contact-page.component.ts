import { Component, inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.css']
})
export default class ContactPageComponent implements OnInit {

  // Coger Ttile, Meta,... de `planfrom-browser`
  // privado, porque no queremos que llegue al tempalte
  private title = inject(Title);
  private meta = inject(Meta);

  constructor() { }

  ngOnInit() {
    // cambia <title> del Head del Html
    this.title.setTitle('Contact Page')
    // añade/cambia el meta
    this.meta.updateTag({name:'description',content: 'Este es mi Contact Page'});
    this.meta.updateTag({name:'og:title',content: 'Este es mi Contact Page'});
    this.meta.updateTag({name:'keywords',content: 'Hola,Andres,Mundo,Fernando,Angular,PRO'});
  }

}
