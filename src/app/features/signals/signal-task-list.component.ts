// src/app/features/signals/signal-task-list.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MaterialModule } from '../../shared/material.module';
import { Task } from '../../shared/task.model';
import { environment } from '../../../environments/environment';
import { PerformanceProfilerComponent } from '../../shared/performance-profiler.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-signal-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, PerformanceProfilerComponent, DragDropModule],
  template: `
    <mat-card class="responsive-wrapper">
      <div class="toolbar">
        <h2 class="legacy-title">⚡ Signal View (Optimized)</h2>
        <mat-slide-toggle [checked]="darkMode()" (change)="toggleDarkMode()" color="accent">
          Dark Mode
        </mat-slide-toggle>
        <button mat-stroked-button color="warn" (click)="logout()">Logout</button>
      </div>

      <div class="admin-controls">
        <button mat-stroked-button color="primary" (click)="seedTasks()">🚀 Seed 1000 Tasks</button>
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

        <div class="submit-button">
          <button mat-raised-button color="primary" type="submit" [disabled]="!newTitle.trim()">Add</button>
        </div>
      </form>

      <mat-button-toggle-group [(ngModel)]="filter" name="filter" class="filter-toggle" appearance="legacy">
        <mat-button-toggle value="all">All</mat-button-toggle>
        <mat-button-toggle value="completed">Completed</mat-button-toggle>
        <mat-button-toggle value="pending">Pending</mat-button-toggle>
        <mat-button-toggle value="latest">Latest</mat-button-toggle>
      </mat-button-toggle-group>

      <div *ngIf="tasks().length === 0" class="empty-state">
        <p>No tasks found. Add one or seed tasks to begin.</p>
      </div>

      <div class="task-grid">
        <mat-card class="task-card" *ngFor="let task of filteredTasks()">
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
            <button mat-button color="primary" (click)="editTask(task)">Update</button>
            <button mat-icon-button color="warn" (click)="deleteTask(task._id)">
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
      .submit-button {
        align-self: start;
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
      .admin-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }
      .task-info {
        font-size: 0.9rem;
        color: var(--text-color);
        white-space: nowrap;
      }
      .filter-toggle {
        margin-bottom: 1rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
      }
      .toolbar {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
        flex-wrap: wrap;
        margin-bottom: 1rem;
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
      .pagination {
        display: flex;
        justify-content: space-between;
        margin-top: 1rem;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      .empty-state {
        margin-top: 1rem;
        color: var(--text-color);
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
export class SignalTaskListComponent implements OnInit {
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);
  tasks = signal<Task[]>([]);
  newTitle = '';
  newDescription = '';
  currentPage = 1;
  totalPages = 1;
  taskCount = 0;
  readonly pageSize = 20;
  filter = 'all';
  darkMode = signal(false);

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
    const token = localStorage.getItem('token');
    if (!token) return;

    this.http.get<{ tasks: Task[]; total: number; page: number; pages: number }>(`${environment.apiUrl}/tasks?page=${page}&limit=${this.pageSize}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: res => {
        this.tasks.set(res.tasks);
        this.taskCount = res.total;
        this.currentPage = res.page;
        this.totalPages = res.pages;
      },
      error: err => console.error('❌ Failed to fetch tasks', err)
    });
  }

  filteredTasks(): Task[] {
    const all = this.tasks();
    if (this.filter === 'completed') return all.filter(t => t.completed);
    if (this.filter === 'pending') return all.filter(t => !t.completed);
    if (this.filter === 'latest') return [...all].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return all;
  }

  addTask() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const task = {
      title: this.newTitle,
      description: this.newDescription
    };

    this.http.post<Task>(`${environment.apiUrl}/tasks`, task, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        this.fetchTasks();
        this.newTitle = '';
        this.newDescription = '';
        this.snackBar.open('✅ Task added!', 'Close', { duration: 3000 });
      },
      error: err => console.error('❌ Failed to add task', err)
    });
  }

  toggleCompletion(task: Task) {
    const token = localStorage.getItem('token');
    if (!token) return;

    const updated = { ...task, completed: !task.completed };

    this.http.put<Task>(`${environment.apiUrl}/tasks/${task._id}`, updated, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => this.fetchTasks(),
      error: err => console.error('❌ Failed to toggle task status', err)
    });
  }

  editTask(task: Task) {
    const title = prompt('Update title:', task.title);
    const description = prompt('Update description:', task.description);
    if (!title || !description) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const updated = { ...task, title: title.trim(), description: description.trim() };

    this.http.put<Task>(`${environment.apiUrl}/tasks/${task._id}`, updated, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => this.fetchTasks(),
      error: err => console.error('❌ Failed to update task', err)
    });
  }

  deleteTask(id: string) {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.http.delete(`${environment.apiUrl}/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => this.fetchTasks(),
      error: err => console.error('❌ Failed to delete task', err)
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

  seedTasks() {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.http.post(`${environment.apiUrl}/tasks/seed`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => this.fetchTasks(),
      error: err => console.error('❌ Failed to seed tasks', err)
    });
  }

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}
