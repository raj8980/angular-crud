import { PastExp } from './pastexp';
export interface Users{
    usertype:number;
    emailid:String;
    password:String;
    confirmpassword:String;
    address:string;
    companytype:number;
    companyname:String;
    country:number;
    state:number;
    mobileno:String;
    pastExp:PastExp[];
}