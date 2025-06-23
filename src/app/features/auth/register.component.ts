// src/app/features/auth/register.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  template: `
    <div class="register-wrapper">
      <mat-card class="register-container">
        <form [formGroup]="form" (ngSubmit)="onRegister()" class="register-form">
          <h2>Create Account</h2>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Full Name</mat-label>
            <input matInput placeholder="John Doe" formControlName="name" />
            <mat-error *ngIf="form.get('name')?.invalid && form.get('name')?.touched">
              Name is required
            </mat-error>
          </mat-form-field>

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
              Register
            </button>
          </div>
        </form>
      </mat-card>
    </div>
  `,
  styles: [
    `
    .register-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem 1rem;
    }

    .register-container {
      width: 100%;
      max-width: 480px;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .register-form {
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
      .register-container {
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
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onRegister() {
    if (this.form.invalid) return;

    this.auth.register(this.form.value).subscribe({
      next: () => {
        this.snackBar.open('✅ Registration successful!', 'Close', {
          duration: 3000,
          panelClass: 'snackbar-success'
        });
        this.router.navigate(['/login']);
      },
      error: () => {
        this.snackBar.open('❌ Registration failed. Try again.', 'Close', {
          duration: 3000,
          panelClass: 'snackbar-error'
        });
      },
    });
  }
}
