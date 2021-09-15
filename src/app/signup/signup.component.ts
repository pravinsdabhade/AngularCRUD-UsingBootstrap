import { Component, OnInit } from '@angular/core';

import {FormGroup, FormBuilder,FormControl, Validators} from '@angular/forms'
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public signupForm !: FormGroup;

  constructor(private formBuiler:FormBuilder,private http:HttpClient, private router:Router) { }

  ngOnInit(): void {
  this.signupForm = this.formBuiler.group({
    fullName: ['', Validators.required],
    email: new FormControl('',[Validators.required, Validators.email]),
    password: ['', Validators.required],
    mobile: new FormControl('',[Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
  })

  }

  signUp(){
    this.http.get<any>("http://localhost:3000/SignupUsers")
    .subscribe(res =>{
      const user = res.find((a:any) =>{
        return a.email === this.signupForm.value.email
      });
      if(user){
        alert("email already exists");
      }else{
        this.http.post<any>("http://localhost:3000/signupUsers",this.signupForm.value)
        .subscribe(res => {
          alert("Signup successfully...");
          this.signupForm.reset();
          this.router.navigate(['login']);
        }, error => {
          alert("Somthing went wrong.");
        });
      }
    },err =>{
      alert("Something went wrong.")
    });
  }
}
