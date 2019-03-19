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
    public usertypes: any[];
    public loginusername: string;
    public loginpwd: string;
    public firstname: string;
    public username: string;
    public user: string;
    public usertype: string;
    public usertype_id: string;
    // the actual JWT token
    public token: string;
  // the token expiration date
    public token_expires: Date;
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
    fullname: this.fullname, usertype: this.usertypes}), this.httpOptions).subscribe(
        data => {
            this.message = data['message'];
            this.signupusername = '';
            this.signuppwd = '';
            this.signupconfpwd = '';
            this.fullname = '';
            this.usertypes = [];
        },
        err => {
            this.message = 'User Creation Failed! Unexpected Error!';
            console.error(err);
            this.signupusername = '';
            this.signuppwd = '';
            this.signupconfpwd = '';
            this.fullname = '';
            this.usertypes = [];
            
        }
    );
  }
  private updateData(token) {
    this.token = token;
    this.errors = [];
 
    // decode the token to read the username and expiration timestamp
    const token_parts = this.token.split(/\./);
    const token_decoded = JSON.parse(window.atob(token_parts[1]));
    console.log(token_decoded)
    this.token_expires = new Date(token_decoded.exp * 1000);
    this.username = token_decoded.username;
    this.usertype = token_decoded.usertype;


  }


  refreshToken() {
    this.http.post('http://' + this.domainname + '/ayooluwaoyewoscrumy/api-token-refresh/', JSON.stringify({token: this.token}), this.httpOptions).subscribe(
      data => {
        this.updateData(data['token']);
      },
      err => {
        this.errors = err['error'];
      }
    );
  }
 
  toLogin()
  {
    this.http.post('http://' + this.domainname + '/ayooluwaoyewoscrumy/api-token-auth/', JSON.stringify({username: this.loginusername, 
    password: this.loginpwd }), this.httpOptions).subscribe(
        data => {
            sessionStorage.setItem('username', this.loginusername);
            sessionStorage.setItem('usertype', data['usertype']);
            sessionStorage.setItem('usertype_id', data['id']);
            sessionStorage.setItem('token', data['token']);
            this.username = this.loginusername;
            this.usertype_id = data['id'];
            this.fullname = data['fullname'];
            this.message = 'Welcome!';
            this.usertype = data['usertype'];
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
  

  logout() {
    this.token = null;
    this.token_expires = null;
    this.username = null;
    this.router.navigate(['login']);
  }
 

}


