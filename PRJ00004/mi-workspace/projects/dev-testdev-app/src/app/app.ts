import { Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// Importar el side-menu de la libreria, como es un mone repo, se puede importar directamente
import { DevarpSideMenu, MenuAction, MenuItem, SECTION_MENU_TYPES, TextColorType } from 'devarp-side-menu';
import { sidevarMenuItems } from './shared/menu-items.data';

@Component({
  selector: 'app-root',
  imports: [ DevarpSideMenu ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
   // vars
  // readonly textItemColor = TextColorType.pink;
  protected readonly titleColor = computed(() => {
    return this.isDarkMode() ? TextColorType.blue : TextColorType.pink;
  });
  // App title signal
  protected readonly title = signal('dev-testdev-app');

  // State signals
  protected isDarkMode = signal(true);
  protected isAuthenticated = signal<boolean>(false);


  // Botton flotante
  private readonly activateButtonInSidebar:boolean= false;
  useFloatingButtonChildren = signal<boolean>( this.activateButtonInSidebar );
  isSidevarOpen = signal<boolean>(false);

  public toggleChildSidebar(): void {
    console.log('Toggling sidebar from parent component');
    this.isSidevarOpen.update( current => !current );
  }

  public onSidebarStateChange(newState: boolean): void {
    console.log('Sidebar state changed:', newState);
    this.isSidevarOpen.set(newState);
  }



  // Menu items signal
  protected menuItems = signal<MenuItem[]>( sidevarMenuItems );



  // ✅ CORREGIDO: Método para cambio de tema
  onThemeChange(isDark: boolean) {
    console.log('Parent - Theme change received:', isDark);
    this.isDarkMode.set(isDark);

    // Forzar detección de cambios si es necesario
    setTimeout(() => {
      console.log('Parent - Theme after timeout:', this.isDarkMode());
    }, 100);

    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  // ✅ NUEVO: Cargar tema del localStorage al iniciar
  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkMode.set(savedTheme === 'dark');
    }
  }
  // // Methods
  // handleAuth(): void {
  //   // Toggle authentication state
  //   this.isAuthenticated.update(current => !current);
  //   console.log('Auth toggled:', this.isAuthenticated());
  // }

  // onMenuClick(item: MenuItem): void {
  //   console.log('Menu item clicked:', item);
  // }


  // onSubItemClick(event: { parent: MenuItem, child: MenuItem }): void {
  //   console.log('Sub-item clicked:', {
  //     parent: event.parent.label,
  //     child: event.child.label,
  //     route: event.child.route
  //   });
  // }

  handleMenuClose(): void {
    console.log('Menu closed');
  }
}
