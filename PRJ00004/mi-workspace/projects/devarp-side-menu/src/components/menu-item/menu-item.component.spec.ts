// /* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuItemComponent } from './menu-item.component';
import { provideRouter } from '@angular/router';
import { MenuItem, UserInfo } from '../../public-api';



const menuItemWithSubItemsMock: MenuItem = {
  id: '1',
  label: 'Dashboard',
  route: '/dashboard',
  level: 0,
  isExpandable: false,
  subItems: [
    {
      id: '1-1',
      label: 'Sub Dashboard',
      route: '/dashboard/sub',
      level: 1,
      isExpandable: false,
      subItems: [],
    }
  ],
}
 const menuItemWithoutSubItemsMock: MenuItem = {
  id: '2',
  label: 'Settings',
  route: '/settings',
  level: 0,
  isExpandable: false,
  subItems: [],
}

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

  it('given menu item with sub-items, should allow call to onToggleExpansion', () => {

    // prueba sobre un OUTPUT
    spyOn(component.onToggleExpansion, 'emit');

    fixture.componentRef.setInput('menuItem', menuItemWithSubItemsMock);
    fixture.componentRef.setInput('userInfo',null);
    fixture.detectChanges();

    // seleccion del elemento por "data-attributes"
    // El elemento tiene que tener el atributo data-login
    const button = fixture.nativeElement.querySelector('[btn-data-expand-button]') as HTMLButtonElement;

    //console.log('BUTTON->', button);
    // comprobar que el boton exista (tiene un valor positivo)
    expect(button).toBeTruthy();

    // simular clcik
    button.click();

    // lo que esperamo que pase es que halla sido llamado
    expect(component.onToggleExpansion.emit).toHaveBeenCalled();
  });


  it('given menu item without sub-items, should not allow call to onToggleExpansion', () => {

    // prueba sobre un OUTPUT
    spyOn(component.onToggleExpansion, 'emit');

    fixture.componentRef.setInput('menuItem', menuItemWithoutSubItemsMock);
    fixture.componentRef.setInput('userInfo',null);
    fixture.detectChanges();

    // seleccion del elemento por "data-attributes"
    // El elemento tiene que tener el atributo data-login
    const button = fixture.nativeElement.querySelector('[btn-data-expand-button]') as HTMLButtonElement;

    //console.log('BUTTON->', button);
    // comprobar que el boton no exista
    expect(button).toBeNull();

  });
});
