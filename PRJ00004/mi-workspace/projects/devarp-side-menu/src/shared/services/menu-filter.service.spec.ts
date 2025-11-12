import { TestBed } from '@angular/core/testing';
import { MenuFilterService } from './menu-filter.service';
import { MenuItem } from '../interfaces/menu-item.interface';

describe('MenuFilterService', () => {
  let service: MenuFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MenuFilterService]
    });

    service = TestBed.inject(MenuFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debería devolver solo items públicos si el usuario no está autenticado', () => {
    // Arrange
    const mockItems: MenuItem[] = [
      {
        id: 'home',
        label: 'Inicio',
        route: '/home',
        requiresAuth: false,
        icon: 'home'
      },
      {
        id: 'profile',
        label: 'Mi Perfil',
        route: '/profile',
        requiresAuth: true,
        icon: 'user'
      }
    ];

    service.menuItems.set(mockItems);
    service.isAuthenticated.set(false);

    // Act
    const result = service.filterMenuItemsMyAuth();

    // Assert
    expect(result.length).toBe(1);
    expect(result[0].label).toBe('Inicio');
    expect(result[0].requiresAuth).toBe(false);
  });

  it('debería devolver todos los items cuando el usuario está autenticado', () => {
    // Arrange
    const mockItems: MenuItem[] = [
      {
        id: 'home',
        label: 'Inicio',
        route: '/home',
        requiresAuth: false,
        icon: 'home'
      },
      {
        id: 'profile',
        label: 'Mi Perfil',
        route: '/profile',
        requiresAuth: true,
        icon: 'user'
      }
    ];

    service.menuItems.set(mockItems);
    service.isAuthenticated.set(true);

    // Act
    const result = service.filterMenuItemsMyAuth();

    // Assert
    expect(result.length).toBe(2);
    expect(result.map(item => item.label)).toEqual(['Inicio', 'Mi Perfil']);
  });
});
