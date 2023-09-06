import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  deleteSuccessMsg: string='';

  deleteConfirmStatus: boolean = false;//delete confirmation contact

  acno:any //for parent to child data communication

  transferSuccess:string='';
  transferError:string='';
  

  user:String='';//to hold current username
  balance:String='';//to hold current balance
  currentAcno:String='';//to hold current acno


  constructor(private fb:FormBuilder, private api:ApiService, private logoutRouter:Router){

  }
  ngOnInit(): void {
    if(localStorage.getItem('currentUser')){
      this.user=localStorage.getItem('currentUser')||'';//currentuser
    }
    // if(localStorage.getItem('balance')){
    //   this.balance=localStorage.getItem('balance')||'';//balance
    // }
    if(localStorage.getItem('currentAcno')){
      this.currentAcno=localStorage.getItem('currentAcno')||'';//currentAcno
    }
    
  }
  //Create a formGroup and array
  FundTransferForm=this.fb.group({
    creditAcno:['',[Validators.required,Validators.pattern('[0-9]*')]],
    amount:['',[Validators.required,Validators.pattern('[0-9]*')]],
    password:['',[Validators.required,Validators.pattern('[a-zA-Z0-9]*')]],
  })
  //control passess to html page

  isCollapse: boolean = false

  collapse(){
    this.isCollapse=!this.isCollapse
  }
  //fund transfer
  dashboardForm(){
    if(this.FundTransferForm.valid){
      let creditAcno= this.FundTransferForm.value.creditAcno;
      let password = this.FundTransferForm.value.password;
      let amount = this.FundTransferForm.value.amount;
      this.api.fundTransfer(creditAcno,password,amount).subscribe((result:any)=>{
        console.log(result);
        this.transferSuccess=result.message

        setTimeout(()=>{
          this.transferSuccess=''
          this.FundTransferForm.reset()
        },3000)
      },
      (result:any)=>{
        console.log(result.error.message);
        this.transferError=result.error.message
      })
      // alert('Form clicked')
    }
    else{
      alert('Please enter valid parameters')
    }
  }

  getBalance(){
    this.api.getBalance(this.currentAcno).subscribe((result:any)=>{
      this.balance=result.balance
    },
    (result:any)=>{
      alert(result.error.message)
    })
  }

  reset(){
    this.FundTransferForm.reset()
  }

  logout(){
    this.logoutRouter.navigateByUrl('')
    localStorage.clear()
    
  }

  deleteAccount(){
    this.acno=localStorage.getItem('currentAcno')//1

    this.deleteConfirmStatus=true
  }

  cancelDeleteConfirm(){
    this.acno=''
    this.deleteConfirmStatus=false
  }

  deleteFromParent(){
    this.api.deleteAccount().subscribe((result:any)=>{
      localStorage.clear()//remove all the account details from the local storage
      this.deleteSuccessMsg=result.message//Account deleted successfully
      setTimeout(()=>{
        this.logoutRouter.navigateByUrl('')//redirect back to login page   
      },3000)
    })
  }
  

}
