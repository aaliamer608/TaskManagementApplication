import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmedPasswordValidator } from '../confirm-password-validator';
import { LoginService } from '../services/login.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  
})
export class LoginComponent implements OnInit {

 // username = 'input'
 // password = 'input'
  isLoggedIn: boolean = true;

  loginbox= true;
  registerbox= false;
  loginForm:any;
  registerForm:any;
  
  get login_name() { return this.loginForm.get('userName'); }
  get login_password() { return this.loginForm.get('password'); }
  get register_name() { return this.registerForm.get('username'); }
  get register_password() { return this.registerForm.get('password'); }
  get f(){
    return this.registerForm.controls;
  }

  constructor(private loginservice: LoginService, private router: Router,
     private notificationservice:NotificationService, private fb:FormBuilder) {}

  ngOnInit(): void {
    this.loginForm  = this.fb.group({
              userName: new FormControl('', [Validators.required]),
              password: new FormControl('', [Validators.required])
            })
  //  let  x = new FormGroup({
  //     userName: new FormControl('', [Validators.required]),
  //     password: new FormControl('', [Validators.required, this.customLength.bind(this)])
  //   });
    this.registerForm = this.fb.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmpassword: new FormControl('', [Validators.required])},  
      { validator: ConfirmedPasswordValidator('password', 'confirmpassword')
    });
    // let y = new FormGroup({
    //   username: new FormControl('', [Validators.required]),
    //    password: new FormControl('', [Validators.required]),
    //   confirmpassword: new FormControl('', [Validators.required]),
    // });
  
  }


  loginSubmit() {
    var userInfo = this.loginForm.value;
    this.loginservice.login(userInfo.userName, userInfo.password).then(
      res => {
        if (res.loginSuccessful) {
          this.loginservice.isLoggedIn = true;
          localStorage.setItem('isLoggedIn', 'true');
          this.notificationservice.openSnackBar("Login Successful!");
          this.router.navigate(['/home'])
          console.log(res);
        }
        
        },
        (err) => {
          this.notificationservice.openSnackBar("Login Failed!");
       
        }
      
    
    )


  }

  registerSubmit(){
    let users= this.registerForm.value;
    this.loginservice.register(users.username, users.password, users.confirmpassword).then(res=>{
      console.log(res);
      this.notificationservice.openSnackBar("Registration Successful!");
         
    }, (err)=>{
      this.notificationservice.openSnackBar("Registration Failed!   " + err.message);
     
    })
  }

switchtabs(){
  this.loginForm.reset();
  this.registerForm.reset();
  this.loginbox = !this.loginbox;
  this.registerbox = !this.registerbox;
}

customLength(control: FormControl) {

  return (formGroup:FormGroup)=>{
let c = formGroup.controls['password'];

  }
//  let register_password = this.registerForm.value

}



  }




