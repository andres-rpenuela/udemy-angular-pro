import { Component, effect, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { NgTemplateOutlet, TitleCasePipe } from '@angular/common';
import { LoaderComponent } from "@app/commons/loader/loader.component";
import { IssuesService } from '@issues-services/issues.service';
import { ModalErrorComponent } from "@app/commons/modal-error/modal-error.component";
import { IssueItemComponent } from "../../components/issue-item/issue-item.component";
import { LabelsSelectorComponent } from "../../components/labels-selector/labels-selector.component";
import { State } from '../../interfaces/github-issue.interface';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-issuses-list-page',
  imports: [ TitleCasePipe, NgTemplateOutlet, LoaderComponent, ModalErrorComponent, IssueItemComponent, LabelsSelectorComponent, NgClass],
  templateUrl: './issuses-list-page.component.html',
  styleUrls: ['./issuses-list-page.component.css']
})
export default class IssusesListPageComponent implements OnInit {
  public readonly states : State[] = [State.All, State.Open, State.Closed];

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
    //return this.issuesService.getAllIssues;
    return this.issuesService.getAllIssuesByState;
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

  public setState(newState: string) {
    // Convertir string a State
    const state = {
      'all': State.All,
      'open': State.Open,
      'closed': State.Closed
    }[newState.toLowerCase()] ?? State.All;

    this.issuesService.stateSelected.set(state);
    console.log('Estado seleccionado:', this.issuesService.stateSelected());
  }

  public get stateSelected(): WritableSignal<State> {
    return this.issuesService.stateSelected;
  }
}
