import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env';

@Injectable({ providedIn: 'root' })
export class WeatherApiService {
  private http = inject(HttpClient);
  private cfg = environment.openWeather;

  geocodeCity(q: string, limit = 5) {
    const params = new HttpParams().set('q', q).set('limit', limit).set('appid', this.cfg.apiKey);
    return this.http.get<any[]>(`${this.cfg.geoBase}/direct`, { params });
  }

  current(lat: number, lon: number, units: 'metric'|'imperial'='metric') {
    const params = new HttpParams().set('lat', lat).set('lon', lon).set('units', units).set('appid', this.cfg.apiKey);
    return this.http.get<any>(this.cfg.currentBase, { params });
  }

  forecast(lat: number, lon: number, units: 'metric'|'imperial'='metric') {
    const params = new HttpParams().set('lat', lat).set('lon', lon).set('units', units).set('appid', this.cfg.apiKey);
    return this.http.get<any>(this.cfg.forecastBase, { params });
  }
}
