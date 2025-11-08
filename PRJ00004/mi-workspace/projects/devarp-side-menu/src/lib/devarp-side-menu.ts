import {
  Component,
  input,
  output,
  signal,
  computed,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItemComponent } from '../components/menu-item/menu-item.component';
import {  MenuItem } from '../shared/interfaces/menu-item.interface';
import { TextColorType } from '../public-api';
import {
  getSectionDisplayName,
  getSectionPriority,
} from '../shared/helpers/menu.helper';
import { GroupedSection } from '../shared/interfaces/grouped-section.interface';
import { SECTION_MENU_TYPES, SectionMenu } from '../shared/types/menu-section.type';
import { UserInfo } from '../shared/interfaces/user-info.interface';

@Component({
  selector: 'devarp-side-menu',
  imports: [CommonModule, MenuItemComponent],
  templateUrl: './devarp-side-menu.html',
  styleUrls: ['./devarp-side-menu.css'],
})
export class DevarpSideMenu {
  // ✅ INPUTS
  titleText = input<string>('Menu');
  subtitleText = input<string>('');
  navItems = input<MenuItem[]>([]);
  colorTitle = input<TextColorType>(TextColorType.blue);
  showThemeToggle = input<boolean>(true);
  useButtonFloatingChildComponent = input<boolean>(true);
  initialDarkMode = input<boolean>(true);
  isAuthenticated = input<boolean>(false);
  userInfo = input<UserInfo | null>(null);

  // ✅ OUTPUTS
  onThemeChange = output<boolean>();
  onSidebarStateChange = output<boolean>();

  // ✅ SIGNALS DE ESTADO
  private readonly isDarkModeSignal = signal<boolean>(true);
  private readonly isMenuOpenSignal = signal<boolean>(false);
  private readonly expandedItemsSignal = signal<string[]>([]);

  // ✅ COMPUTED PROPERTIES
  protected readonly isDarkMode = computed(() => this.isDarkModeSignal());
  protected readonly isMenuOpen = computed(() => this.isMenuOpenSignal());
  protected readonly expandedItems = computed(() => this.expandedItemsSignal());

  protected readonly titleClasses = computed(() => {
    const colorTitle = this.colorTitle();
    const isDark = this.isDarkMode();

    let colorClass = '';

    switch (colorTitle) {
      case TextColorType.blue:
        colorClass = isDark ? 'text-blue-400' : 'text-blue-600';
        break;
      case TextColorType.pink:
        colorClass = isDark ? 'text-pink-400' : 'text-pink-600';
        break;
      case TextColorType.green:
        colorClass = isDark ? 'text-green-400' : 'text-green-600';
        break;
      case TextColorType.red:
        colorClass = isDark ? 'text-red-400' : 'text-red-600';
        break;
      case TextColorType.yellow:
        colorClass = isDark ? 'text-yellow-400' : 'text-yellow-600';
        break;
      case TextColorType.purple:
        colorClass = isDark ? 'text-purple-400' : 'text-purple-600';
        break;
      default:
        colorClass = isDark ? 'text-white' : 'text-gray-900';
    }

    return `text-lg font-bold ${colorClass}`;
  });

  protected readonly themeClasses = computed(() => {
    const isDark = this.isDarkMode();
    return {
      text: isDark ? 'text-white' : 'text-gray-900',
      textMuted: isDark ? 'text-gray-300' : 'text-gray-600',
      border: isDark ? 'border-gray-600' : 'border-gray-200',
      hover: isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
      separator: isDark
        ? 'bg-gradient-to-r from-gray-500 to-transparent'
        : 'bg-gradient-to-r from-gray-300 to-transparent',
      toggleBg: isDark ? 'bg-blue-600' : 'bg-gray-200',
      toggleThumb: isDark ? 'translate-x-5 bg-white' : 'translate-x-0 bg-white',
      floatingButton: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white',
      floatingButtonBackdrop: 'bg-white bg-opacity-20',
    };
  });

