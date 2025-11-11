// /* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MenuItemComponent } from './menu-item.component';
import { provideRouter } from '@angular/router';

describe('MenuItemComponent', () => {
  let component: MenuItemComponent;
  let fixture: ComponentFixture<MenuItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers:[ provideRouter([]) ],
      imports: [ MenuItemComponent ],
      // declarations: [ MenuItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuItemComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
