import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar'
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatMenuModule, MatIconModule, MatSnackBarModule,
    RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  authService = inject(AuthService);
  router = inject(Router);
  matSnackBar = inject(MatSnackBar)

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  loguot = () => {
    this.authService.logout();
    this.matSnackBar.open('Logout success', 'Close', {
      duration: 5000,
      horizontalPosition: 'center'
    });
    this.router.navigate(['/login']);
  };
}
