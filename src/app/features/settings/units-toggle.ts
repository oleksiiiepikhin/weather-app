import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Select, Store } from '@ngxs/store';
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

  @Select(SettingsState.units)
  units$!: Observable<'metric' | 'imperial'>;

  set(units: 'metric' | 'imperial') {
    this.store.dispatch(new SetUnits(units));
  }
}
