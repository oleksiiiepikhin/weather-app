import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { combineLatest, map, Observable } from 'rxjs';
import { WeatherState } from '@state/weather.state';
import { AddFavorite } from '@state/favorites.actions';
import { LoadByCoords, LoadByCityName } from '@state/weather.actions';
import { SettingsState } from '@state/settings.state';

@Component({
  selector: 'app-weather-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather-panel.html',
  styleUrls: ['./weather-panel.scss'],
})
export class WeatherPanelComponent {
  private store = inject(Store);

  vm$!: Observable<any>;

  ngOnInit() {
    const weather$ = this.store.select((s: any) => s.weather);
    const units$ = this.store.select(SettingsState.units);
    this.vm$ = combineLatest([weather$, units$]).pipe(
      map(([w, units]) => ({ ...w, units }))
    );
  }

  addToFavorites(vm: any) {
    const c = vm?.city;
    if (c?.name && c.lat != null && c.lon != null) {
      this.store.dispatch(new AddFavorite({ name: c.name, lat: c.lat, lon: c.lon }));
    }
  }

  refresh(vm: any) {
    const c = vm?.city;
    if (c?.lat != null && c?.lon != null) this.store.dispatch(new LoadByCoords(c.lat, c.lon));
    else this.store.dispatch(new LoadByCityName('Berlin'));
  }
}
