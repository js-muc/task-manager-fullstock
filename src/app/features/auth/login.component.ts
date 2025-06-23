// src/app/features/auth/login.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  template: `
    <div class="login-wrapper">
      <mat-card class="login-container">
        <form [formGroup]="form" (ngSubmit)="onLogin()" class="login-form">
          <h2>Welcome Back</h2>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput placeholder="user@example.com" formControlName="email" />
            <mat-error *ngIf="form.get('email')?.invalid && form.get('email')?.touched">
              Enter a valid email address
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <input matInput type="password" placeholder="••••••••" formControlName="password" />
            <mat-error *ngIf="form.get('password')?.invalid && form.get('password')?.touched">
              Password is required
            </mat-error>
          </mat-form-field>

          <div class="actions">
            <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">
              Login
            </button>
          </div>
        </form>
      </mat-card>
    </div>
  `,
  styles: [
    `
    .login-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem 1rem;
    }

    .login-container {
      width: 100%;
      max-width: 480px;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
    }

    .full-width {
      width: 100%;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
    }

    @media (max-width: 480px) {
      .login-container {
        padding: 1.5rem 1rem;
      }

      .actions {
        justify-content: center;
      }
    }

    .snackbar-success {
      background-color: #4caf50;
      color: #fff;
      font-weight: 500;
      letter-spacing: 0.5px;
    }

    .snackbar-error {
      background-color: #e53935;
      color: #fff;
    }
    `
  ]
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onLogin() {
    if (this.form.invalid) return;

    this.auth.login(this.form.value).subscribe({
      next: (res: any) => {
        this.auth.setToken(res.token);
        this.snackBar.open('✅ Login successful!', 'Close', {
          duration: 3000,
          panelClass: 'snackbar-success'
        });
        this.form.reset(); // ✅ Clear form on success
        this.router.navigate(['/signals']);
      },
      error: () => {
        this.snackBar.open('❌ Login failed. Please try again.', 'Close', {
          duration: 3000,
          panelClass: 'snackbar-error'
        });
      },
    });
  }
}
