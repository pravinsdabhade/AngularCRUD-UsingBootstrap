import { Component, OnInit } from '@angular/core';
import { ControlContainer, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { EmployeeModel } from './employee.model';

import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../shared/api.service';
import { error } from '@angular/compiler/src/util';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgxPaginationModule} from 'ngx-pagination'; // <-- import the module

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent implements OnInit {
  
  p: number = 1;
  
  employeeFormValue! : FormGroup;
  employeeModelObj : EmployeeModel = new EmployeeModel();
  employeeData !: any;

  isShowAddBtn !: boolean;
  isShowUpdateBtn !: boolean;
  

  constructor(private formbuilder : FormBuilder,private api : ApiService) { }

  onSubmit(){
    
  }

  ngOnInit(): void {
    this.employeeFormValue = this.formbuilder.group({
      firstName : new FormControl('',[Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
      lastName : new FormControl('',[Validators.required,Validators.minLength(3), Validators.maxLength(10)]),
      email : new FormControl('',[Validators.required, Validators.email]),
      mobile : new FormControl('',[Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      salary : new FormControl('',[Validators.required,Validators.minLength(4)]) 
      });

      this.getAllEmployees();
  }

  saveEmployeeDetails(){

    // Logic to check email id exists or not.
    this.api.getEmployee()
    .subscribe(res =>{
        const isEmployeeWithThisEmailIdPresent = res.find((a:any)=>{
          // alert(a.email+" and "+this.employeeFormValue.value.email);
         return a.email === this.employeeFormValue.value.email;
        });

    if(!isEmployeeWithThisEmailIdPresent){
      
      // If not then save the new record with new email id
      this.employeeModelObj.firstName = this.employeeFormValue.value.firstName;
      this.employeeModelObj.lastName = this.employeeFormValue.value.lastName;
      this.employeeModelObj.email = this.employeeFormValue.value.email;
      this.employeeModelObj.mobile = this.employeeFormValue.value.mobile;
      this.employeeModelObj.salary = this.employeeFormValue.value.salary;

      this.api.postEmployee(this.employeeModelObj).subscribe(res =>{
        console.log(res);
        alert("Employee Added successfully")
        let ref = document.getElementById('reset')
        ref?.click();
        this.employeeFormValue.reset();
        this.getAllEmployees();
      }, error =>{
        alert("Something went wrong")
      });
    }else{
      alert("Employee with "+ this.employeeFormValue.value.email +" email already exists...");
    }

        
    });
    
    



    
  }

  getAllEmployees(){
    this.api.getEmployee().subscribe(res => {
      this.employeeData = res;
    })
  }

  deleteEmployee(row : any){
    this.api.deleteEmployee(row.id).subscribe(res =>{
      alert("Employee deleted...");
      this.getAllEmployees();
    });
  }

  onEdit(row:any){
    this.isShowAddBtn=false;
    this.isShowUpdateBtn=true;

    this.employeeModelObj.id = row.id;
    
   this.employeeFormValue.controls['firstName'].setValue(row.firstName); 
   this.employeeFormValue.controls['lastName'].setValue(row.lastName); 
   this.employeeFormValue.controls['email'].setValue(row.email); 
   this.employeeFormValue.controls['mobile'].setValue(row.mobile); 
   this.employeeFormValue.controls['salary'].setValue(row.salary); 
  }

  updateEmployeeDetails(){
    this.employeeModelObj.firstName = this.employeeFormValue.value.firstName;
    this.employeeModelObj.lastName = this.employeeFormValue.value.lastName;
    this.employeeModelObj.email = this.employeeFormValue.value.email;
    this.employeeModelObj.mobile = this.employeeFormValue.value.mobile;
    this.employeeModelObj.salary = this.employeeFormValue.value.salary;

    this.api.updateEmployee(this.employeeModelObj,this.employeeModelObj.id)
    .subscribe(res =>{
      alert("updated sucessfully...");
      let ref = document.getElementById('reset')
      ref?.click();
      this.employeeFormValue.reset();
      this.getAllEmployees();
    })
  }

  onClickAddEmployee(){
    this.employeeFormValue.reset();
    this.isShowAddBtn=true;
    this.isShowUpdateBtn=false;
  }
}
