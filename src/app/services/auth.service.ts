import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from '../models/IUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  users: IUser[] = [];

  constructor(private http: HttpClient) {
    this.LoadUsers();
  }

  LoadUsers() {
    this.users = [];
    let usrs = JSON.stringify(localStorage.getItem('users'));
    this.users = JSON.parse(usrs);
   
    if (!this.users) {
      this.http.get<IUser[]>('assets/users.json').subscribe(data => {
        this.users = data;
        localStorage.setItem('users', JSON.stringify(this.users));
      });
    }


  }

  register(_username: string, _password: string, _confirmpassword: string) {
    let user: IUser = {
      username: _username, password: _password, confirmpassword: _confirmpassword
    };

    this.users.push(user);
    localStorage.setItem('users', JSON.stringify(this.users));

  }
}
