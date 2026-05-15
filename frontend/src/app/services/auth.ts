import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = '/api/auth';

  getMe(): Observable<any> {
    return this.http.get(`${this.baseUrl}/me`);
  }

  // Tracks login status for the Navbar
  private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {}

  signup(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('userName', res.user.name);
        localStorage.setItem('userRole', res.user.role || 'user');
        localStorage.setItem('user', JSON.stringify(res.user));
        this.loggedIn.next(true);
      })
    );
  }

  logout() {
    localStorage.clear();
    this.loggedIn.next(false);
  }

  getUserName(): string {
    return localStorage.getItem('userName') || 'User';
  }

  getUserRole(): string {
    return localStorage.getItem('userRole') || 'user';
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  updateProfile(profileData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/profile`, profileData).pipe(
      tap((res: any) => {
        localStorage.setItem('userName', res.name);
        localStorage.setItem('user', JSON.stringify(res));
      })
    );
  }
}
