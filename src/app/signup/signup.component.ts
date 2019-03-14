import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {
  usertypes = [
    {
      value: 'owner',
      types: 'Owner'
    },
    {
      value: 'user',
      types: 'User'
    }
  ];
  constructor(private router: Router, public dataservice: DataService) { }
  

  ngOnInit() {

    this.dataservice.usertypes = this.usertypes;
  }

}
