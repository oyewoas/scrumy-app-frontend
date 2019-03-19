import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './../data.service';


@Component({
  selector: 'app-scrumboard',
  templateUrl: './scrumboard.component.html',
  styleUrls: ['./scrumboard.component.css']
})
export class ScrumboardComponent implements OnInit {
  public websocket;

  constructor(private router: Router,private dataservice: DataService) { 
   
    this.dataservice.username = sessionStorage.getItem('username');
    this.dataservice.usertype = sessionStorage.getItem('usertype');
   
  }

  ngOnInit() {
  }
   
  logout()
{
   this.dataservice.message = 'Thank you for using Scrum!';
   this.websocket.close();
   this.dataservice.logout();
}

}


