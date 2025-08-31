export class SetUnits {
    static readonly type = '[Settings] Set Units';
    constructor(public units: 'metric' | 'imperial') {}
}
