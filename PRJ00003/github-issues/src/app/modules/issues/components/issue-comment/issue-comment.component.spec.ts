/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { IssueCommentComponent } from './issue-comment.component';

describe('IssueCommentComponent', () => {
  let component: IssueCommentComponent;
  let fixture: ComponentFixture<IssueCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
