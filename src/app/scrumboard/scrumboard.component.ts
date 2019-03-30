import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './../data.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DragulaService } from 'ng2-dragula';



@Component({
  selector: 'app-scrumboard',
  templateUrl: './scrumboard.component.html',
  styleUrls: ['./scrumboard.component.css']
})
export class ScrumboardComponent implements OnInit {
  public arrCount = [ 2, 3, 4, 5];

  constructor(private router: Router, private dataservice: DataService, private dragula: DragulaService) {
    this.dataservice.username = sessionStorage.getItem('username');
    this.dataservice.fullname = sessionStorage.getItem('nickname');
    this.dataservice.roles = sessionStorage.getItem('role');
    this.dataservice.message = sessionStorage.getItem('message');
    this.dataservice.password = sessionStorage.getItem('password');

    this.dragula.createGroup('mainTable', {
      revertOnScroll : true,
      direction: 'horizontal',
      invalid : (el) => {
        return el.id == 'user' || el.id == '6' || el.id == 'blank'
      }
    })
  }

  ngOnInit() {
  }
  addGoal()
  {


    this.dataservice.addGoal();
  }
  
  logout()
{
   this.dataservice.logout();
   this.dataservice.message = 'Thank you for using Scrum!';
}

ngOnDestroy(){
  this.dragula.destroy('mainTable');
}

}


