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
import { MenuItem } from '../shared/interfaces/menu-item.interface';
import { TextColorType } from '../public-api';
import {
  getSectionDisplayName,
  getSectionPriority,
} from '../shared/helpers/menu.helper';
import { GroupedSection } from '../shared/interfaces/grouped-section.interface';
import {
  SECTION_MENU_TYPES,
  SectionMenu,
} from '../shared/types/menu-section.type';
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
  groupItemsBySection = input<boolean>(true);

  onDebugMode = input<boolean>(false);

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
  protected readonly hasUserNotifications = computed(() => this.userInfo()?.hasNotifications || false);

  // ✅ COMPUTED PARA ITEMS FILTRADOS POR ROLES Y AUTENTICACIÓN
  protected readonly visibleMenuItems = computed(() => {
    const items = this.navItems();
    const user = this.userInfo();
    const isAuth = this.isAuthenticated();

    console.debug('🔍 Processing items:', items);
    console.debug('👤 User info:', user);
    console.debug('🔒 Is authenticated:', isAuth);

    // 1. Filtrar por autenticación
    const authFilteredItems = this.filterItemsByAuth(items, isAuth);

    // 2. Filtrar por roles
    const roleFilteredItems = this.filterItemsByRoles(authFilteredItems, user);

    console.debug('🔒 Auth filtered items:', authFilteredItems);
    console.debug('👤 Role filtered items:', roleFilteredItems);

    return roleFilteredItems;
  });

  // ✅ COMPUTED PRINCIPAL - SOPORTA TANTO AGRUPADO COMO NO AGRUPADO
  protected readonly groupedNavItems = computed(() => {
    const filteredItems = this.visibleMenuItems();
    const shouldGroup = this.groupItemsBySection();

    console.debug('📊 Filtered items for grouping:', filteredItems);
    console.debug('🔧 Should group by section:', shouldGroup);

    if (!shouldGroup) {
      // Si no se agrupa, devolver todo en una sección principal
      const mainSection = {
        name: '',
        key: SECTION_MENU_TYPES.main,
        items: filteredItems,
        priority: 0,
      } as GroupedSection;

      console.debug('📦 Main section created:', mainSection);
      return [mainSection];
    }

    // Agrupar por sección
    const grouped = this.groupItemsBySectionMethod(filteredItems);

    // Filtrar secciones vacías
    const nonEmptySections = grouped.filter(
      (section) => section.items.length > 0
    );

    console.debug('📂 Grouped sections:', nonEmptySections);
    return nonEmptySections;
  });

  // ✅ COMPUTED PROPERTY PARA VERIFICAR SI HAY ITEMS VISIBLES
  protected readonly hasVisibleItems = computed(() => {
    const sections = this.groupedNavItems();
    if (sections.length === 0) {
      return false;
    }
    return sections.some((section) => section.items.length > 0);
  });

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

  // ✅ COMPUTED PARA VERIFICAR SI MOSTRAR PUNTO DE NOTIFICACIONES
  protected readonly shouldShowNotificationBadge = computed(() => {
    const hasNotifications = this.hasUserNotifications();
    const hasNotificationRoute = this.visibleMenuItems().some(item =>
      item.route === '/notifications' ||
      item.label?.toLowerCase().includes('notification')
    );
    const userCanSeeNotifications = this.userHasPermissionForNotifications();

    return hasNotifications && hasNotificationRoute && userCanSeeNotifications;
  });

  // ✅ MÉTODO PARA VERIFICAR PERMISOS DE NOTIFICACIONES
  private userHasPermissionForNotifications(): boolean {
    const notificationItem = this.navItems().find(item =>
      item.route === '/notifications' ||
      item.label?.toLowerCase().includes('notification')
    );

    if (!notificationItem) return false;

    // Si el item requiere autenticación y el usuario no está autenticado
    if (notificationItem.requiresAuth && !this.isAuthenticated()) {
      return false;
    }

    // Si no hay roles definidos, permitir acceso
    if (!notificationItem.allowedRoles || notificationItem.allowedRoles.length === 0) {
      return true;
    }

    // Verificar si el usuario tiene al menos uno de los roles permitidos
    const userRoles = this.userInfo()?.roles || [];
    return notificationItem.allowedRoles.some(role => userRoles.includes(role));
  }

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

  protected readonly sidebarClasses = computed(() => {
    const isOpen = this.isMenuOpen();
    const themeClass = this.isDarkMode()
      ? 'bg-gradient-to-br from-gray-800 to-gray-900'
      : 'bg-gradient-to-br from-white to-gray-50';

    const visibilityClass = isOpen ? 'sidebar-visible' : 'sidebar-hidden';

    return `sidebar-container ${themeClass} ${visibilityClass}`;
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
  }

  public toggleMenu(): void {
    const newState = !this.isMenuOpen();
    console.debug('🔄 DevarpSideMenu: Toggling menu to:', newState);
    this.isMenuOpenSignal.set(newState);
    this.onSidebarStateChange.emit(newState);
  }

  // ✅ MÉTODO PARA MANEJAR EXPANSIÓN DE ITEMS
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

  // ✅ MÉTODOS DE FILTRADO POR ROLES
  private filterItemsByRoles(
    items: MenuItem[],
    user: UserInfo | null
  ): MenuItem[] {
    return items
      .filter((item) => this.hasAccessToItem(item, user))
      .map((item) => ({
        ...item,
        subItems: item.subItems
          ? this.filterItemsByRoles(item.subItems, user)
          : undefined,
      }))
      .filter(
        (item) =>
          // Mantener items que no tienen subItems o que tienen subItems después del filtrado
          !item.subItems || item.subItems.length > 0
      );
  }

  private hasAccessToItem(item: MenuItem, user: UserInfo | null): boolean {
    // Si no hay roles definidos en el item, es accesible para todos
    if (!item.allowedRoles || item.allowedRoles.length === 0) {
      return true;
    }

    // Si no hay usuario, no tiene acceso
    if (!user || !user.roles) {
      return false;
    }

    // Verificar si el usuario tiene al menos uno de los roles permitidos
    return item.allowedRoles.some((role) => user.roles.includes(role));
  }

  // ✅ MÉTODOS DE FILTRADO POR AUTENTICACIÓN
  private filterItemsByAuth(items: MenuItem[], isAuth: boolean): MenuItem[] {
    return items
      .filter((item) => {
        // Si requiere autenticación pero NO está autenticado → OCULTAR
        if (item.requiresAuth === true && !isAuth) {
          return false;
        }

        // Si NO requiere autenticación pero SÍ está autenticado → OCULTAR
        if (item.requiresAuth === false && isAuth) {
          return false;
        }

        return true;
      })
      .map((item) => ({
        ...item,
        subItems: item.subItems
          ? this.filterItemsByAuth(item.subItems, isAuth)
          : undefined,
      }))
      .filter((item) => !item.subItems || item.subItems.length > 0);
  }

  // ✅ MÉTODO PARA AGRUPAR POR SECCIÓN (CORREGIDO EL NOMBRE DEL MÉTODO)
  private groupItemsBySectionMethod(items: MenuItem[]): GroupedSection[] {
    const sections = new Map<SectionMenu, MenuItem[]>();

    items.forEach((item) => {
      const sectionKey =
        (item.section as SectionMenu) || SECTION_MENU_TYPES.main;
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

  // ✅ MÉTODOS AUXILIARES
  private isChildOf(parentId: string, childId: string): boolean {
    const findInItems = (
      items: MenuItem[],
      targetParentId: string,
      targetChildId: string
    ): boolean => {
      for (const item of items) {
        if (item.id === targetParentId && item.subItems) {
          if (item.subItems.some((child) => child.id === targetChildId)) {
            return true;
          }
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

  protected showUserInfo(): boolean {
    const isAuth = this.isAuthenticated();
    const user = this.userInfo();

    console.debug('🔍 showUserInfo check:', {
      isAuthenticated: isAuth,
      userInfo: user,
      result: isAuth && !!user,
    });

    return isAuth && !!user;
  }
  protected readonly debugInfo = computed(() => {
    return {
      isAuthenticated: this.isAuthenticated(),
      userInfo: this.userInfo(),
      showUserInfo: this.showUserInfo(),
      menuItems: this.navItems().length,
      visibleItems: this.visibleMenuItems().length,
      sections: this.groupedNavItems().length,
      isMenuOpen: this.isMenuOpen(),
    };
  });

  protected getVisibleSubItems(subItems: MenuItem[]): MenuItem[] {
    const user = this.userInfo();
    return this.filterItemsByRoles(subItems, user);
  }

  // ✅ MÉTODOS PARA CREAR ITEMS CON NIVELES
  protected createMainItem(
    item: MenuItem
  ): MenuItem & { level?: number; isExpandable?: boolean } {
    return {
      ...item,
      level: 0,
      isExpandable: !!(item.subItems && item.subItems.length > 0),
    };
  }

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

  // ✅ MÉTODOS PARA CLASES DE ESTILOS DE SECCIÓN
  protected getSectionTitleClasses(): string {
    const isDark = this.isDarkMode();
    return `px-3 py-2 text-xs font-semibold uppercase tracking-wider ${
      isDark ? 'text-gray-400' : 'text-gray-500'
    }`;
  }

  protected getSectionSeparatorClasses(): string {
    const isDark = this.isDarkMode();
    return `my-2 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`;
  }

  // ✅ MÉTODO PARA DEBUG DE ROLES
  protected debugMenuState(): void {
    const items = this.navItems();
    const user = this.userInfo();
    const isAuth = this.isAuthenticated();
    const shouldGroup = this.groupItemsBySection();

    console.group('🐛 DevarpSideMenu Debug');
    console.log('Original items:', items);
    console.log('User info:', user);
    console.log('Is authenticated:', isAuth);
    console.log('Group by section:', shouldGroup);
    console.log('Visible items:', this.visibleMenuItems());
    console.log('Grouped items:', this.groupedNavItems());
    console.groupEnd();
  }
}
