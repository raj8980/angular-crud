export class UserType{
    private _userTypeId:number=0;
    private _userType:String='';
    
    constructor(){}

    public get userTypeId(){
        return this._userTypeId;
    }

    public set userTypeId(userTypeId:number){
        this._userTypeId=userTypeId;
    }

    public get userType(){
        return this._userType;
    } 

    public set userType(userType:String){
        this._userType=userType;
    }

}