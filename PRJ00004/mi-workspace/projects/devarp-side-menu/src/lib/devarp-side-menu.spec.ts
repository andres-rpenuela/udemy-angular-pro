import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevarpSideMenu } from './devarp-side-menu';
import { provideZoneChangeDetection, provideZonelessChangeDetection } from '@angular/core';

describe('DevarpSideMenu', () => {
  let component: DevarpSideMenu;
  let fixture: ComponentFixture<DevarpSideMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevarpSideMenu],
      providers: [
        provideZonelessChangeDetection()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevarpSideMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