  // ✅ COMPUTED PARA ITEMS FILTRADOS Y AGRUPADOS - USANDO TIPOS CORRECTOS
  // ✅ ASEGURAR QUE EL COMPUTED FUNCIONE CORRECTAMENTE
  protected readonly groupedNavItems = computed(() => {
    const items = this.navItems();
    const isAuth = this.isAuthenticated();

    // Filtrar items por autenticación
    const filteredItems = this.filterItemsByAuth(items, isAuth);

    // Agrupar por sección
    const grouped = this.groupItemsBySection(filteredItems);

    // ✅ Filtrar secciones vacías
    const nonEmptySections = grouped.filter(section => section.items.length > 0);

    console.debug('🔒 Auth state:', isAuth);
    console.debug('📋 Filtered items:', filteredItems);
    console.debug('📂 Grouped sections:', nonEmptySections);

    return nonEmptySections;
  });

  // ✅ EFFECT PARA SINCRONIZAR CON INPUT INICIAL
  constructor() {
    effect(() => {
      this.isDarkModeSignal.set(this.initialDarkMode());
    });
  }

  // ✅ MÉTODOS PÚBLICOS PARA CONTROLAR EL MENÚ
  public toggleTheme(): void {
    const newDarkMode = !this.isDarkMode();
    this.isDarkModeSignal.set(newDarkMode);
    this.onThemeChange.emit(newDarkMode);
  }

  public openMenu(): void {
    console.debug('🟢 DevarpSideMenu: Opening menu');
    this.isMenuOpenSignal.set(true);
    this.onSidebarStateChange.emit(true);
  }

  public closeMenu(): void {
    console.debug('🔴 DevarpSideMenu: Closing menu');
    this.isMenuOpenSignal.set(false);
    this.onSidebarStateChange.emit(false);

    // ✅ Debug: Verificar que se apliquen las clases
    setTimeout(() => {
      const sidebar = document.querySelector('.sidebar-container');
      console.debug('📱 Sidebar after close - classes:', sidebar?.className);
      console.debug(
        '📱 Sidebar after close - computed style:',
        window.getComputedStyle(sidebar!).transform
      );
      console.debug(
        '📱 Sidebar after close - opacity:',
        window.getComputedStyle(sidebar!).opacity
      );
    }, 100);
  }

  public toggleMenu(): void {
    const newState = !this.isMenuOpen();
    console.debug('🔄 DevarpSideMenu: Toggling menu to:', newState);
    this.isMenuOpenSignal.set(newState);
    this.onSidebarStateChange.emit(newState);
  }

  // ✅ MÉTODO PARA MANEJAR EXPANSIÓN DE ITEMS - CORREGIDO
  protected handleToggleExpansion(itemId: string): void {
    console.debug('🔧 DevarpSideMenu: Toggling expansion for item:', itemId);
    const currentExpanded = this.expandedItemsSignal();

    if (currentExpanded.includes(itemId)) {
      // Quitar el item de expandidos y todos sus hijos
      const newExpanded = currentExpanded.filter(
        (id) => !this.isChildOf(itemId, id) && id !== itemId
      );
      this.expandedItemsSignal.set(newExpanded);
      console.debug(
        '📤 Collapsed item and children:',
        itemId,
        'New expanded:',
        newExpanded
      );
    } else {
      // Agregar el item a expandidos
      const newExpanded = [...currentExpanded, itemId];
      this.expandedItemsSignal.set(newExpanded);
      console.debug('📥 Expanded item:', itemId, 'New expanded:', newExpanded);
    }
  }

