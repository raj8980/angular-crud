import { AuthService } from 'src/app/services/auth.service';
import { success } from './../models/success';
import { SearchUsers } from './../models/searchUsers';
import { PageData } from './../models/pagedata';
import { UsersService } from './../services/users.service';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { user } from '../models/user';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { Country } from '../models/country';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserType } from '../models/usertype';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Subject, Subscription } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Meta, Title } from '@angular/platform-browser';
import { CompanyType } from '../models/companytype';
import { CookieService } from 'ngx-cookie-service';



@Component({
  selector: 'app-search-users',
  templateUrl: './ng-table.component.html',
  styleUrls: ['./search-users.component.css']
})

export class SearchUsersComponent implements OnInit, OnDestroy {

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  //search Form example 
  searchForm: FormGroup = this.fb.group({
    usertype: ['', Validators.required],
    emailid: ['', [Validators.required, Validators.email]],
    country: ['', [Validators.required]],
    projectStartDate: ['', [Validators.required]],
    tabIndex: ['']
  });

  tabIndex: string = "0";

  countries: Country[] = [];
  userTypes: UserType[] = [];
  companyTypes: CompanyType[] = [];
  users: user[] = [];
  today = new Date();

  displayedColumns: string[] = ['Sr.no.', 'User Type', 'Email ID', 'Company Type', 'Company Name', 'Mobile No.', 'Action'];

  dataSource = new MatTableDataSource<user>();

  pageEvent: PageEvent = new PageEvent;

  pageLength: number = 0;
  pageSize = 5;
  pageIndex: string = '0';
  pageSizeOptions: number[] = [5, 10, 25, 100];
  
  
  //subscription for handle unsubscribe
  subscription: Subscription = new Subscription;

  isSuccess: any = 0;

  reason: string = '';

  isGoBack: any;

  pagIndexForPaginator: number = 0;

  name: string = '';

  authRole:String='0';

