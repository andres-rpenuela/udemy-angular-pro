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
    // tu imagen aparezca en previews
    this.meta.updateTag({  name: 'og:image',content: 'https://www.bing.com/images/search?view=detailV2&ccid=WguEgpGr&id=EF3D6B8ADEAC0EE16DF253BF030D807D115F16B0&thid=OIP.WguEgpGrtW6czUTQVxrWSAHaD4&mediaurl=https%3a%2f%2fcapsandassociates.org%2fimages%2fAbout-Us.jpeg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.5a0b848291abb56e9ccd44d0571ad648%3frik%3dsBZfEX2ADQO%252fUw%26pid%3dImgRaw%26r%3d0&exph=3000&expw=5733&q=about&FORM=IRPRST&ck=BE8C78F8FCA5514F40A0FC5622034444&selectedIndex=3&itb=0'});
  }

}
