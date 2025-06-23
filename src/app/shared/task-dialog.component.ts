import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Task } from './task.model';
import { environment } from '../../environments/environment.prod';


@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule
  ],
  template: `
    <h2 mat-dialog-title>Edit Task</h2>
    <div mat-dialog-content>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Title</mat-label>
        <input matInput [(ngModel)]="task.title" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Description</mat-label>
        <textarea matInput rows="3" [(ngModel)]="task.description"></textarea>
      </mat-form-field>

      <mat-checkbox [(ngModel)]="task.completed">Completed</mat-checkbox>
    </div>

    <div mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="updateTask()">Update</button>
    </div>
  `,
  styles: [`
    .full-width {
      width: 100%;
    }
    mat-dialog-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  `]
})
export class TaskDialogComponent {
  private http = inject(HttpClient);
  task: Task;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { task: Task },
    public dialogRef: MatDialogRef<TaskDialogComponent>
  ) {
    this.task = { ...data.task }; // clone to avoid modifying original
  }

  updateTask() {
    this.http.put(`${environment.apiUrl}/tasks/${this.task._id}`, this.task).subscribe({
      next: () => this.dialogRef.close(this.task),
      error: err => {
        console.error('❌ Failed to update task', err);
        alert('Update failed');
      }
    });
  }
}
