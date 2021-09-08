import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { EmployeeModel } from './employee.model';

import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../shared/api.service';
import { error } from '@angular/compiler/src/util';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent implements OnInit {

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
      fname: new FormControl("sam",[Validators.required]),
      
      firstName : [''],
      lastName : [''],
      email : [''],
      mobile : [''],
      salary : [''] 
      })

      this.getAllEmployees();
  }

  saveEmployeeDetails(){
    
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
    })
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
