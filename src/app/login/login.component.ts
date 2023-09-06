import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  loginError:String='';

  loginSuccess:boolean=false;

  constructor(private fb:FormBuilder, private api:ApiService, private loginRouter:Router){}
  
  ngOnInit(): void {
    
  }


  loginForm=this.fb.group({
    acno:['',[Validators.required,Validators.pattern('[0-9]*')]],
    password:['',[Validators.required,Validators.pattern('[a-zA-Z0-9]*')]],
  })
  login(){
    if(this.loginForm.valid){
      let acno=this.loginForm.value.acno
      let password=this.loginForm.value.password
      //Api call
      this.api.login(acno,password).subscribe((response:any)=>{
        console.log(response);
        
        //success
        this.loginSuccess=true
        //To set current username into the localstorage
        localStorage.setItem('currentUser',response.currentUser)

        //To set current balance into the localstorage
        localStorage.setItem('balance',response.balance)

        //To set current Acno into the localstorage
        localStorage.setItem('currentAcno',response.currentAcno)

        //To set token into the localstorage
        localStorage.setItem('token',response.token)

        // alert('Login Successful')
        setTimeout(()=>{
          this.loginRouter.navigateByUrl('/dashboard')
        },2000)
        
      },
      (response:any)=>{
        //error message
        
        setTimeout(()=>{
          this.loginForm.reset()
          this.loginError=''
        },2000);
        this.loginError=response.error.message
      }
      )
      
    }
    else{
      alert('Invalid login form')
    }
  }

}
