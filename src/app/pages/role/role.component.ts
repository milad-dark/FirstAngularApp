import { Component, inject } from '@angular/core';
import { RoleFormComponent } from '../../components/role-form/role-form.component';
import { RoleService } from '../../services/role.service';
import { RoleCreateRequest } from '../../interfaces/role-create-request';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { RoleListComponent } from '../../components/role-list/role-list.component';
import { AsyncPipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [RoleFormComponent, RoleListComponent, AsyncPipe, 
    MatSnackBarModule, MatSelectModule, MatIconModule],
  templateUrl: './role.component.html',
  styleUrl: './role.component.css'
})
export class RoleComponent {
  roleService = inject(RoleService);
  authService = inject(AuthService);
  errorMessage = '';
  role: RoleCreateRequest = {} as RoleCreateRequest;
  snackBar = inject(MatSnackBar);

  selectedUser:string = '';
  selectedRole:string = '';
  user$ = this.authService.getAll();
  roles$ = this.roleService.getRoles();

  createRole(role: RoleCreateRequest) {
    this.roleService.createRole(role).subscribe({
      next: (response: { message: string }) => {
        this.roles$ = this.roleService.getRoles();

        this.snackBar.open('Create role is successfully', 'Close', {
          duration: 3000
        });
      }, error: (error: HttpErrorResponse) => {
        if (error.status == 400) {
          this.errorMessage = error.error;
        }
      },
    })
  }

  deleteRole(id: string) {
    this.roleService.deleteRole(id).subscribe({
      next: (response: { message: string }) => {
        this.roles$ = this.roleService.getRoles();

        this.snackBar.open('Role deleted successfully', 'Close', {
          duration: 3000
        });
      },
      error: (error: HttpErrorResponse) => {
        if (error.status == 400) {
          this.snackBar.open(error.message, 'Ok', {
            duration: 5000
          });
        }
      }
    })
  }

  assignRole() {
    this.roleService.assignRole(this.selectedUser, this.selectedRole).subscribe({
      next: (response: { message: string }) => {
        this.roles$ = this.roleService.getRoles();

        this.snackBar.open('Role assign successfully', 'Close', {
          duration: 3000
        });
      },
      error: (error: HttpErrorResponse) => {
        if (error.status == 400) {
          this.snackBar.open(error.message, 'Ok', {
            duration: 5000
          });
        }
      }
    })
  }
}
