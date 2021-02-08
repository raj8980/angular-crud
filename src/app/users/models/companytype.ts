export class CompanyType{
    private _companyTypeID:number=0;
    private _companyType:String='';

    constructor(){}

    public get companyTypeID(){
        return this._companyTypeID;
    }

    public set companyTypeId(companyTypeId:number){
        this._companyTypeID=companyTypeId
    }

    public get companyType(){
        return this._companyType;
    }

    public set companyType(companyType:String){
        this._companyType=companyType;
    }

}