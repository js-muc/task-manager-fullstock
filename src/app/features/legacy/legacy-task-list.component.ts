// src/app/features/legacy/legacy-task-list.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskLegacyService } from './task-legacy.service';
import { Task } from '../../shared/task.model';
import { MaterialModule } from '../../shared/material.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from '../../shared/task-dialog.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { PerformanceProfilerComponent } from '../../shared/performance-profiler.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-legacy-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, TaskDialogComponent, PerformanceProfilerComponent, DragDropModule],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate('500ms ease-out', style({ opacity: 1 }))]),
      transition(':leave', [animate('500ms ease-in', style({ opacity: 0 }))])
    ])
  ],
  template: `
    <mat-card class="responsive-wrapper">
      <div class="toolbar">
        <h2 class="legacy-title">🐢 Legacy View (Zone.js)</h2>
        <mat-slide-toggle [checked]="darkMode()" (change)="toggleDarkMode()" color="accent">
          Dark Mode
        </mat-slide-toggle>
        <span class="task-info">📦 {{ taskCount }} total tasks | Page {{ currentPage }} of {{ totalPages }}</span>
      </div>

      <form (ngSubmit)="addTask()" class="task-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Title</mat-label>
          <input matInput name="title" [(ngModel)]="newTitle" required class="input-field" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput name="description" [(ngModel)]="newDescription" rows="2" class="input-field"></textarea>
        </mat-form-field>

        <button mat-raised-button color="primary" type="submit" [disabled]="!newTitle.trim()">
          Add Task
        </button>
      </form>

      <mat-button-toggle-group [(ngModel)]="filter" name="filter" class="filter-toggle" appearance="legacy" (change)="applyCurrentFilter()">
        <mat-button-toggle value="all">All</mat-button-toggle>
        <mat-button-toggle value="completed">Completed</mat-button-toggle>
        <mat-button-toggle value="pending">Pending</mat-button-toggle>
        <mat-button-toggle value="latest">Latest</mat-button-toggle>
      </mat-button-toggle-group>

      <div *ngIf="filteredTasks.length === 0" class="empty-state">
        <p>No tasks found. Add one to begin.</p>
      </div>

      <div class="task-grid">
        <mat-card class="task-card" *ngFor="let task of filteredTasks" [@fadeInOut]>
          <mat-card-title>{{ task.title }}</mat-card-title>
          <mat-card-content>
            <p>{{ task.description }}</p>
            <p class="meta">
              🕒 {{ task.createdAt | date:'medium' }}<br />
              ✅ Status: {{ task.completed ? 'Completed' : 'Pending' }}
            </p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="accent" (click)="toggleCompletion(task)">
              {{ task.completed ? 'Mark Pending' : 'Mark Completed' }}
            </button>
            <button mat-button color="primary" (click)="openEditDialog(task)">Update</button>
            <button mat-icon-button color="warn" (click)="delete(task._id)">
              <mat-icon>delete</mat-icon>
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <div class="pagination">
        <button mat-button (click)="prevPage()" [disabled]="currentPage === 1">⬅ Previous</button>
        <button mat-button (click)="nextPage()" [disabled]="currentPage === totalPages">Next ➡</button>
      </div>

      <!-- Make Performance Profiler movable -->
      <div class="draggable-profiler" cdkDrag>
        <app-performance-profiler></app-performance-profiler>
      </div>
    </mat-card>
  `,
  styles: [
    `
      .responsive-wrapper {
        padding: 1.5rem;
        max-width: 100%;
        box-sizing: border-box;
        transition: background 0.3s ease, color 0.3s ease;
        background-color: var(--bg-color);
        color: var(--text-color);
      }
      :host-context(.dark-theme) {
        --bg-color: #121212;
        --text-color: #e0e0e0;
        --input-bg: #1e1e1e;
        --input-color: #f1f1f1;
      }
      :host-context(.light-theme) {
        --bg-color: #ffffff;
        --text-color: #000000;
        --input-bg: #ffffff;
        --input-color: #000000;
      }
      .input-field {
        background-color: var(--input-bg) !important;
        color: var(--input-color) !important;
      }
      .task-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      .full-width {
        width: 100%;
      }
      .task-grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      }
      @media (max-width: 600px) {
        .task-grid {
          grid-template-columns: 1fr;
        }
      }
      .task-card {
        padding: 1rem;
        background-color: var(--bg-color);
        color: var(--text-color);
        border: 1px solid rgba(0, 0, 0, 0.1);
      }
      .meta {
        color: var(--text-color);
        font-size: 0.85rem;
        margin-top: 0.5rem;
      }
      .filter-toggle {
        margin-bottom: 1rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      .empty-state {
        margin-top: 1rem;
        color: var(--text-color);
      }
      .toolbar {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
        margin-bottom: 1rem;
        flex-wrap: wrap;
      }
      @media (min-width: 600px) {
        .toolbar {
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
        }
      }
      .legacy-title {
        margin-right: 1rem;
        white-space: nowrap;
      }
      .task-info {
        font-size: 0.9rem;
        color: var(--text-color);
        white-space: nowrap;
      }
      .pagination {
        display: flex;
        justify-content: space-between;
        margin-top: 1rem;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      .draggable-profiler {
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        z-index: 1000;
        cursor: move;
      }
    `
  ]
})
export class LegacyTaskListComponent implements OnInit {
  private taskService = inject(TaskLegacyService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  filteredTasks: Task[] = [];
  newTitle = '';
  newDescription = '';
  filter = 'all';
  darkMode = signal(false);
  currentPage = 1;
  totalPages = 1;
  taskCount = 0;
  readonly pageSize = 20;

  ngOnInit() {
    this.fetchTasks();
    document.body.classList.add('light-theme');
  }

  toggleDarkMode() {
    this.darkMode.update(val => !val);
    document.body.classList.toggle('dark-theme', this.darkMode());
    document.body.classList.toggle('light-theme', !this.darkMode());
  }

  fetchTasks(page: number = this.currentPage) {
    setTimeout(() => {
      this.taskService.fetchTasks(page, this.pageSize).subscribe(response => {
        this.filteredTasks = this.applyFilter(response.tasks);
        this.taskCount = response.total;
        this.totalPages = response.pages;
        this.currentPage = response.page;
      });
    }, 300);
  }

  applyFilter(tasks: Task[]): Task[] {
    switch (this.filter) {
      case 'completed': return tasks.filter(t => t.completed);
      case 'pending': return tasks.filter(t => !t.completed);
      case 'latest': return [...tasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      default: return tasks;
    }
  }

  applyCurrentFilter() {
    this.fetchTasks();
  }

  addTask() {
    this.taskService.createTask({ title: this.newTitle, description: this.newDescription }).subscribe(() => {
      this.newTitle = '';
      this.newDescription = '';
      this.snackBar.open('✅ Task added!', 'Close', { duration: 3000 });
      this.fetchTasks();
    });
  }

  delete(id: string) {
    this.taskService.deleteTask(id).subscribe(() => {
      this.snackBar.open('🗑 Task deleted.', 'Close', { duration: 3000 });
      this.fetchTasks();
    });
  }

  toggleCompletion(task: Task) {
    this.taskService.updateTask({ ...task, completed: !task.completed }).subscribe(() => {
      this.snackBar.open('🔄 Task status updated.', 'Close', { duration: 3000 });
      this.fetchTasks();
    });
  }

  openEditDialog(task: Task) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      data: task,
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(updated => {
      if (updated) {
        this.taskService.updateTask(updated).subscribe(() => {
          this.snackBar.open('✏️ Task updated.', 'Close', { duration: 3000 });
          this.fetchTasks();
        });
      }
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchTasks();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchTasks();
    }
  }
}
