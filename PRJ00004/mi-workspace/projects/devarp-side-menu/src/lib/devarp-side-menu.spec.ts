import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevarpSideMenu } from './devarp-side-menu';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

describe('DevarpSideMenu', () => {
  let component: DevarpSideMenu;
  let fixture: ComponentFixture<DevarpSideMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevarpSideMenu, ],
      providers: [
        provideZonelessChangeDetection(),
        //Si tu componente necesita ActivatedRoute, configura el test con routing:
        // OPT. 1
        //RouterTestingModule // ← Agregar RouterTestingModule
        // OPT. 2
        /*{
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: {} },
            queryParams: { subscribe: () => {} },
            params: { subscribe: () => {} }
          }
        }*/
        // OPT. 3
        provideRouter([]) // ← Proveedor moderno de routing
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevarpSideMenu);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', () => {
    fixture.detectChanges(); // Necesario para zoneless en componentes
    expect(component).toBeTruthy();
  });
});
