import { TestBed } from "@angular/core/testing";
import { DevarpSideMenuService } from "./devarp-side-menu.service";
import { provideZonelessChangeDetection } from "@angular/core";

describe('DevarpSideMenuService', () => {
  let service: DevarpSideMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(), // ✅ Zoneless change detection
        DevarpSideMenuService
      ]
    });
    service = TestBed.inject(DevarpSideMenuService);
  });

  it('should be created', () => {
    // ❌ NO usar fixture.detectChanges() en servicios
    // fixture.detectChanges();

    // ✅ Los servicios no necesitan detectChanges
    expect(service).toBeTruthy();
  });
});
