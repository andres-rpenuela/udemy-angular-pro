import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-error',
  templateUrl: './modal-error.component.html',
  standalone: true
})
export class ModalErrorComponent {
  @Input() errorMessage: string = 'Ha ocurrido un error inesperado.';
  @Output() closed = new EventEmitter<void>();

  close() {
    console.log('Cerrando modal desde el componente hijo');
    this.closed.emit();
  }
}
