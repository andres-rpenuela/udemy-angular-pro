import { isPlatformServer } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
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

  private platform = inject(PLATFORM_ID);

  constructor() { }

  ngOnInit() {
    // cambia <title> del Head del Html
    // this.title.setTitle('Pricing Page')
    // // añade/cambia el meta
    // this.meta.updateTag({name:'description',content: 'Este es mi Pricing Page'});
    // this.meta.updateTag({name:'og:title',content: 'Este es mi Pricing Page'});
    // this.meta.updateTag({name:'keywords',content: 'Hola,Andres,Mundo,Fernando,Angular,PRO'});

    // Da error, pero compila y funciona
    // Page reload sent to client(s). ERROR ReferenceError: document is not defined
    // document.title='Princing Page';

    // esto se ejecuta dos veces, tal y como muestra la consola, uno cuando se ejecuta en el servidor y otro manda al cliente
    // pero en el navegador solo aparece una vez, que es lo que se carga una vez ejeuctado en el servidor y enviado al cliente
    //console.log({hola: 'mudno'});

    console.log('estoy en el servidor? ');
    console.log( isPlatformServer( this.platform ) );
    if(!isPlatformServer( this.platform) ){
      // no se ejecte en el lado del serivcdor
      document.title='Princing Page';
    }
  }

}
