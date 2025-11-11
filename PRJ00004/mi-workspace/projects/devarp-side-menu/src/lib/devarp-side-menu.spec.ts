import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DevarpSideMenu } from './devarp-side-menu';
import { MenuItemComponent } from '../components/menu-item/menu-item.component';



describe('DevarpSideMenu', () => {

  let component: DevarpSideMenu;
  let fixture: ComponentFixture<DevarpSideMenu>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      //declarations: [DevarpSideMenu],
      imports: [DevarpSideMenu, MenuItemComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevarpSideMenu);

    component = fixture.componentInstance;
  });


  it('should emit onThemeChange when theme toggle button is clicked', () => {
    // output del compoentne a espiar
    spyOn(component.onThemeChange, 'emit');

   // asignamos valor a los inputs
    fixture.componentRef.setInput('showThemeToggle',true)
    fixture.detectChanges();

    // Se obteiene el buton
    const button = fixture.nativeElement.querySelector('[btn-data-theme-toggle]') as HTMLButtonElement;

    console.log('Button->',button)
    expect(button).toBeTruthy();

    button.click();

    expect(component.onThemeChange.emit ).toHaveBeenCalled();
  });

  it('should not render theme toggle button when showThemeToggle is false', () => {
    // output del compoentne a espiar
    spyOn(component.onThemeChange, 'emit');

   // asignamos valor a los inputs
    fixture.componentRef.setInput('showThemeToggle',false)
    fixture.detectChanges();

    // Se obteiene el buton
    const button = fixture.nativeElement.querySelector('[btn-data-theme-toggle]') as HTMLButtonElement;

    console.log('Button->',button)
    expect(button).toBeNull();

  });
});
