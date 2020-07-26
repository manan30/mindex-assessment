import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeService } from '../employee.service';
import { catchError } from 'rxjs/operators';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Employee } from 'src/app/employee';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit {
  public form: FormGroup;
  sendingEmail = false;
  errorMessage: string;
  employee: Employee = new Employee();

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public employeeService: EmployeeService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.data.action === 'update') {
      this.form = this.fb.group({
        firstName: new FormControl({
          value: this.data.employee.firstName,
          disabled: true,
        }),
        lastName: new FormControl({
          value: this.data.employee.lastName,
          disabled: true,
        }),
        position: new FormControl({
          value: this.data.employee.position,
          disabled: true,
        }),
        compensation: new FormControl(
          { value: this.data.employee.compensation, disabled: false },
          [Validators.required]
        ),
      });
    }
  }

  cancelAction() {
    this.dialogRef.close('cancel');
  }

  saveAction() {
    if (this.data.action === 'update') {
      this.employee.firstName = this.data.employee.firstName;
      this.employee.lastName = this.data.employee.lastName;
      this.employee.directReports = this.data.employee.directReports;
      this.employee.id = this.data.employee.id;
      this.employee.position = this.data.employee.position;
      this.employee.compensation = this.form.controls['compensation'].value;
      this.employeeService
        .save(this.employee)
        .pipe(catchError(this.handleUpdateError.bind(this)))
        .subscribe();
    }
    this.dialogRef.close();
  }

  private handleUpdateError(e: Error | any): string {
    console.error(e);
    return (this.errorMessage = e.message || 'Unable to delete employee');
  }
}
