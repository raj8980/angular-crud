export class State{
    private _stateId:number=0;
    private _stateName:string='';

    public get stateId(){
        return this._stateId
    }

    public set stateId(stateId:number){
        this._stateId=stateId;
    }

    public get stateName(){
        return this._stateName;
    }

    public set stateName(state:string){
        this._stateName=state;
    }

    constructor(){}

}