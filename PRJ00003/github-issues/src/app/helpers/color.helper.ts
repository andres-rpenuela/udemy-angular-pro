// Devuelve 'black' o 'white' según el color de fondo recibido en hexadecimal,
// para asegurar contraste y legibilidad del texto sobre ese fondo.
// Usa el algoritmo YIQ para determinar si el color es claro u oscuro.
//
// Utiliza obtener el color de texto
//
// Ejemplo de uso:
//   const colorTexto = convertBlackOrWhiteFromCodeHex('#fefefe'); // => 'black'
//   const colorTexto = convertBlackOrWhiteFromCodeHex('#222222'); // => 'white'
export const convertBlackOrWhiteFromCodeHex = (codeHexadecimal: string): string => {
  if (!codeHexadecimal) return 'black';

  // Asegurar formato: quitar '#' si existe
  const c = codeHexadecimal.startsWith('#') ? codeHexadecimal.substring(1) : codeHexadecimal;

  // Convertir a valores RGB
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);

  // Calcular luminancia relativa (algoritmo YIQ aproximado)
  // YIQ = (R*299 + G*587 + B*114) / 1000
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  // Si es claro, usar negro, si es oscuro, usar blanco
  return yiq >= 128 ? 'black' : 'white';
}

// Helper para detectar modo oscuro desde el html o body
const isDarkMode = (): boolean => {
  console.log('Detectando modo oscuro...: '+document.documentElement.classList.contains('dark'));
  // Verificar primero en html, luego en body como fallback
  return document.documentElement.classList.contains('dark');
  /* ||  document.body.classList.contains('dark'); */
};
