import { HttpClient } from '@angular/common/http';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { IssuesService } from '../../services/issues.service';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';
import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { MarkdownComponent } from "ngx-markdown";
import { LabelsSelectorComponent } from '../../components/labels-selector/labels-selector.component';
import { LoaderComponent } from '@app/commons/loader/loader.component';
import { IssueCommentComponent } from "../../components/issue-comment/issue-comment.component";
import { ModalErrorComponent } from "@app/commons/modal-error/modal-error.component";


@Component({
  selector: 'app-issues-page',
  templateUrl: './issues-page.component.html',
  styleUrls: ['./issues-page.component.css'],
  imports: [DatePipe, MarkdownComponent, LabelsSelectorComponent, LoaderComponent, IssueCommentComponent, ModalErrorComponent, NgTemplateOutlet]
})
export default class IssuesPageComponent implements OnInit {
  private http = inject(HttpClient);
  private issuesService = inject(IssuesService);

  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  // Se obtiene el número del issue desde la URL cuando se crea el componente
  //public issueNumber: number = +this.activatedRoute.snapshot.paramMap.get('issueNumber')!;

  // Recomendado por Angular:
  // Como usas snapshot, solo toma el valor en el momento en que se crea el componente.
  //private number = toSignal( of( this.route.snapshot.paramMap.get('name') ?? '' ))

  // esto reacciona si cambia el valor (por navegación dentro del mismo componente)
  protected issueNumber = toSignal<number | null>(
    this.activatedRoute.paramMap.pipe(
      map(params => {
        // paramMap is of type ParamMap
        const id = params.get('number');
        const num = Number(id);
        return isNaN(num) ? null : num;
      }),
      tap(num => {
        if (num === null) {
          this.router.navigate(['/issues']);
        }
        console.log("num= ", num)
      })
    ),
    { initialValue: null }
  );

  constructor() { }

  // ERROR Error: NG0203: injectQuery() can only be used within an injection context such as a constructor, a factory function, a field initializer, or a function used with `runInInjectionContext`. Find more at https://v20.angular.dev/errors/NG0203
  // get issue(){
  //   return this.issuesService.getIssueByNumber(this.issueNumber);
  // }
  // solution: crear la query dentro del constructor o ngOnInit o en un campo inicializador
  public issue = this.issuesService.getIssueByNumber(this.issueNumber);

  public comments = this.issuesService.getIssueCommentsByNumber(this.issueNumber);


  ngOnInit() {
  }

  // gesion del modal de erro
  public mostrarModal = signal<boolean>(false);
  public mensajeError = signal<string>('');

 private errorEffect = effect(() => {
    if (this.issue.isError()) {
      this.lanzarError(this.issue.error()?.message!);
    }

    if (this.comments.isError()) {
      this.lanzarError(this.comments.error()?.message!);
    }
  });


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
