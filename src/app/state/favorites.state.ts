import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { AddFavorite, RemoveFavorite } from './favorites.actions';

export interface FavoriteCity { name: string; lat: number; lon: number; }
export interface FavoritesVM { list: FavoriteCity[]; }

@State<FavoritesVM>({
  name: 'favorites',
  defaults: { list: [] },
})
@Injectable()
export class FavoritesState {
  @Selector() static list(s: FavoritesVM) { return s.list; }

  @Action(AddFavorite)
  add(ctx: StateContext<FavoritesVM>, { city }: AddFavorite) {
    const s = ctx.getState();
    const lower = (x: string) => x.toLowerCase();
    const existing = s.list.find(c => lower(c.name) === lower(city.name));
    const without = s.list.filter(c => lower(c.name) !== lower(city.name));
    const next = existing ? [existing, ...without] : [city, ...without];
    ctx.patchState({ list: next });
  }

  @Action(RemoveFavorite)
  remove(ctx: StateContext<FavoritesVM>, { name }: RemoveFavorite) {
    const s = ctx.getState();
    const lower = (x: string) => x.toLowerCase();
    ctx.patchState({ list: s.list.filter(c => lower(c.name) !== lower(name)) });
  }
}
