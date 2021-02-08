export class Country {
    private _countryId: Number = 0;
    private _countryName: String = '';
    
    constructor() { }

    public get countryId() {
        return this._countryId;
    }
    public set countryId(countryId){
        this._countryId=countryId;
    }

    
    public get countryName() {
        return this._countryName;
    }
    public set countryName(countryName){
        this._countryName=countryName;
    }
}