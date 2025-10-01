import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { LoaderComponent } from "@app/commons/loader/loader.component";
import { IssuesService } from '@issues-services/issues.service';
import { ModalErrorComponent } from "@app/commons/modal-error/modal-error.component";
import { IssueItemComponent } from "../../components/issue-item/issue-item.component";
import { LabelsSelectorComponent } from "../../components/labels-selector/labels-selector.component";

@Component({
  selector: 'app-issuses-list-page',
  imports: [NgTemplateOutlet, LoaderComponent, ModalErrorComponent, IssueItemComponent, LabelsSelectorComponent],
  templateUrl: './issuses-list-page.component.html',
  styleUrls: ['./issuses-list-page.component.css']
})
export default class IssusesListPageComponent implements OnInit {

  private issuesService = inject(IssuesService);
  public mostrarModal = signal<boolean>(false);
  public mensajeError = signal<string>('');

 private errorEffect = effect(() => {
  if (this.getIssues().isError()) {
    this.lanzarError(this.getIssues().error()?.message!);
  }
});

  constructor() { }

  ngOnInit() {
  }

  public getIssues(){
    return this.issuesService.getAllIssues;
  }

  public getLabels(){
    return this.issuesService.getAllLabels;
  }


  public lanzarError(mensaje: string) {
    console.log('Lanzando error desde el componente padre: ', mensaje);
    this.mensajeError.set(mensaje ?? 'Ha ocurrido un error inesperado.');
    this.mostrarModal.set(true);
  }

  public cerrarModal() {
    console.log('Cerrando modal desde el componente padre');
    this.mostrarModal.set(false);
  }
}
