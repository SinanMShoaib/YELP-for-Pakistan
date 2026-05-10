import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.html',
  styleUrls: ['./auth.css']
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  error: string | null = null;

  // Form Data
  authData = {
    name: '',
    email: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/search']);
    }
  }

  onToggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.error = null;
  }

  onSubmit() {
    this.isLoading = true;
    this.error = null;

    if (this.isLoginMode) {
      // LOGIN FLOW
      this.authService.login({ email: this.authData.email, password: this.authData.password }).subscribe({
        next: () => {
          this.router.navigate(['/search']);
        },
        error: (err) => {
          this.error = err.error.message || 'Login failed. Check your credentials.';
          this.isLoading = false;
        }
      });
    } else {
      // SIGNUP FLOW
      this.authService.signup(this.authData).subscribe({
        next: () => {
          this.isLoginMode = true; // Switch to login after successful signup
          this.isLoading = false;
          alert('Account created! Please login.');
        },
        error: (err) => {
          this.error = err.error.message || 'Signup failed.';
          this.isLoading = false;
        }
      });
    }
  }
}
