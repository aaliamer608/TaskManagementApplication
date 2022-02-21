import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILoginResult } from '../models/ILoginResult';
import { IRegisterResult } from '../models/IRegisterResult';
import { IUser } from '../models/IUser';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  users: IUser[] = [];
  isLoggedIn = false;

  constructor(private http: HttpClient) {
    
    this.LoadUsers();
    console.log(this.users);
  }

  LoadUsers() {
    this.users = [];
    let usrs = JSON.stringify(localStorage.getItem('users'));
   
    this.users = JSON.parse(JSON.parse(usrs));
   
    if (!this.users) {
      this.http.get<IUser[]>('assets/users.json').subscribe(data => {
        this.users = data;
        localStorage.setItem('users', JSON.stringify(this.users));
      });
    }


  }

  register(_username: string, _password: string, _confirmpassword: string):Promise<IRegisterResult> {
    let user: IUser = {
      username: _username, password: _password, confirmpassword: _confirmpassword
    };

    let usrlength_before = this.users.length;
    let index = this.users.findIndex(x=>x.username ==_username);
   
    if(index== -1){
      this.users.push(user);    
    
     }
    let usrlength_after= this.users.length;
    
    let  registerresult: IRegisterResult = {RegisterSuccessful: false};
     

    let reg_resut = new Promise<any>((resolve,reject)=>{
      if(usrlength_after>usrlength_before){
        localStorage.setItem('users', JSON.stringify(this.users));
        registerresult.RegisterSuccessful = true;
        resolve(registerresult);
      } else{
        registerresult.RegisterSuccessful = false;
       debugger
        if(index !=-1){
          let err = {'result': registerresult, 'message':'User already Exist'}
           reject(err);
     
        } else{
          let err = {'result': registerresult, 'message':' Unknown Error !'}
          reject(err);
       
        }
        }
    });

  return reg_resut;
  }

  login(username: string, password: string) : Promise<ILoginResult> {
   
    var checkLogin: ILoginResult = {loginSuccessful: true};
     var found = this.users.find(x=>x.username==username && x.password ==password);

    var loginPromise = new Promise<ILoginResult>((resolve, rejects) => {
      if (found) {
        checkLogin.loginSuccessful = true;
        resolve(checkLogin);
      }
      else {
        checkLogin.loginSuccessful = false;
        rejects(checkLogin);
      }
    });

    return loginPromise;
  }
}
