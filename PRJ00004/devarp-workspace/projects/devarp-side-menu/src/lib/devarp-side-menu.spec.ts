import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevarpSideMenu } from './devarp-side-menu';

describe('DevarpSideMenu', () => {
  let component: DevarpSideMenu;
  let fixture: ComponentFixture<DevarpSideMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevarpSideMenu]
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
