import { Location } from "@angular/common";
import { TestBed } from "@angular/core/testing";
import { routes } from "./app.routes";
import { provideRouter, Router } from "@angular/router";

describe('Route: App', () => {

  let router: Router;
  let location: Location;

  beforeEach(async() => {
    // Configurar el entorno de pruebas con las rutas
    await TestBed.configureTestingModule({
      providers: [ provideRouter(routes) ] // 👈 Proveer las rutas reales
    });

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  // it('should have a default route to HomeComponent', () => {
  //   // Aquí iría la lógica para comprobar la ruta por defecto
  // });

  it('should have a route for "about" to AboutPageComponent ("/about")', async() => {
    // Aquí iría la lógica para comprobar la ruta "about"
    await router.navigate(['about']);
    expect(location.path()).toBe('/about');
  })

  it('should have a route for "pricing" to PricinPageComponent ("/pricing")', async() => {
    // Aquí iría la lógica para comprobar la ruta "about"
    await router.navigate(['pricing']);
    expect(location.path()).toBe('/pricing');
  })

  it('should have a route for "unkown" to AboutPageComponent ("/about")', async() => {
    // Aquí iría la lógica para comprobar la ruta "about"
    await router.navigate(['unkown']);
    expect(location.path()).toBe('/about');
  })

  it('should have a route for "pokemons/page/1" to PokemonsPageComponent ("/pokemons/page/1")', async() => {
    // Aquí iría la lógica para comprobar la ruta "about"
    await router.navigate(['pokemons/page/1']);
    expect(location.path()).toBe('/pokemons/page/1');
  })

  it('should have a route "about" that load AboutPageComponent', async() => {
    // buscamos de routes el objeto {path: 'about', ...}
    const route = routes.find(r => r.path === 'about')!;
    expect(route).toBeDefined(); // la ruta debe estar definida

    // la propiedad loadComponent debe estar definida
    const component = ( await route.loadComponent!() )as any; // cargamos el componente y tratamos como any para que no de error el acceso la propiedad title en el ide
    //console.log(component); // Moduele.default.name
    expect(component).toBeDefined(); // el componente debe estar definido
    expect(component.default.name).toBe('AboutPageComponent2'); // el nombre del componente debe ser AboutPageComponent
  })

  it('should have a route "pokemons/page/:page" that load PokemonsPageComponent', async() => {
    // buscamos de routes el objeto {path: 'about', ...}
    const route = routes.find(r => r.path === 'pokemons/page/:page')!;
    expect(route).toBeDefined(); // la ruta debe estar definida

    // la propiedad loadComponent debe estar definida
    const component =  ( await route.loadComponent!() )as any; // cargamos el componente y tratamos como any para que no de error el acceso la propiedad title en el ide
    //console.log(component); // Moduele.default.name
    expect(component).toBeDefined(); // el componente debe estar definido
    expect(component.default.name).toBe('PokemonsPageComponent2'); // el nombre del componente debe ser AboutPageComponent
  })
});
