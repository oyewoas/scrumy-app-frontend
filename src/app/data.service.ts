import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders , HttpParams, HttpResponse} from '@angular/common/http';
import { Router } from '@angular/router';


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
    public role: any[];
    public roles: string;
    public loginusername: string;
    public username: string;
    public loginpwd: string;
    public firstname: string;
    public roleid;
    public users;
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
            this.fullname = '';
            this.role = [];
            this.router.navigate(['login']);
        },
        err => {
            this.message = 'User Creation Failed! Unexpected Error!';
            console.error(err);
            this.signupusername = '';
            this.signuppwd = '';
            this.signupconfpwd = '';
            this.fullname = '';
            this.role = []; 
        }
        
    );
  }


  toLogin()
  {
    this.http.post('http://' + this.domainname + '/ayooluwaoyewoscrumy/api-token-auth/', JSON.stringify({username: this.loginusername, 
    password: this.loginpwd }), this.httpOptions).subscribe(
        data => {
            sessionStorage.setItem('username', this.loginusername);
            sessionStorage.setItem('realname', data['name']);
            sessionStorage.setItem('role', data['role']);
            sessionStorage.setItem('role_id', data['id']);
            sessionStorage.setItem('token', data['token']);
            this.username = this.loginusername;
            this.role = data['role'];
            this.roleid = data['id'];
            this.fullname = data['fullname'];
            this.message = 'Welcome!';
            this.role = data['role'];
            this.router.navigate(['scrumboard']);
            this.loginusername = '';
            this.loginpwd = '';
            console.log(data);

            this.authOptions = {
                headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'JWT ' + data['token']})
            };
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

  logout()
  {
    this.username = '';
    this.roles = '';
    this.roleid = '';
    this.users = [];
    this.fullname = '';
    this.router.navigate(['home']);
    this.authOptions = {};
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('role_id');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('fullname');
  }

}


