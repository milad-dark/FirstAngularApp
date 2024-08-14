import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { UserDetail } from '../../interfaces/user-detail';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})

export class UsersComponent {
  authService = inject(AuthService);
  user$ = this.authService.getAll();

}

// export class UsersComponent implements OnInit {
//   user! :UserDetail[];
//   constructor(private _authService: AuthService 
//   ){

//   }
//   ngOnInit(): void {
//     this._authService.getAll().subscribe(user=>{
//       console.log(user)
//       this.user = user
//     });
//   }

// }
