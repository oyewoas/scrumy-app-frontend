import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders , HttpParams, HttpResponse} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable({
  providedIn: 'root'
})


export class DataService {
    public domainname = '127.0.0.1:8000';
    public message: string;
    public signupusername: string;
    public signuppwd: string;
    public signupconfpwd: string;
    public fullname: string;
    public role: string;
    public loginusername: string;
    public username: string;
    public loginpwd: string;
    public firstname: string;
    public roleid;
    public project_name;
    public login_project;
    public roles;
    public users;
    public project;
    public goal_name;
    public goal_id;
    public to_id;

    // the actual JWT token
    public token: string;
  // the token expiration date
    public tokenexpires: Date;
  // error messages received from the login attempt
    public errors: any = [];

    public httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json' })
    };

    public authOptions;
    public imageAuthOptions;
  constructor(
    private http: HttpClient, private router: Router
  ) { }

  createUser() {
    // tslint:disable-next-line:max-line-length
    this.message = 'Creating Account please wait...';
    this.http.post('http://' + this.domainname + '/ayooluwaoyewoscrumy/api/v1/scrumuser/', JSON.stringify({username: this.signupusername,
    password: this.signuppwd, confirmpassword: this.signupconfpwd,
    fullname: this.fullname, role: this.role, project_name: this.project_name}), this.httpOptions).subscribe(
        data => {
            this.message = data['message'];
            this.signupusername = '';
            this.signuppwd = '';
            this.signupconfpwd = '';
            this.role = '';
            this.project_name = '';
            this.fullname = '';
        },
        err => {
            this.message = 'User Creation Failed! Unexpected Error!';
            console.error(err);
            this.signupusername = '';
            this.signuppwd = '';
            this.signupconfpwd = '';
            this.fullname = '';
            this.role = '';
            this.project_name = '';

        }
        
    );
  }


  toLogin()
  {
    this.http.post('http://' + this.domainname + '/ayooluwaoyewoscrumy/api-token-auth/', JSON.stringify({username: this.loginusername,
    password: this.loginpwd, project_name: this.login_project}), this.httpOptions).subscribe(
        data => {
          if (this.login_project !== data['project_name']){
            this.router.navigate(['login']);
            this.message = 'Incorrect Project Title';
            this.loginusername = '';
            this.login_project = '';
            this.loginpwd = '';


        } else {
            sessionStorage.setItem('username', this.loginusername);
            sessionStorage.setItem('role', data['role']);
            sessionStorage.setItem('token', data['token']);
            sessionStorage.setItem('message', data['message']);
            sessionStorage.setItem('project_name', data['project_name']);
            this.username = this.loginusername;
            this.role = data['role'];
            this.roleid = data['id'];
            this.fullname = data['nickname'];
            this.users = data['users'];
            this.router.navigate(['scrumboard']);
            this.loginusername = '';
            this.loginpwd = '';
            this.login_project = '';
            this.message = data['message'];
            

              console.log(data);}

            this.authOptions = {
              headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'JWT' + data['token'] })
            };
        },
        err => {
            if(err['status'] == 400) 
              this.message = 'Login Failed: Invalid Credentials.';
            else
              this.message = 'Login Failed! Unexpected Error!';
            console.error(err);
            this.loginusername = '';
            this.loginpwd = '';
            this.login_project = '';
        }
    );
  }

addGoal()
{this.http.post('http://' + this.domainname + '/ayooluwaoyewoscrumy/api/v1/scrumgoal/',
  JSON.stringify({
  goal_name: this.goal_name  }), this.authOptions).subscribe(
      data => {
          this.users = data['data'];
          this.message = data['message'];
          this.goal_name = '';
      },

      err => {
        console.error(err);
        this.goal_name = '';
        if (err['status']== 401){
          this.message = 'Session Invalid or Expired, Please Login';
          this.logout()
        } else {
          this.message = 'Unexpected Error!';
        }
      },
    );

  }


moveGoal(goal_id, to_id) {
  this.http.patch('http://' + this.domainname + '/ayooluwaoyewoscrumy/api/v1/scrumgoal/',
  JSON.stringify({ goal_id, to_id }), this.authOptions).subscribe(
      data => {

          this.users = data['data'];
          this.message = data['message']
      },

      err => {
        console.error(err);
        if (err['status']== 401){
          this.message = 'Session Invalid or Expired, Please Login';
          this.logout()
        } else {
          this.message = 'Unexpected Error!';
        }

      },
    );
}

changeOwner(from_id, to_id){
  this.http.put('http://' + this.domainname + '/ayooluwaoyewoscrumy/api/v1/scrumgoal/',
  JSON.stringify({mode: 0, from_id, to_id }), this.authOptions).subscribe(
      data => {
          this.users = data['data'];
          this.message = data['message'];

      },

      err => {

        console.error(err);
        if (err['status'] == 401){
          this.message = 'Session Invalid or Expired, Please Login';
          this.logout()
        } else {
          this.message = 'Unexpected Error!';
        }


      },
    );
}
  logout()
  {
    this.username = '';
    this.roles = '';
    this.users = [];
    this.fullname = '';
    this.router.navigate(['login']);
    this.authOptions = {};
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('project_name');
    sessionStorage.removeItem('token');

  }

}


