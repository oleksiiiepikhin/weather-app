export class LoadByCoords {
    static readonly type = '[Weather] Load By Coords';
    constructor(public lat: number, public lon: number) {}
}

export class LoadByCityName {
    static readonly type = '[Weather] Load By City';
    constructor(public city: string) {}
}

export class SetActiveCity {
    static readonly type = '[Weather] Set Active';
    constructor(public name: string, public lat: number, public lon: number) {}
}
