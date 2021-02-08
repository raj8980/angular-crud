import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {

  constructor(private titleService:Title,private metaTagService:Meta) { }

  ngOnInit(): void {
    this.titleService.setTitle("About Us");
    this.metaTagService.updateTag({name:"About Us", content:"About Us Details"});
  }

}
