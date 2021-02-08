import { PageData } from './../models/pagedata';
import { SearchUsers } from './../models/searchUsers';
import { UsersService } from './../services/users.service';
import { select, Store } from '@ngrx/store';
import { AfterViewInit, ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { user } from '../models/user';
import { loadSearchUserss } from '../actions/search-users.actions';
import * as searchUser from '../selectors/search-user.selectors';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { map } from 'rxjs/operators';
import { Country } from '../models/country';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserType } from '../models/usertype';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Meta, Title } from '@angular/platform-browser';



@Component({
  selector: 'app-search-users',
  templateUrl: './search-users.component.html',
  styleUrls: ['./search-users.component.css']
})
export class SearchUsersComponent implements OnInit, OnDestroy {

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private store: Store, private usersService: UsersService, private route: ActivatedRoute
    , private fb: FormBuilder, public dialog: MatDialog, private router: Router, private _snackBar: MatSnackBar
    , private titleService: Title, private metaTagService: Meta) { }

  //search Form example 
  searchForm: FormGroup = this.fb.group({
    usertype: ['', Validators.required],
    emailid: ['', [Validators.required, Validators.email]],
    country: ['', [Validators.required]],
    projectStartDate: ['', [Validators.required]],
    tabIndex: ['']
  });

  countries: Country[] = [];
  users: user[] = [];
  today = new Date();

  displayedColumns: string[] = ['Sr.no.', 'User Type', 'Email ID', 'Company Type', 'Company Name', 'Mobile No.', 'Action'];

  dataSource = new MatTableDataSource<user>();

  pageEvent: PageEvent = new PageEvent;

  ks: number = 10;
  pageSize = 5;
  pageIndex: string = '0';
  pageSizeOptions: number[] = [5, 10, 25, 100];
  user: user[] = [];
  userTypes: UserType[] = [];

  //subscription for handle unsubscribe
  subscription: Subscription = new Subscription;

  isSuccess: any = 0;

  reason: string = '';

  isGoBack: any;

  pagIndexForPaginator: number = 0;

  ngOnInit(): void {

    this.titleService.setTitle("Search Users");
    this.metaTagService.updateTag({ name: "Search Users", content: "Search Users Details" });

    this.countries = this.route.snapshot.data['counties'];
    this.userTypes = this.route.snapshot.data['userTypes'];
    this.isSuccess = this.route.snapshot.paramMap.get('id');
    this.isGoBack = parseInt(this.route.snapshot.paramMap.get('goBack')!);

    this.pageIndex = localStorage.getItem('search-user-page-index')!;
    localStorage.setItem('search-user-page-index', this.pageIndex);

    if (this.isSuccess && this.isSuccess != 0) {
      this.openSnackBar(this.isSuccess);
    }

    if (!this.pageIndex) this.pageIndex = '0';

    this.pagIndexForPaginator = (this.pageIndex) ? parseInt(this.pageIndex) : 0;

    if (this.isGoBack == 0) this.isSuccess = 0;

    //based on page index on cookie get the data
    if (this.pagIndexForPaginator == 0 || !this.pagIndexForPaginator) {
      var subscription1 = this.usersService.searchUserDetails(this.searchForm.value).subscribe(users => {
        this.dataSource.data = users;
        this.ks = users[0]._length;
      });
      this.subscription.add(subscription1);
    } else {
      let pageData: PageData = {
        _pageIndex: parseInt(this.pageIndex),
        _pageSize: this.pageSize,
      }
      var subscription3 = this.usersService.getPageWiseData(pageData).subscribe(
        response => {
          this.dataSource.data = response;
          this.pageSize = response[0]._pageSize;
          this.pageIndex = response[0]._pageIndex;
          this.ks = response[0]._length;
        });
      this.subscription.add(subscription3);
    }
  }

  name: string = '';

  openDialog() {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: { name: this.name }
    });

    var subscription7 = dialogRef.afterClosed().subscribe();
    
    this.subscription.add(subscription7);
  }

  onSubmit() {
    var subscription2 = this.usersService.searchUserDetails(this.searchForm.value).subscribe(users => {
      this.dataSource.data = users;
      this.ks = users[0]._length;
    });

    this.subscription.add(subscription2);
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

    }

    localStorage.setItem('search-user-page-index', event.pageIndex.toString());

    if (event.pageIndex != 0) {
      var subscription8 = this.usersService.getPageWiseData(pageData).subscribe(
        response => {
          this.dataSource.data = response;
          this.pageSize = response[0]._pageSize;
          this.pageIndex = response[0]._pageIndex;
          this.ks = response[0]._length;
        });
      this.subscription.add(subscription8);
    }
    else {
      var subscription4 = this.usersService.searchUserDetails("").subscribe(
        response => {
          this.dataSource.data = response;
          this.pageSize = response[0]._pageSize;
          this.pageIndex = response[0]._pageIndex;
          this.ks = response[0]._length;
        });
      this.subscription.add(subscription4);
    }
    return event;
  }


  onLinkClick(event: MatTabChangeEvent) {
    this.searchForm.patchValue({ tabIndex: event.index });
    //this.router.navigate(['contacts']); 
    var subscription5 = this.usersService.searchUserDetails(this.searchForm.value).subscribe(users => {
      this.dataSource.data = users;
      this.ks = users[0]._length;
    });
    this.subscription.add(subscription5);
  }

  openSnackBar(flag: number) {
    this._snackBar.open(flag == 1 ? 'User successfully Created.' : 'User successfully Edited.', 'End now', {
      duration: 2000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  downloadPDF() {
    this.usersService.downloadPDF().subscribe(x => {
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
  }

  downloadExcel() {
    var subscription6 = this.usersService.downloadExcel().subscribe(x => {
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

    this.subscription.add(subscription6);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

export interface DialogData {
  name: string;
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-elements-example-dialog.html',
})
export class DialogOverviewExampleDialog {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private _snackBar: MatSnackBar) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(name: String): void {

    this._snackBar.open('User successfully Deleted.', 'End now', {
      duration: 2000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
    this.dialogRef.close();
  }
}