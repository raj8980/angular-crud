import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

import { CompanyType } from '../models/companytype';
import { Country } from '../models/country';
import { State } from '../models/state';
import { Users } from '../models/users';
import { UserType } from '../models/usertype';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.css']
})
export class ViewUsersComponent implements OnInit {

  constructor(private route: ActivatedRoute,private titleService:Title,private metaTagService:Meta) { }

  countries: Country[] = [];
  userTypes: UserType[] = [];
  companyTypes: CompanyType[] = [];
  states: State[] = [];
  userDetail: Users = {
    usertype: 0,
    emailid: '',
    password: '',
    confirmpassword: '',
    address: '',
    companytype: 0,
    companyname: '',
    country: 0,
    state: 0,
    mobileno: '',
    pastExp: []
  };

  
  pageIndex:String='0';
  
  ngOnInit(): void {
    this.titleService.setTitle("View User");
    this.metaTagService.updateTag({name:"View User", content:"View User Details"});
    this.countries = this.route.snapshot.data['counties'];
    this.userTypes = this.route.snapshot.data['userTypes'];
    this.companyTypes = this.route.snapshot.data['companyTypes'];
    this.userDetail = this.route.snapshot.data['userDtl'];
    this.states=this.route.snapshot.data['states'];
    this.pageIndex=this.route.snapshot.paramMap.get('pageIndex')!;
  }
}
