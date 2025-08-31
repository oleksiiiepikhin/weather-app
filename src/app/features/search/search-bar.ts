import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherApiService } from '../../core/services/weather.api.service';
import { Store } from '@ngxs/store';
import { LoadByCoords, SetActiveCity } from '../../state/weather.actions';
import { catchError, debounceTime, distinctUntilChanged, filter, fromEvent, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.scss'],
})
export class SearchBarComponent {
  private api = inject(WeatherApiService);
  private store = inject(Store);

  @ViewChild('input', { static: true }) inputRef!: ElementRef<HTMLInputElement>;

  query = signal('');
  results = signal<any[]>([]);
  open = signal(false);
  activeIndex = signal(-1);

  ngAfterViewInit() {
    fromEvent<InputEvent>(this.inputRef.nativeElement, 'input').pipe(
      debounceTime(200),
      tap(() => this.open.set(true)),
      filter(() => this.query().trim().length >= 2),
      distinctUntilChanged(),
      switchMap(() => this.api.geocodeCity(this.query().trim(), 5).pipe(catchError(() => of([]))))
    ).subscribe(list => {
      this.results.set(list);
      this.activeIndex.set(list.length ? 0 : -1);
    });
  }

  onInput(e: Event) {
    const v = (e.target as HTMLInputElement).value;
    this.query.set(v);
    if (v.trim().length < 2) { this.results.set([]); this.open.set(false); this.activeIndex.set(-1); }
  }

  onKeydown(e: KeyboardEvent) {
    const list = this.results(); if (!this.open() || !list.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); this.activeIndex.set((this.activeIndex()+1)%list.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); this.activeIndex.set((this.activeIndex()-1+list.length)%list.length); }
    else if (e.key === 'Enter') { e.preventDefault(); const item=list[this.activeIndex()]; if (item) this.select(item); }
    else if (e.key === 'Escape') { this.open.set(false); }
  }

  select(item: any) {
    this.store.dispatch(new SetActiveCity(item.name, item.lat, item.lon));
    this.store.dispatch(new LoadByCoords(item.lat, item.lon));
    this.query.set(item.name); this.open.set(false); this.results.set([]);
  }

  blurClose() { setTimeout(() => this.open.set(false), 120); }
}
