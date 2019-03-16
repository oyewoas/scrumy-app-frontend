import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders , HttpParams, HttpResponse} from '@angular/common/http';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})


export class DataService {
    public domainname = '127.0.0.1:8000';
    public message: string;
    public sigupusername: string;
    public signuppwd: string;
    public signupconfpwd: string;
    public fullname: string;
    public usertypes: any[];
    public loginusername: string;
    public loginpwd: string;

    public httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json' })
    };

  constructor(
    private http: HttpClient, private router: Router
  ) { }

  createUser() {
    // tslint:disable-next-line:max-line-length
    this.http.post('http://' + this.domainname + '/ayooluwaoyewoscrumy/api/v1/users/', JSON.stringify({username: this.sigupusername, password: this.signuppwd, confirmpassword: this.signupconfpwd, fullname: this.fullname, usertype: this.usertypes}), this.httpOptions).subscribe(
        data => {
            this.message = data['message'];
            this.sigupusername = '';
            this.signuppwd = '';
            this.signupconfpwd = '';
            this.fullname = '';
            this.usertypes = [];
        },
        err => {
            this.message = 'User Creation Failed! Unexpected Error!';
            console.error(err);
            this.sigupusername = '';
            this.signuppwd = '';
            this.signupconfpwd = '';
            this.fullname = '';
            this.usertypes = [];
        }
    );
  }

 


  }

