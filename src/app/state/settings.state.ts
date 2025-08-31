import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { SetUnits } from './settings.actions';

export interface SettingsVM {
  units: 'metric' | 'imperial';
}

@State<SettingsVM>({
  name: 'settings',
  defaults: { units: 'metric' },
})
@Injectable()
export class SettingsState {
  @Selector() static units(s: SettingsVM) { return s.units; }
  @Selector() static isMetric(s: SettingsVM) { return s.units === 'metric'; }

  @Action(SetUnits)
  setUnits(ctx: StateContext<SettingsVM>, { units }: SetUnits) {
    ctx.patchState({ units });
  }
}
