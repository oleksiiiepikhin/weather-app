// src/app/app.config.ts
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';

import { WeatherState } from './state/weather.state';
import { SettingsState } from './state/settings.state';
import { FavoritesState } from './state/favorites.state';

import { httpErrorInterceptor } from '@core/interceptors/http-error.interceptor';
import { environment } from '@env';

export const appConfig = {
  providers: [
    provideRouter([]),
    provideHttpClient(withInterceptors([httpErrorInterceptor])),

    importProvidersFrom(
      NgxsModule.forRoot([WeatherState, SettingsState, FavoritesState], {
        developmentMode: !environment.production,
      }),
      NgxsStoragePluginModule.forRoot({
        keys: ['settings', 'favorites']
      }),
      NgxsLoggerPluginModule.forRoot({
        disabled: environment.production,
        collapsed: true,
      }),
    ),
  ],
};
