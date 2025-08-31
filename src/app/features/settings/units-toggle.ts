import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SettingsState } from '@state/settings.state';
import { SetUnits } from '@state/settings.actions';

@Component({
  selector: 'app-units-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './units-toggle.html',
  styleUrls: ['./units-toggle.scss'],
})
export class UnitsToggleComponent {
  private store = inject(Store);
  units$: Observable<'metric'|'imperial'> = this.store.select(SettingsState.units);

  set(units: 'metric'|'imperial') {
    this.store.dispatch(new SetUnits(units));
  }
}
