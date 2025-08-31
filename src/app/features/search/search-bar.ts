import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { WeatherApiService } from '@core/services/weather.api.service';
import { Store } from '@ngxs/store';
import { LoadByCoords, SetActiveCity } from '@state/weather.actions';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.scss'],
})
export class SearchBarComponent {
  private api = inject(WeatherApiService);
  private store = inject(Store);

  q = new FormControl('', { nonNullable: true });
  suggestions: Array<{ name: string; lat: number; lon: number; state?: string; country?: string }> = [];
  open = false;
  activeIndex = -1;
  get activeId() { return this.activeIndex >= 0 ? `opt-${this.activeIndex}` : null; }

  constructor() {
    this.q.valueChanges.pipe(
      debounceTime(250),
      map(v => v.trim()),
      distinctUntilChanged(),
      filter(v => v.length >= 2),
      switchMap(v => this.api.geocodeCity(v, 5))
    ).subscribe(list => {
      this.suggestions = list ?? [];
      this.open = this.suggestions.length > 0;
      this.activeIndex = this.open ? 0 : -1;
    });
  }

  hover(i: number) { this.activeIndex = i; }

  onKeyDown(e: KeyboardEvent) {
    if (!this.open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      this.open = this.suggestions.length > 0;
      if (this.open) this.activeIndex = 0;
      return;
    }
    if (!this.open) return;

    if (e.key === 'ArrowDown') {
      this.activeIndex = (this.activeIndex + 1) % this.suggestions.length;
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      this.activeIndex = (this.activeIndex - 1 + this.suggestions.length) % this.suggestions.length;
      e.preventDefault();
    } else if (e.key === 'Enter') {
      const c = this.suggestions[this.activeIndex];
      if (c) this.choose(c);
      e.preventDefault();
    } else if (e.key === 'Escape') {
      this.open = false;
      this.activeIndex = -1;
    }
  }

  choose(c: any) {
    this.open = false;
    const name = [c.name, c.state, c.country].filter(Boolean).join(', ');
    this.store.dispatch(new SetActiveCity(name, c.lat, c.lon));
    this.store.dispatch(new LoadByCoords(c.lat, c.lon));
    this.q.setValue(name, { emitEvent: false });
  }
}
