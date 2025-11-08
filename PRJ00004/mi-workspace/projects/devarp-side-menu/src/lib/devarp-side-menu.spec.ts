import { Component, input, output, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItemComponent } from '../components/menu-item/menu-item.component';
import { MenuItem } from '../shared/interfaces/menu-item.interface';
import { TextColorType } from '../public-api';

@Component({
  selector: 'devarp-side-menu',
  imports: [CommonModule, MenuItemComponent],
  templateUrl: './devarp-side-menu.html',
  styleUrl: './devarp-side-menu.css' // ✅ ACTIVAR EL CSS
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
  showUserInfo = input<boolean>(false);

  // ✅ OUTPUTS
  onThemeChange = output<boolean>();
  onSidebarStateChange = output<boolean>();

  // ✅ SIGNALS DE ESTADO - INICIALIZADOS CORRECTAMENTE
  private readonly isDarkModeSignal = signal<boolean>(true);
  private readonly isMenuOpenSignal = signal<boolean>(false); // ✅ Cerrado por defecto
  private readonly expandedItemsSignal = signal<string[]>([]);

  // ✅ COMPUTED PROPERTIES
  protected readonly isDarkMode = computed(() => this.isDarkModeSignal());
  protected readonly isMenuOpen = computed(() => this.isMenuOpenSignal());
  protected readonly expandedItems = computed(() => this.expandedItemsSignal());

  // ✅ COMPUTED PARA CLASES DEL SIDEBAR
  protected readonly sidebarClasses = computed(() => {
    const isOpen = this.isMenuOpen();
    const themeClass = this.isDarkMode() ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-white to-gray-50';

    return `sidebar-container ${themeClass} ${isOpen ? 'sidebar-visible' : 'sidebar-hidden'}`;
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

  protected readonly themeClasses = computed(() => {
    const isDark = this.isDarkMode();
    return {
      text: isDark ? 'text-white' : 'text-gray-900',
      textMuted: isDark ? 'text-white/60' : 'text-gray-600',
      border: isDark ? 'border-white/10' : 'border-gray-200',
      hover: isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100/50',
      separator: isDark ? 'from-white/20 via-white/10 to-transparent' : 'from-gray-300 via-gray-200 to-transparent',
      toggleBg: isDark ? 'bg-blue-600' : 'bg-gray-200',
      toggleThumb: isDark ? 'translate-x-5 bg-white' : 'translate-x-0 bg-white',
      floatingButton: isDark ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gradient-to-r from-blue-500 to-purple-500',
      floatingButtonBackdrop: isDark ? 'bg-white' : 'bg-black'
    };
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
    console.log('🟢 DevarpSideMenu: Opening menu');
    this.isMenuOpenSignal.set(true);
    this.onSidebarStateChange.emit(true);
  }

  public closeMenu(): void {
    console.log('🔴 DevarpSideMenu: Closing menu');
    this.isMenuOpenSignal.set(false);
    this.onSidebarStateChange.emit(false);
  }

  public toggleMenu(): void {
    const newState = !this.isMenuOpen();
    console.log('🔄 DevarpSideMenu: Toggling menu to:', newState);
    this.isMenuOpenSignal.set(newState);
    this.onSidebarStateChange.emit(newState);
  }

  // ✅ MÉTODO PARA MANEJAR EXPANSIÓN DE ITEMS
  protected handleToggleExpansion(itemId: string): void {
    console.log('🔧 DevarpSideMenu: Toggling expansion for item:', itemId);
    const currentExpanded = this.expandedItemsSignal();

    if (currentExpanded.includes(itemId)) {
      const newExpanded = currentExpanded.filter(id => !this.isChildOf(itemId, id) && id !== itemId);
      this.expandedItemsSignal.set(newExpanded);
      console.log('📤 Collapsed item and children:', itemId, 'New expanded:', newExpanded);
    } else {
      const newExpanded = [...currentExpanded, itemId];
      this.expandedItemsSignal.set(newExpanded);
      console.log('📥 Expanded item:', itemId, 'New expanded:', newExpanded);
    }
  }

  private isChildOf(parentId: string, childId: string): boolean {
    const findInItems = (items: MenuItem[], targetParentId: string, targetChildId: string): boolean => {
      for (const item of items) {
        if (item.id === targetParentId && item.subItems) {
          if (item.subItems.some(child => child.id === targetChildId)) {
            return true;
          }
          for (const child of item.subItems) {
            if (child.subItems && findInItems([child], child.id, targetChildId)) {
              return true;
            }
          }
        }
      }
      return false;
    };

    return findInItems(this.navItems(), parentId, childId);
  }

  protected createChildItem(item: MenuItem): MenuItem & { level: number; isExpandable?: boolean } {
    return {
      ...item,
      level: 1,
      isExpandable: item.subItems && item.subItems.length > 0
    };
  }

  protected createGrandchildItem(item: MenuItem): MenuItem & { level: number; isExpandable?: boolean } {
    return {
      ...item,
      level: 2,
      isExpandable: item.subItems && item.subItems.length > 0
    };
  }

  protected isAuthenticated(): boolean {
    return this.showUserInfo();
  }

}
