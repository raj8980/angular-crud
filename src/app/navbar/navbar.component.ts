import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../components/loader/loader.service';
import { LoginComponent } from '../components/login/login.component';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

 
  constructor(public loaderService:LoaderService,public authService:AuthService) { }

  ngOnInit(): void {
    
  }

}
