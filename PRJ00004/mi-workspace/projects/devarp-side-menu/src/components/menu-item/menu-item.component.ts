import { Component, input, output, computed, inject } from '@angular/core';
import { MenuItem } from '../../shared/interfaces/menu-item.interface';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserInfo } from '../../public-api';

@Component({
  selector: 'app-menu-item',
  imports: [RouterLink, CommonModule],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.css',
})
export class MenuItemComponent {
  private router = inject(Router);

  // ✅ INPUTS
  menuItem = input.required<MenuItem>();
  isExpanded = input<boolean>(false);
  isDarkMode = input<boolean>(true);
  userInfo = input<UserInfo | null>(null);

  // ✅ OUTPUTS
  onToggleExpansion = output<string>();

  // ✅ COMPUTED PROPERTIES
  protected readonly hasSubItems = computed(() => {
    const item = this.menuItem();
    return !!(item.subItems && item.subItems.length > 0);
  });

  protected readonly isExpandable = computed(() => {
    return this.menuItem().isExpandable || this.hasSubItems();
  });

  protected readonly itemLevel = computed(() => {
    return this.menuItem().level || 0;
  });

  // ✅ NUEVA COMPUTED PROPERTY PARA VERIFICAR ROLES
  protected readonly hasRequiredRoles = computed(() => {
    const item = this.menuItem();
    const user = this.userInfo();

    // Si no hay roles definidos en el item, es accesible para todos
    if (!item.allowedRoles || item.allowedRoles.length === 0) {
      return true;
    }

    // Si no hay usuario, no tiene acceso
    if (!user || !user.roles) {
      return false;
    }

    // Verificar si el usuario tiene al menos uno de los roles permitidos
    return item.allowedRoles.some(role => user.roles.includes(role));
  });

  // ✅ COMPUTED PROPERTY PARA VERIFICAR SI EL ITEM DEBE SER VISIBLE
  protected readonly isVisible = computed(() => {
    return this.isValidMenuItem() && this.hasRequiredRoles();
  });

  protected readonly itemClasses = computed(() => {
    const level = this.itemLevel();
    const isDark = this.isDarkMode();
    const hasRoles = this.hasRequiredRoles();

    let baseClasses = 'flex items-center w-full text-sm font-medium rounded-lg transition-all duration-200 group relative';

    // Padding por nivel
    let padding = 'px-3 py-2';
    if (level === 1) padding = 'px-3 py-2 pl-8';
    if (level === 2) padding = 'px-3 py-2 pl-12';

    // Colores por tema y accesibilidad
    let colors = '';
    if (!hasRoles) {
      // Estilo deshabilitado si no tiene permisos
      colors = isDark
        ? 'text-gray-500 cursor-not-allowed opacity-50'
        : 'text-gray-400 cursor-not-allowed opacity-50';
    } else {
      colors = isDark
        ? 'text-white hover:text-white hover:bg-white hover:bg-opacity-10'
        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100';
    }

    return `${baseClasses} ${padding} ${colors}`;
  });


  // ✅ MÉTODO PARA VALIDAR MENU ITEM
  protected isValidMenuItem(): boolean {
    const item = this.menuItem();
    return !!(item && item.id && item.label);
  }

  // ✅ MÉTODO PARA OBTENER INDICADORES DE NIVEL
  protected getLevelIndicators(): number[] {
    const level = this.itemLevel();
    return Array.from({ length: level }, (_, i) => i);
  }

  // ✅ MÉTODOS PARA CLASES DE LÍNEAS DE JERARQUÍA
  protected getLineClasses(): string {
    return this.isDarkMode() ? 'hierarchy-line-dark' : 'hierarchy-line-light';
  }

  protected getLineContinuousClasses(): string {
    return this.isDarkMode() ? 'hierarchy-line-continuous-dark' : 'hierarchy-line-continuous-light';
  }

  protected getDotClasses(): string {
    return this.isDarkMode() ? 'hierarchy-dot-dark' : 'hierarchy-dot-light';
  }

  // ✅ MÉTODOS DE MANEJO DE EVENTOS
  protected handleClick(): void {
    const item = this.menuItem();

    // Verificar permisos antes de ejecutar acción
    if (!this.hasRequiredRoles()) {
      console.warn(`Access denied: User doesn't have required roles for ${item.label}`);
      return;
    }

    if (this.isExpandable()) {
      this.onToggleExpansion.emit(item.id);
    } else if (item.route) {
      this.router.navigate([item.route]);
    } else if (item.href) {
      window.open(item.href, '_blank');
    }
  }

  protected handleToggleExpansion(event: Event): void {
    event.stopPropagation();

    // Verificar permisos antes de expandir
    if (!this.hasRequiredRoles()) {
      return;
    }

    this.onToggleExpansion.emit(this.menuItem().id);
  }

  // ✅ MÉTODO AUXILIAR PARA DEBUG DE ROLES
  protected debugRoles(): void {
    const item = this.menuItem();
    const user = this.userInfo();
    console.debug('MenuItem Roles Debug:', {
      itemId: item.id,
      itemLabel: item.label,
      allowedRoles: item.allowedRoles,
      userRoles: user?.roles,
      hasAccess: this.hasRequiredRoles()
    });
  }
}