  // ✅ HELPER PARA VERIFICAR SI UN ITEM ES HIJO DE OTRO
  private isChildOf(parentId: string, childId: string): boolean {
    const findInItems = (
      items: MenuItem[],
      targetParentId: string,
      targetChildId: string
    ): boolean => {
      for (const item of items) {
        if (item.id === targetParentId && item.subItems) {
          // Buscar en hijos directos
          if (item.subItems.some((child) => child.id === targetChildId)) {
            return true;
          }
          // Buscar recursivamente en nietos
          for (const child of item.subItems) {
            if (
              child.subItems &&
              findInItems([child], child.id, targetChildId)
            ) {
              return true;
            }
          }
        }
      }
      return false;
    };

    return findInItems(this.navItems(), parentId, childId);
  }

  // ✅ MÉTODO PARA AUTENTICACIÓN
  protected showUserInfo(): boolean {
    return this.isAuthenticated() && !!this.userInfo();
  }

  // ✅ MÉTODO CORREGIDO PARA FILTRAR POR AUTENTICACIÓN
  private filterItemsByAuth(items: MenuItem[], isAuth: boolean): MenuItem[] {
    return items
      .filter(item => {
        // ✅ LÓGICA ESPECÍFICA PARA AUTH:

        // Si requiere autenticación pero NO está autenticado → OCULTAR
        if (item.requiresAuth === true && !isAuth) {
          return false;
        }

        // Si NO requiere autenticación pero SÍ está autenticado → OCULTAR
        // (Esto típicamente es para login/register)
        if (item.requiresAuth === false && isAuth) {
          return false;
        }

        // ✅ CASOS QUE SE MUESTRAN:
        // - requiresAuth: true y isAuth: true → MOSTRAR (dashboard, logout, etc.)
        // - requiresAuth: false y isAuth: false → MOSTRAR (login, register)
        // - requiresAuth: undefined → MOSTRAR (siempre visible como help, about)
        return true;
      })
      .map(item => ({
        ...item,
        subItems: item.subItems ? this.filterItemsByAuth(item.subItems, isAuth) : undefined
      }))
      .filter(item =>
        // Mantener el item si no tiene subItems o si tiene subItems después del filtrado
        !item.subItems || item.subItems.length > 0
      );
  }

  // ✅ MÉTODO CORREGIDO USANDO TU ESTRUCTURA
  private groupItemsBySection(items: MenuItem[]): GroupedSection[] {
    const sections = new Map<SectionMenu, MenuItem[]>();

    items.forEach((item) => {
      const sectionKey = item.section || SECTION_MENU_TYPES.main;
      if (!sections.has(sectionKey)) {
        sections.set(sectionKey, []);
      }
      sections.get(sectionKey)!.push(item);
    });

    return Array.from(sections.entries())
      .map(([key, items]) => ({
        name: getSectionDisplayName(key),
        key: key,
        items,
        priority: getSectionPriority(key),
      }))
      .sort((a, b) => a.priority - b.priority);
  }

  protected readonly sidebarClasses = computed(() => {
    const isOpen = this.isMenuOpen();
    const themeClass = this.isDarkMode()
      ? 'bg-gradient-to-br from-gray-800 to-gray-900'
      : 'bg-gradient-to-br from-white to-gray-50';

    const visibilityClass = isOpen ? 'sidebar-visible' : 'sidebar-hidden';

    return `sidebar-container ${themeClass} ${visibilityClass}`;
  });

  protected createMainItem(
    item: MenuItem
  ): MenuItem & { level?: number; isExpandable?: boolean } {
    return {
      ...item,
      level: 0,
      isExpandable: !!(item.subItems && item.subItems.length > 0),
    };
  }

  // Los otros métodos ya están definidos:
  protected createChildItem(
    item: MenuItem
  ): MenuItem & { level: number; isExpandable?: boolean } {
    return {
      ...item,
      level: 1,
      isExpandable: !!(item.subItems && item.subItems.length > 0),
    };
  }

  protected createGrandchildItem(
    item: MenuItem
  ): MenuItem & { level: number; isExpandable?: boolean } {
    return {
      ...item,
      level: 2,
      isExpandable: !!(item.subItems && item.subItems.length > 0),
    };
  }
}
