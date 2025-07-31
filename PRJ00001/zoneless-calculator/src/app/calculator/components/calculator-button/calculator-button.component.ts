import { Component, ElementRef, HostBinding, input, OnInit, output, signal, viewChild, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'calculator-button',
  templateUrl: './calculator-button.component.html',
  styleUrls: ['./calculator-button.component.css'],
  // aplica la clase la host element
  host:{
    class: 'border-r border-b border-indigo-400',
    '[class.w-2/4]': 'isDobuleSize()' , // Alterantiva a usar @HostBinding(class.w-2/4)
    '[class.w-1/4]': '!isDobuleSize()',  //evitar sobrescribr si se djea en class por defecto
    // attribute: 'hola',
    // 'data-size': 'XL'
  },
  // no aplica ningun estilo, incluido el CSS
  //encapsulation: ViewEncapsulation.None
})
export class CalculatorButtonComponent implements OnInit {

  public isCommand = input( false, { transform: ( value : boolean | string ) =>  typeof value === 'string' ? value === '' : value });
  public isDobuleSize = input( false, { transform: ( value : boolean | string ) =>  typeof value === 'string' ? value === '' : value });
  public isPressed = signal(false);

  public onClick = output<string>();
  //public contentValue = viewChild<ElementRef>('btnCal');
  public contentValue = viewChild<ElementRef<HTMLButtonElement>>('btnCal');


  ngOnInit() {
  }

  // si se usa @HostBinding('class.is-command'), y el estilo esta en este compoente y no el padre, se produce un 'view-encapsulation', por lo que hay tres formas para desencapsular (no recomendado)
  // RECOMENDADO: mover la clase al padre, si se usa @HostBinding('class.is-command') y  se quiere evitar la encapsualcion
  //@HostBinding('class.is-command')
  // RECOMENADO +: usar sobre el emento [class.class-name]="condition", estando la clase a añadir en la hoja de estilos de este compoente (no hace falta usar hostbinding)
  get commandStyle(){
    return this.isCommand();
  }

  // Esta clase es de tailwinds y es global, por lo que no se produce un view encapsulation
  //@HostBinding('class.w-2/4')
  get commandSytleSize(){
    return this.isDobuleSize();
  }

  public emitValue(){
    if( !this.contentValue()?.nativeElement ){
      return;
    }

    //console.log(this.contentValue())

    const value = this.contentValue()!.nativeElement.innerText?.trim();
    this.onClick.emit(value);
  }

  public keyBoardPressedStyle(key:string){
    if( !this.contentValue() ){
      return;
    }

    const value = this.contentValue()!.nativeElement.innerText;

    if( value !== key ) return;

    this.isPressed.set(true);
    this.onClick.emit(value);

    setTimeout( () =>{
        this.isPressed.set(false);
    },100);

  }
}
