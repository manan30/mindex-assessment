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

  openModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = 'modal-component';
    dialogConfig.width = '50%';

    const modalDialogRef = this.dialog.open(ModalComponent, dialogConfig);
    return modalDialogRef;
  }

  private onEditEmployeeRecord(employee: Employee) {
    // const dialogRef = this.dialog.open(ModalComponent, {
    //   width: '50%',
    //   data: { employee: employee }, // data holds the information we are giving to the dialog component
    //   disableClose: true, // disables closing bfrom clicking outside the dialog
    // });
    const dialogRef = this.openModal();
    dialogRef.afterClosed().subscribe((data) => {
      this.getAllEmployees();
    });
  }

  private handleError(e: Error | any): string {
    console.error(e);
    return (this.errorMessage = e.message || 'Unable to retrieve employees');
  }
}
