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
    public password: string;
    public loginpwd: string;
    public firstname: string;
    public roleid;
    public roles;
    public users;
    public goal_name;
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
    fullname: this.fullname, role: this.role}), this.httpOptions).subscribe(
        data => {
            this.message = data['message'];
            this.signupusername = '';
            this.signuppwd = '';
            this.signupconfpwd = '';
            this.role = '';
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
        }
        
    );
  }


  toLogin()
  {
    this.http.post('http://' + this.domainname + '/ayooluwaoyewoscrumy/api/v1/user/', JSON.stringify({username: this.loginusername,
    password: this.loginpwd }), this.httpOptions).subscribe(
        data => {
            if (data['exit'] === 0) {
            sessionStorage.setItem('username', this.loginusername);
            sessionStorage.setItem('password', this.loginpwd);
            sessionStorage.setItem('role', data['role']);
            sessionStorage.setItem('message', data['message']);
            this.username = this.loginusername;
            this.password = this.loginpwd;
            this.role = data['role'];
            this.roleid = data['id'];
            this.fullname = data['nickname'];
            this.users = data['data'];
            this.role = data['role'];
            this.router.navigate(['scrumboard']);
          } else {
            this.username = '';
            this.password = '';
          }
            this.loginusername = '';
            this.loginpwd = '';
            this.username = '';
            this.password = '';
            this.message = data['message'];

            console.log(data);
        },
        err => {
            if(err['status'] == 400) {
              this.message = 'Login Failed: Invalid Credentials.';

            } else {
              this.message = 'Login Failed! Unexpected Error!';
            }
            console.error(err);
            this.loginusername = '';
            this.loginpwd = '';
        }
    );
  }

addGoal()
{this.http.post('http://' + this.domainname + '/ayooluwaoyewoscrumy/api/v1/scrumgoal/',
  JSON.stringify({username: this.username,
  password: this.password, goal_name: this.goal_name  }), this.httpOptions).subscribe(
      data => {
        if (data['exit'] === 0) 
              this.users = data['data'];
          this.message = data['message'];
          this.goal_name = '';
          
          
        
      },

      err => {
        console.error(err);
        this.message = 'Unexpected Error!';
        this.goal_name = '';

      },
    );

  }

  logout()
  {
    this.username = '';
    this.roles = '';
    this.roleid = '';
    this.users = [];
    this.fullname = '';
    this.router.navigate(['login']);
    this.authOptions = {};
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('role_id');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('fullname');
  }

}


