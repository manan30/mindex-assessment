import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Employee } from '../employee';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
})
export class EmployeeComponent {
  @Input() employee: Employee;
  @Input() directReports: Employee[];

  @Output() editEmployeeRecord = new EventEmitter();
  @Output() deleteEmployeeRecord = new EventEmitter();

  public delete(emp: Employee) {
    console.log(emp, this.employee);
    // this.deleteEmployeeRecord.emit({});
  }
}