  constructor(private usersService: UsersService, private route: ActivatedRoute, private fb: FormBuilder,
    public dialog: MatDialog, private router: Router, private _snackBar: MatSnackBar
    , private titleService: Title, private metaTagService: Meta,private cookieService:CookieService) {
   
    this.authRole=this.cookieService.get("authRole");
    
    var pageRefreshSubscription = router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {

        //if page is refreshed then remove the details of already exist pageIndex and tab index
        if (event.id === 1 && event.url === event.urlAfterRedirects) {

          localStorage.removeItem('search-user-page-index');
          localStorage.removeItem('search-user-page-tab-index');
        }
      }
    });

    this.subscription.add(pageRefreshSubscription);
  }


  dtOptions:DataTables.Settings={};
  searchUsers:SearchUsers[]=[];

  dtTrigger:Subject<any>=new Subject<any>();

  ngOnInit(): void {

    this.dtOptions={
      pagingType:'full_numbers',
      pageLength:10,
      serverSide:true,
      processing:true,
      searching:false,
      ordering:false,
      ajax:(dataTablesParams:any,callback)=>{
        let pageData: PageData = {
          _pageIndex: dataTablesParams,
          _pageSize: this.pageSize,
          _tabIndex: this.tabIndex
        }
  
        this.usersService.searchUserDetails(this.searchForm.value).subscribe(users => {
          
            
            this.searchUsers=users;
            this.pageSize=users[0]._length;

           callback({
             recordsTotal: users[0]._length,
             recordsFiltered:users[0]._length ,
              data:[]}); 
          
        });
      }
      
      
    };

    this.titleService.setTitle("Search Users");
    this.metaTagService.updateTag({ name: "Search Users", content: "Search Users Details" });

    this.countries = this.route.snapshot.data['counties'];
    this.userTypes = this.route.snapshot.data['userTypes'];
    this.companyTypes = this.route.snapshot.data['companyTypes'];
    this.isSuccess = this.route.snapshot.paramMap.get('id');
    this.isGoBack = parseInt(this.route.snapshot.paramMap.get('goBack')!);

    this.pageIndex = localStorage.getItem('search-user-page-index')!;
    localStorage.setItem('search-user-page-index', this.pageIndex);

    this.tabIndex = localStorage.getItem('search-user-page-tab-index')!;
    localStorage.setItem('search-user-page-tab-index', this.tabIndex);


    if (this.isSuccess && this.isSuccess != 0) {
      this.openSnackBar(this.isSuccess);
    }

    if (!this.pageIndex) this.pageIndex = '0';

    if (!this.tabIndex) this.tabIndex = '0';

    this.pagIndexForPaginator = (this.pageIndex) ? parseInt(this.pageIndex) : 0;

    if (this.isGoBack == 0) this.isSuccess = 0;

    //based on page index on cookie get the data
    if (this.pagIndexForPaginator == 0 || !this.pagIndexForPaginator) {

      var pageLoadSearchUserSub = this.usersService.searchUserDetails(this.searchForm.value).subscribe(users => {
        if(users[0]._length!=0){
          this.searchUsers=users;
          this.dtTrigger.next();
          this.dataSource.data = users;
          this.pageLength = users[0]._length;
        }else{
          this.pageLength = users[0]._length;
          this.dataSource.data = [];
        }
      });

      this.subscription.add(pageLoadSearchUserSub);

    } else {

      let pageData: PageData = {
        _pageIndex: parseInt(this.pageIndex),
        _pageSize: this.pageSize,
        _tabIndex: this.tabIndex
      }

      var goBackSearchUserSub = this.usersService.getPageWiseData(pageData).subscribe(
        response => {
          if(response[0]._length!=0){
            this.dataSource.data = response;
            this.pageSize = response[0]._pageSize;
            this.pageIndex = response[0]._pageIndex;
            this.pageLength = response[0]._length;
          }else{
            this.dataSource.data = [];
            this.pageLength = response[0]._length;
          }
          
        });
      this.subscription.add(goBackSearchUserSub);

    }
  }

  getEncToken(userID:number){
    console.log("here:"+userID);
    return encodeURI("/users/edit-user/"+userID);
  }
  openDialog(userid:number,isActive:number) {
    const dialogRef = this.dialog.open(DeleteDialog, {
      width: '250px',
      data: { userid: userid,isActive:isActive }
    });

    var dialogClosedSubscription = dialogRef.afterClosed().subscribe();

    this.subscription.add(dialogClosedSubscription);
  }

  onSubmit() {
    var findUsersSubscription = this.usersService.searchUserDetails(this.searchForm.value).subscribe(users => {
      if(users[0]._length!=0){
        this.dataSource.data = users;
        this.pageLength = users[0]._length;
      }else{
        this.dataSource.data = [];
        this.pageLength = users[0]._length;
      }
    });

    this.subscription.add(findUsersSubscription);
  }

  get searchFormControl() { return this.searchForm.controls; }

  onView(id: number) {
    this.router.navigate(['/users/view-user', id]);
  }

  //based on next click get the datas.
  getNextData(event: PageEvent) {
    let pageData: PageData = {
      _pageIndex: event.pageIndex,
      _pageSize: event.pageSize,
      _tabIndex: this.tabIndex
    }
    
    localStorage.setItem('search-user-page-index', event.pageIndex.toString());

    if (event.pageIndex != 0) {

      var pageWiseSubscription = this.usersService.getPageWiseData(pageData).subscribe(
        response => {
          if(response[0]._length!=0){
            this.dataSource.data = response;
            this.pageSize = response[0]._pageSize;
            this.pageIndex = response[0]._pageIndex;
            this.pageLength = response[0]._length;
          }else{
            this.dataSource.data = [];
            this.pageLength = response[0]._length;
          }
       
        });
      this.subscription.add(pageWiseSubscription);

    } else {

      var pageWiseSubscription = this.usersService.getPageWiseData(pageData).subscribe(
        response => {
          if(response[0]._length!=0){
            this.dataSource.data = response;
            this.pageSize = response[0]._pageSize;
            this.pageIndex = response[0]._pageIndex;
            this.pageLength = response[0]._length;
          }else{
            this.dataSource.data = [];
            this.pageLength = response[0]._length;
          }
        });
      this.subscription.add(pageWiseSubscription);

    }

    return event;

  }


  onTabChange(event: MatTabChangeEvent) {

    this.searchForm.patchValue({ tabIndex: event.index });
    localStorage.setItem('search-user-page-tab-index', event.index.toString());

    //this.router.navigate(['contacts']); 
    var tabChangeUsersSubscription = this.usersService.searchUserDetails(this.searchForm.value).subscribe(users => {
      if(users[0]._length!=0){
        this.dataSource.data = users;
        this.pageLength = users[0]._length;
      }else{
        this.pageLength = users[0]._length;
        this.dataSource.data = [];
      }
    });
    this.subscription.add(tabChangeUsersSubscription);

  }

  openSnackBar(flag: number) {

    this._snackBar.open(flag == 1 ? 'User successfully Created.' : 'User successfully Edited.', 'End now', {
      duration: 2000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });

  }

  downloadPDF() {

    var downloadPDFSub = this.usersService.downloadPDF().subscribe(x => {
      const blob = new Blob([x], { type: 'application/pdf' });


      if (window.navigator && window.navigator.msSaveBlob) {
        window.navigator.msSaveOrOpenBlob(blob);
        return;
      }

      const data = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = data;
      link.download = "Users.pdf";
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

      setTimeout(function () {
        window.URL.revokeObjectURL(data);
        link.remove();
      }, 100);
    });
    this.subscription.add(downloadPDFSub);
  }

  downloadExcel() {

    var downloadExcelSub = this.usersService.downloadExcel().subscribe(x => {
      const blob = new Blob([x], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

      if (window.navigator && window.navigator.msSaveBlob) {
        window.navigator.msSaveOrOpenBlob(blob);
        return;
      }

      const data = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = data;
      link.download = "Users.xlsx";
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

      setTimeout(function () {
        window.URL.revokeObjectURL(data);
        link.remove();
      }, 100);

    });

    this.subscription.add(downloadExcelSub);

  }

  getPageNo(){
    return Number(this.pageIndex) * Number(this.pageSize);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.dtTrigger.unsubscribe();
  }
}

export interface DialogData {
  userid: number;
  isActive:number;
}

@Component({
  selector: 'delete-dialog',
  templateUrl: 'delete-dialog.html',
})
export class DeleteDialog {

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    public dialogRef: MatDialogRef<DeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private _snackBar: MatSnackBar,
    private userService:UsersService, private router: Router) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(userId: number): void {
    
    if(this.data.isActive==0){
      this.userService.activateUser(userId).subscribe(
    
        result=>{
          
          if(result.status==200){
            this._snackBar.open('User successfully Activated.', 'End now', {
              duration: 2000,
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
           
          }else{
            this._snackBar.open('User Failed to Activate', 'End now', {
              duration: 2000,
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
           
          }
        }
      );
    }else{
      this.userService.deactivateUser(userId).subscribe(
    
        result=>{
          
          if(result.status==200){
            this._snackBar.open('User successfully Deactivate.', 'End now', {
              duration: 2000,
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
           
          }else{
            this._snackBar.open('User Failed to Deactivate', 'End now', {
              duration: 2000,
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
           
          }
        }
      );
    }
    
    
    this.dialogRef.close();
  
  }

 
}