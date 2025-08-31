import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { WeatherApiService } from '@core/services/weather.api.service';
import { LoadByCityName, LoadByCoords, SetActiveCity } from './weather.actions';
import { SettingsState } from './settings.state';
import { catchError, of, switchMap, tap } from 'rxjs';

export interface WeatherVM {
  loading: boolean;
  error?: string | null;
  city?: { name: string; lat: number; lon: number } | null;
  today?: any | null;
  tomorrow?: any | null;
}

@State<WeatherVM>({
  name: 'weather',
  defaults: {
    loading: false,
    error: null,
    city: null,
    today: null,
    tomorrow: null,
  },
})
@Injectable()
export class WeatherState {
  private api = inject(WeatherApiService);
  private store = inject(Store);

  @Selector([SettingsState])
  static vm(
    s?: WeatherVM,
    settings?: { units: 'metric' | 'imperial' }
  ) {
    const base: WeatherVM = s ?? {
      loading: false,
      error: null,
      city: null,
      today: null,
      tomorrow: null,
    };

    return {
      ...base,
      units: settings?.units ?? 'metric',
    };
  }

  @Action(LoadByCityName)
  loadByCity(ctx: StateContext<WeatherVM>, { city }: LoadByCityName) {
    const q = (city || '').trim();
    if (!q) return;
    ctx.patchState({ loading: true, error: null });

    return this.api.geocodeCity(q, 1).pipe(
      switchMap(res => {
        if (!res?.length) throw new Error('City not found');
        const { name, lat, lon } = res[0];
        ctx.patchState({ city: { name, lat, lon } });
        return ctx.dispatch(new LoadByCoords(lat, lon));
      }),
      catchError(err => {
        ctx.patchState({ loading: false, error: humanize(err) });
        return of();
      })
    );
  }

  @Action(SetActiveCity)
  setActive(ctx: StateContext<WeatherVM>, { name, lat, lon }: SetActiveCity) {
    ctx.patchState({ city: { name, lat, lon } });
  }

  @Action(LoadByCoords)
  loadByCoords(ctx: StateContext<WeatherVM>, { lat, lon }: LoadByCoords) {
    ctx.patchState({ loading: true, error: null });

    const units = this.store.selectSnapshot(SettingsState.units) as 'metric' | 'imperial';

    return this.api.current(lat, lon, units).pipe(
      switchMap(current =>
        this.api.forecast(lat, lon, units).pipe(
          tap(forecast => {
            const today = current;
            const tomorrow = pickTomorrow(forecast);
            const city = ctx.getState().city ?? { name: current?.name, lat, lon };
            ctx.patchState({ loading: false, today, tomorrow, city });
          })
        )
      ),
      catchError(err => {
        ctx.patchState({ loading: false, error: humanize(err) });
        return of();
      })
    );
  }
}

function humanize(err: any) {
  const m = err?.message || '';
  if (/city not found/i.test(m)) return 'City not found. Try another name.';
  if (/invalid|api key/i.test(m)) return 'API key not active yet. Try again soon.';
  return 'Network or API error. Please retry.';
}

function pickTomorrow(forecast: any) {
  const list: any[] = forecast?.list ?? [];
  if (!list.length) return null;

  const now = new Date();
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const afterToday = list.filter(it => new Date(it.dt * 1000) > endOfToday);
  if (!afterToday.length) return null;

  const first = new Date(afterToday[0].dt * 1000);
  const targetNoon = new Date(first.getFullYear(), first.getMonth(), first.getDate(), 12, 0, 0, 0).getTime();

  let best = afterToday[0];
  let bestDiff = Math.abs(new Date(best.dt * 1000).getTime() - targetNoon);
  for (const it of afterToday) {
    const t = new Date(it.dt * 1000).getTime();
    if (new Date(it.dt * 1000).getDate() !== first.getDate()) break; // only the next calendar day
    const diff = Math.abs(t - targetNoon);
    if (diff < bestDiff) { best = it; bestDiff = diff; }
  }
  return best;
}
