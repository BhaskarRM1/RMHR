import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { routes } from './app/app.routes';
import 'zone.js'; // ✅ required for Angular change detection
import { provideAnimations } from '@angular/platform-browser/animations'; // 👈 add
import { authInterceptor } from './app/core/auth.interceptor';
import { LoadingInterceptor } from './app/core/loading.interceptor';
import { App } from './app/app';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([authInterceptor])
    ),
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }
  ]
}).catch((err: unknown) => console.error(err));
