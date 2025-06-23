// src/app/shared/performance-profiler.component.ts
import { Component, DoCheck, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';

@Component({
  selector: 'app-performance-profiler',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `
    <mat-card class="profiler-card">
      <h3>🧪 Performance Profiler</h3>
      <p>
        <strong>Change Detection Runs:</strong> {{ renderCount }}
      </p>
      <p style="font-size: 0.85rem; color: #666">
        This counter increases every time Angular runs change detection in this component.
        Add this component to any view to visually compare legacy vs signal performance.
      </p>
    </mat-card>
  `,
  styles: [
    `
    .profiler-card {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 280px;
      z-index: 9999;
      background: #fff3e0;
      border-left: 5px solid #ff9800;
    }
    `
  ]
})
export class PerformanceProfilerComponent implements DoCheck {
  renderCount = 0;

  ngDoCheck() {
    this.renderCount++;
    // You can also log to console if needed
    // console.log('Change Detection Cycle:', this.renderCount);
  }
}
