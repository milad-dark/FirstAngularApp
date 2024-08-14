import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { LoginRequest } from '../interfaces/login-request';
import { Observable, map, of } from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { RegisterRequest } from '../interfaces/register-request';
import { UserDetail } from '../interfaces/user-detail';
import { ResetPasswordRequest } from '../interfaces/reset-password-request';
import { ChangePasswordRequest } from '../interfaces/change-password-request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl: string = environment.apiUrl;
  private userKey = 'user';

  constructor(private http: HttpClient) { }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/account/login`, data)
      .pipe(
        map((response) => {
          if (response.isSuccess) {
            localStorage.setItem(this.userKey, JSON.stringify(response));
          }
          return response;
        })
      )
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/account/register`, data);
  }

  getDetail = (): Observable<UserDetail> =>
    this.http.get<UserDetail>(`${this.apiUrl}/account/detail`);

  getAll(): Observable<UserDetail[]> {
    return this.http.get<any>(`${this.apiUrl}/account`);
  }

  refreshToken = (data: {
    email: string;
    token: string;
    refreshToken: string;
  }): Observable<AuthResponse> =>
    this.http.post<AuthResponse>(`${this.apiUrl}/account/refresh-token`, data);


  forgotPassword = (email: string): Observable<AuthResponse> =>
    this.http.post<AuthResponse>(`${this.apiUrl}/account/forgot-password`, { email });

  // resetPassword = (data: ResetPasswordRequest) : Observable<AuthResponse> =>
  //   this.http.post<AuthResponse>(`${this.apiUrl}/account/reset-password`, {data});

  resetPassword(data: ResetPasswordRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/account/reset-password`, data);
  }

  changePassword(data: ChangePasswordRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/account/change-password`, data);
  }

  isLoggedIn = (): boolean => {
    const token = this.getToken();
    if (!token) return false;

    return true;
  };

  private isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    const decoded = jwtDecode(token);
    const isTokenExpired = Date.now() > decoded['exp']! * 1000;
    // if (isTokenExpired) this.logout();
    return true;
  };

  logout = (): void => {
    localStorage.removeItem(this.userKey);
  };

  getUserDetail = () => {
    const token = this.getToken();
    if (!token) return null;
    const decodedToken: any = jwtDecode(token);
    const userDetail = {
      id: decodedToken.nameid,
      fullName: decodedToken.name,
      email: decodedToken.email,
      roles: decodedToken.role || []
    }

    return userDetail;
  }

  getRoles = (): string[] | null => {
    const token = this.getToken();
    if (!token) return null;

    const decodedToken: any = jwtDecode(token);
    return decodedToken.role || null;
  };

  getToken = (): string | null => {
    // localStorage.getItem(this.userKey) || '';
    const user = localStorage.getItem(this.userKey);
    if (!user) return null;
    const userDetail: AuthResponse = JSON.parse(user);
    return userDetail.token;
  }

  getRefreshToken = (): string | null => {
    const user = localStorage.getItem(this.userKey);
    if (!user) return null;
    const userDetail: AuthResponse = JSON.parse(user);
    return userDetail.refreshToken;
  }
}



// getAll(): Observable<UserDetail[]> {
//   const mockData: UserDetail[] = [
//       {
//           id: '1',
//           fullName: 'John Doe',
//           email: 'john.doe@example.com',
//           roles: 'admin',
//           phoneNumber: '123-456-7890',
//           twoFacotrEnabled: true,
//           phoneNumberConfirmed: true,
//           accessFailedCount: 0
//       },
//       {
//           id: '2',
//           fullName: 'Jane Smith',
//           email: 'jane.smith@example.com',
//           roles: 'user',
//           phoneNumber: '987-654-3210',
//           twoFacotrEnabled: false,
//           phoneNumberConfirmed: true,
//           accessFailedCount: 2
//       },
//       {
//           id: '3',
//           fullName: 'Alice Johnson',
//           email: 'alice.johnson@example.com',
//           roles: 'user',
//           phoneNumber: '555-123-4567',
//           twoFacotrEnabled: true,
//           phoneNumberConfirmed: false,
//           accessFailedCount: 1
//       },
//       {
//           id: '4',
//           fullName: 'Bob Brown',
//           email: 'bob.brown@example.com',
//           roles: 'moderator',
//           phoneNumber: '555-987-6543',
//           twoFacotrEnabled: true,
//           phoneNumberConfirmed: true,
//           accessFailedCount: 3
//       }
//   ];

//   return of(mockData);
// }