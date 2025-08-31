import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { AddFavorite, RemoveFavorite } from './favorites.actions';

export interface FavoriteCity {
  name: string;
  lat: number;
  lon: number;
}

export interface FavoritesVM {
  list: FavoriteCity[];
}

@State<FavoritesVM>({
  name: 'favorites',
  defaults: {
    list: [],
  },
})
@Injectable()
export class FavoritesState {
  @Selector()
  static list(s: FavoritesVM) {
    return s.list;
  }

  @Selector()
  static has() {
    return (s: FavoritesVM, name: string) =>
      s.list.some(c => c.name.toLowerCase() === name.toLowerCase());
  }

  @Action(AddFavorite)
  add(ctx: StateContext<FavoritesVM>, { city }: AddFavorite) {
    const s = ctx.getState();
    const exists = s.list.some(c => c.name.toLowerCase() === city.name.toLowerCase());

    const next = exists
      ? [ ...s.list.filter(c => c.name.toLowerCase() !== city.name.toLowerCase()) ]
      : [ city, ...s.list ];

    ctx.patchState({ list: next });
  }

  @Action(RemoveFavorite)
  remove(ctx: StateContext<FavoritesVM>, { name }: RemoveFavorite) {
    const s = ctx.getState();
    ctx.patchState({
      list: s.list.filter(c => c.name.toLowerCase() !== name.toLowerCase()),
    });
  }
}
