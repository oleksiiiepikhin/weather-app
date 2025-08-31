export class AddFavorite {
    static readonly type = '[Favorites] Add';
    constructor(public city: { name: string; lat: number; lon: number }) {}
}
  
export class RemoveFavorite {
    static readonly type = '[Favorites] Remove';
    constructor(public name: string) {}
}
