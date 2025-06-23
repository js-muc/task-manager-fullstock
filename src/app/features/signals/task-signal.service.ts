 // src/app/features/signals/task-signal.service.ts

import { Injectable, Signal, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../../shared/task.model';
import { environment } from '../../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class TaskSignalService {
  private readonly baseUrl = `${environment.apiUrl}/tasks`;

  // Internal state
  private readonly _tasks = signal<Task[]>([]);
  private readonly _loading = signal(false);

  // Public signals (readonly)
  readonly tasks: Signal<Task[]> = this._tasks.asReadonly();
  readonly loading: Signal<boolean> = this._loading.asReadonly();

  constructor(private http: HttpClient) {}

  loadTasks(): void {
    this._loading.set(true);
    this.http.get<Task[]>(this.baseUrl).subscribe({
      next: (tasks) => this._tasks.set(tasks),
      error: (err) => {
        console.error('❌ Error loading tasks', err);
        this._tasks.set([]);
      },
      complete: () => this._loading.set(false),
    });
  }

  addTask(task: Partial<Task>): void {
    this.http.post<Task>(this.baseUrl, task).subscribe((newTask) => {
      this._tasks.update((prev) => [newTask, ...prev]);
    });
  }

  deleteTask(id: string): void {
    this.http.delete(`${this.baseUrl}/${id}`).subscribe(() => {
      this._tasks.update((prev) => prev.filter((t) => t._id !== id));
    });
  }
}

