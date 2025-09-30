/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { IssueItemComponent } from './issue-item.component';

describe('IssueItemComponent', () => {
  let component: IssueItemComponent;
  let fixture: ComponentFixture<IssueItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
