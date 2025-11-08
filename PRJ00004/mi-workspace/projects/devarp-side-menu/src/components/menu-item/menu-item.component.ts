import { Component, input, output, computed, inject } from '@angular/core';
import { MenuItem } from '../../shared/interfaces/menu-item.interface';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  protected readonly itemClasses = computed(() => {
    const level = this.itemLevel();
    const isDark = this.isDarkMode();

    let baseClasses = 'flex items-center w-full text-sm font-medium rounded-lg transition-all duration-200 group relative';

    // Padding por nivel
    let padding = 'px-3 py-2';
    if (level === 1) padding = 'px-3 py-2 pl-8';
    if (level === 2) padding = 'px-3 py-2 pl-12';

    // Colores por tema
    let colors = isDark
      ? 'text-white hover:text-white hover:bg-white hover:bg-opacity-10'
      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100';

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
    this.onToggleExpansion.emit(this.menuItem().id);
  }
}
