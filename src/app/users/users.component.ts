import { Country } from './models/country';
import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { loadCreateUsers } from './actions/create-user.actions';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from './services/users.service';
import { maxDate, MustMatch, numberValidator } from './Validators/MustMatch';
import * as fromUser from './selectors/create-user.selectors';
import { ActivatedRoute, Router } from '@angular/router';
import { UserType } from './models/usertype';
import { CompanyType } from './models/companytype';
import { State } from './models/state';
import { Users } from './models/users';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit, OnDestroy {

  //subscription for handle unsubscribe
  subscription: Subscription = new Subscription;

  //id used to edit user details
  id: any;

  //userDetail object of interfce users
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

  // userd for password and confirm password show hide
  hide = true;
  cphide = true;

  // for validate date upto today not show the dates of future
  today = new Date();
  

  // get country,usertypes, state, companytypes details from server
  countries: Country[] = [];
  userTypes: UserType[] = [];
  companyTypes: CompanyType[] = [];
  states: State[] = [];

  // isLinear true for stepper
  isLinear = true;

  isdisabled=false;
  
  public editor = ClassicEditor;
  
  // User form with validation
  profileForm: FormGroup = this.fb.group({
    usertype: ['', Validators.required],
    emailid: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmpassword: ['', [Validators.required, Validators.minLength(6)]],
    companytype: ['', Validators.required],
    companyname: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(1000)]],
    address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(1000)]],
    country: ['', [Validators.required]],
    state: ['', [Validators.required]],
    mobileno: ['', Validators.required],
    
    pastExp: this.fb.array([
      this.fb.group({
        clientName: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
        projectName: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
        projectValue: ['', [Validators.required]],
        projectStartDate: ['', [Validators.required]],
        projectEndDate: ['', [Validators.required]]
      }, {
        validator: [maxDate('projectStartDate', 'projectEndDate'),numberValidator('projectValue')]
      })
    ])
  }, {
    validator:[ MustMatch('password', 'confirmpassword')]
  });


  isRegisterError=false;

  //fileuploadForm
  fileUploadForm: FormGroup = this.fb.group({
    file: ['', Validators.required]
  });

  constructor(private store: Store, private fb: FormBuilder, private userService: UsersService,
              private route: ActivatedRoute, private snackBar: MatSnackBar,private router:Router,public dialog: MatDialog
              ,private titleService:Title,private metaTagService:Meta) { }


  ngOnInit(): void {
    this.titleService.setTitle((this.id)?"Edit User":"Create User");
    this.metaTagService.updateTag({name:(this.id)?"Edit User":"Create User", content:(this.id)?"Create User details":"Edit User Details"});

    this.countries = this.route.snapshot.data['counties'];
    this.userTypes = this.route.snapshot.data['userTypes'];
    this.companyTypes = this.route.snapshot.data['companyTypes'];
    this.id = this.route.snapshot.paramMap.get('id');
    
    // if id is present then set user details for edit user
    
    if (this.id) {
      this.userDetail = this.route.snapshot.data['userDtl'];
      
      this.states=this.route.snapshot.data['states'];
      // add row based on user details past experience 
      let lengthOfArray = this.userDetail.pastExp.length;
      
      if (lengthOfArray > 1) {
        for (var i = 1; i < lengthOfArray; i++) {
          this.addPastExp();
        }
      }
      
      // set value of profile form for edit user
      this.profileForm.patchValue(this.userDetail); 
    }

  }

  // get array details  
  get pastExp() {
    return this.profileForm.get('pastExp') as FormArray;
  }

  // get array validation details
  getPastExpFormGroup(index: number): FormGroup {
    let contactList = this.profileForm.get('pastExp') as FormArray;
    const formGroup = contactList.controls[index] as FormGroup;
    return formGroup;
  }

  // add past experience row
  addPastExp() {
    return this.pastExp.push(this.fb.group({
      clientName: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      projectName: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      projectValue: ['', [Validators.required]],
      projectStartDate: ['', [Validators.required]],
      projectEndDate: ['', [Validators.required]]
    }, {
      validator: [maxDate('projectStartDate', 'projectEndDate'),numberValidator('projectValue')]
    }));
  }

  // delete past experience row by index
  deleteExp(index: number) {
    if (this.pastExp.length > 1) {
      this.pastExp.removeAt(index);
    } else {
      this.snackBar.open("Required at least one record in Past Experience", "X", {
        duration: 2000,
      });
    }
  }

  // get profile from controls
  get profileFormControl() { return this.profileForm.controls; }


  //on user edit or create submit the details
  onSubmit() {

    this.isdisabled=true;

    this.store.dispatch(loadCreateUsers({ form: this.profileForm.value }));
    var subscription1 = this.store.pipe(select(fromUser.getUser, { form: this.profileForm.value })).subscribe();
    
    this.subscription.add(subscription1);
    
    let uploaded=this.uploadFiles();
    
    if(uploaded){
      this.router.navigate(['/users/search-user',this.id?2:1]);
    }else{
      this.isRegisterError=true;
      this.isdisabled=false;
    }
  }

  //loadState based on country changes
  loadState(countryId: any) {
    if (countryId.value) {
      var subscription2 = this.userService.loadState(countryId.value).subscribe(val => this.states = val);
      this.subscription.add(subscription2);
    }
  }


  //for fileupload
  @ViewChild("uploadPanCard", { static: false })
  uploadPanCard!: ElementRef;

  @ViewChild("uploadAadharCard", { static: false })
  uploadAadharCard!: ElementRef;

  @ViewChild("uploadCertificate", { static: false })
  uploadCertificate!: ElementRef;
  
  @ViewChild("uploadDocument", { static: false })
  uploadDocument!: ElementRef;

  files: any[] = [];
  panCardFileName: string = '';
  aadharCardFileName: string = '';
  certificateFileName: string = '';
  documentFileName: string = '';

  onUploadDPanClick(){
    const fileUpload = this.uploadPanCard.nativeElement; fileUpload.onchange = () => {
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        this.panCardFileName = file.name + " is uploaded"

        this.files.push({ data: file, inProgress: false, progress: 0, filetype:1 });
      }

    };
    fileUpload.click();
  }
  onUploadAadharClick(){
    const fileUpload = this.uploadAadharCard.nativeElement; fileUpload.onchange = () => {
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        this.aadharCardFileName = file.name + " is uploaded"

        this.files.push({ data: file, inProgress: false, progress: 0, filetype:2 });
      }
    };
    fileUpload.click();
  }

  onUploadCertClick(){
    const fileUpload = this.uploadCertificate.nativeElement; fileUpload.onchange = () => {
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        this.certificateFileName = file.name + " is uploaded"

        this.files.push({ data: file, inProgress: false, progress: 0 , filetype:3});
      }
    };
    fileUpload.click();
  }

  //file on click
  onUploadDocClick() {
    const fileUpload = this.uploadDocument.nativeElement; fileUpload.onchange = () => {
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        this.documentFileName = file.name + " is uploaded"

        this.files.push({ data: file, inProgress: false, progress: 0 , filetype:4});
      }

    };
    fileUpload.click();
  }

  private uploadFiles() {
    this.uploadDocument.nativeElement.value = '';
    let count=0;
    this.files.forEach(file => {
      let value=this.uploadFile(file);
      
      if(!value){
        count++;
      }
    });
   
    if(count==0) return true;
    return false;
  }
  
  uploadFile(file: any) {
    const formData = new FormData();
    formData.append('file', file.data);
    formData.append('fileType', file.filetype);
    file.inProgress = true;
    var subscription3 = this.userService.upload(formData).subscribe(
      rsp => {
        return true;
      },
      error => {
        return false;
      });
      this.subscription.add(subscription3);
      return true;
  }

  onFileChange(event: { target: { files: string | any[]; }; }) {

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileUploadForm.patchValue({
        fileSource: file
      });
    }
  }


  //check the email id exist or not
  duplicateCheckEmail(){
    const emailid=this.profileForm.get('emailid')?.value;
    
   var subscription4= this.userService.duplicateCheckEmail(emailid).subscribe(success=>{
      if(success.authToken=='true'){
        this.profileForm.controls['emailid'].setErrors({"emailAlreadyExist":true});
      }
    });
    this.subscription.add(subscription4);
  }


  openDialog() {  
    const dialogRef = this.dialog.open(DialogContentExampleDialog
      ,{data:{isEdit:(this.id)?true:false}});

    var subscription5=dialogRef.afterClosed().subscribe(result => {
      if(result==true){
        this.onSubmit();
      }
    });

    this.subscription.add(subscription5);
  }


  ngOnDestroy() {
    if(this.subscription)
      this.subscription.unsubscribe();
  }
}

export interface DialogData {
  isEdit: boolean;
}
@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-content-example-dialog.html',
})
export class DialogContentExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogContentExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }
}
