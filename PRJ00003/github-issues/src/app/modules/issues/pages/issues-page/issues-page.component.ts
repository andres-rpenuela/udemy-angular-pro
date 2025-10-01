import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { IssuesService } from '../../services/issues.service';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';
import { DatePipe } from '@angular/common';
import { MarkdownComponent } from "ngx-markdown";
import { LabelsSelectorComponent } from '../../components/labels-selector/labels-selector.component';
import { LoaderComponent } from '@app/commons/loader/loader.component';


@Component({
  selector: 'app-issues-page',
  templateUrl: './issues-page.component.html',
  styleUrls: ['./issues-page.component.css'],
  imports: [DatePipe, MarkdownComponent, LabelsSelectorComponent, LoaderComponent]
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

  ngOnInit() {
  }

}
