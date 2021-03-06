import { Component, OnInit } from '@angular/core';
import { catchError, map, reduce } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  errorMessage: string;

  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog
  ) {}

  getAllEmployees() {
    this.employeeService
      .getAll()
      .pipe(
        reduce((emps, e: Employee) => emps.concat(e), []),
        map((emps) => (this.employees = emps)),
        catchError(this.handleError.bind(this))
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.getAllEmployees();
  }

  private directReports(employee: Employee) {
    if (employee?.directReports?.length > 0) {
      const reports = [];
      employee.directReports.map((id) => {
        const e = this.employees.find((x) => x.id === id);
        reports.push(e);
      });
      return reports;
    }

    return null;
  }

  openModal(data) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = 'modal-component';
    dialogConfig.width = '50%';
    dialogConfig.data = data;

    const modalDialogRef = this.dialog.open(ModalComponent, dialogConfig);
    return modalDialogRef;
  }

  private onEditEmployeeRecord(employee: Employee) {
    const dialogRef = this.openModal({ action: 'update', employee: employee });
    dialogRef.afterClosed().subscribe(() => {
      this.getAllEmployees();
    });
  }

  private onDeleteEmployeeRecord(object: {
    record: Employee;
    employee: Employee;
  }) {
    const warning = `Are you sure you want to delete the employee record for ${object.record.firstName} ${object.record.lastName}?`;

    const dialogRef = this.openModal({ action: 'delete', warning: warning });
    dialogRef.afterClosed().subscribe((data) => {
      if (data !== 'cancel') {
        const idx: number = object.employee.directReports.indexOf(
          object.record.id
        );
        if (idx !== -1) {
          object.employee.directReports.splice(idx, 1);
        }
        this.employeeService
          .save(object.employee)
          .pipe(catchError(this.handleDeleteError.bind(this)))
          .subscribe();
      }
    });
  }

  private handleError(e: Error | any): string {
    console.error(e);
    return (this.errorMessage = e.message || 'Unable to retrieve employees');
  }

  private handleDeleteError(e: Error | any): string {
    console.error(e);
    return (this.errorMessage = e.message || 'Unable to delete employee');
  }
}
