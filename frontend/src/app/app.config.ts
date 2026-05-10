import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // Updated import

import { routes } from './app.routes';
import { authInterceptor } from './auth.interceptor'; // Import the file you just created

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // tells Angular: "Every time you send a request, run it through our Auth Interceptor first"
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};
