import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { FavoritesState } from '@state/favorites.state';
import { RemoveFavorite } from '@state/favorites.actions';
import { LoadByCoords, SetActiveCity } from '@state/weather.actions';

@Component({
  selector: 'app-favorites-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites-bar.html',
  styleUrls: ['./favorites-bar.scss'],
})
export class FavoritesBarComponent {
  private store = inject(Store);

  @Select(FavoritesState.list)
  favorites$!: Observable<Array<{ name: string; lat: number; lon: number }>>;

  load(city: { name: string; lat: number; lon: number }) {
    this.store.dispatch(new SetActiveCity(city.name, city.lat, city.lon));
    this.store.dispatch(new LoadByCoords(city.lat, city.lon));
  }

  remove(name: string, e?: Event) {
    e?.stopPropagation();
    this.store.dispatch(new RemoveFavorite(name));
  }  
}
