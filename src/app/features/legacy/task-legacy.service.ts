// 📁 src/app/features/legacy/task-legacy.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../../shared/task.model';
import { environment } from '../../../environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskLegacyService {
  constructor(private http: HttpClient) {}

  // 📦 Fetch tasks with pagination
  fetchTasks(page = 1, limit = 20): Observable<{ tasks: Task[]; total: number; page: number; pages: number }> {
    return this.http.get<{ tasks: Task[]; total: number; page: number; pages: number }>(
      `${environment.apiUrl}/tasks?page=${page}&limit=${limit}`,
      { headers: this.authHeader() }
    );
  }

  // ➕ Create a new task
  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(`${environment.apiUrl}/tasks`, task, {
      headers: this.authHeader()
    });
  }

  // 🗑 Delete task by ID
  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/tasks/${id}`, {
      headers: this.authHeader()
    });
  }

  // ✏️ Update task (used for toggle and edit)
  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${environment.apiUrl}/tasks/${task._id}`, task, {
      headers: this.authHeader()
    });
  }

  // 🔐 Authorization helper
  private authHeader() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }
}
