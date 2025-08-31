import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { GeolocationService } from '@core/services/geolocation.service';
import { LoadByCityName, LoadByCoords, SetActiveCity } from '@state/weather.actions';

import { SearchBarComponent } from '@features/search/search-bar';
import { WeatherPanelComponent } from '@features/weather/weather-panel';
import { FavoritesBarComponent } from '@features/favorites/favorites-bar';
import { UnitsToggleComponent } from '@features/settings/units-toggle';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    SearchBarComponent,
    WeatherPanelComponent,
    FavoritesBarComponent,
    UnitsToggleComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class AppComponent implements OnInit {
  private store = inject(Store);
  private geo = inject(GeolocationService);

  async ngOnInit() {
    try {
      const pos = await this.geo.getCurrentPosition();
      const { latitude: lat, longitude: lon } = pos.coords;
      this.store.dispatch(new SetActiveCity('My Location', lat, lon));
      this.store.dispatch(new LoadByCoords(lat, lon));
    } catch {
      this.store.dispatch(new LoadByCityName('Berlin'));
    }
  }
}
