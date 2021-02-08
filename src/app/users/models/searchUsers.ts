import { LEADING_TRIVIA_CHARS } from '@angular/compiler/src/render3/view/template';
import { user } from './user';
export interface SearchUsers{

    _usertype: Number;
    _emailid:String;
    _password:String;
    _confirmpassword:String;
    _companytype:Number;
    _companyname:String;
    _address:String;
    _country:Number;
    _state:Number;
    _mobileno:Number;
    _length:number;
    _pageSize:number;
    _pageIndex:string;
    

    // public get userS(){
    //     return this.users;
    // }
    // public set userS(userS:user[]){
    //     this.users=userS;
    // }

    // public get length(){
    //     return this._length;
    // }

    // public set length(length:number){
    //     this._length=length
    // }

    // public get pageSize(){
    //     return this._pageSize
    // }

    // public set pageSize(pageSize:number){
    //     this._pageSize=pageSize
    // }

    // public get pageIndex(){
    //     return this._pageIndex
    // }

    // public set pageIndex(pageIndex:number){
    //     this._pageIndex=pageIndex
    // }

    // constructor(){}

}