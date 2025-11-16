import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  console.debug('🖥️ [EXPRESS] Request:', req.method, req.url);
  console.debug('🍪 [EXPRESS] Raw cookies:', req.headers.cookie);

  const cookieStoring = req.headers.cookie || ''; // lang=es;otherCookie=otherValue;..

  // ✅ MANTENER CONSISTENCIA CON EL NOMBRE
  const langCookie = cookieStoring
    .split(';')
    .map((c: string) => c.trim())
    .find((c: string) => c.startsWith('lang=')) ?? 'lang=es';

  const [, langValue] = langCookie.split('=');
  console.debug('🌍 [EXPRESS] Lenguaje detectado:', langValue);

  // ✅ VALIDAR IDIOMA
  const supportedLanguages = ['es', 'en', 'fr','it'];
  const validLang = supportedLanguages.includes(langValue) ? langValue : 'it';

  // ✅ AGREGAR AL REQUEST PARA QUE ANGULAR LO PUEDA USAR
  (req as any).detectedLanguage = validLang;



  angularApp
    .handle(req,{
      // ✅ PASAR CONTEXT A ANGULAR
      providers: [
        {
          provide: 'DETECTED_LANGUAGE',
          useValue: validLang
        }
      ]
    })
    .then((response) =>{
      console.log('📥 Request recibido:', req.method, req.url);

      return response ? writeResponseToNodeResponse(response, res) : next();
    })
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
