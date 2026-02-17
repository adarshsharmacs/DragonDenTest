
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-data-visualization',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="w-full animate-slide-in">
      
      <!-- Text Response -->
      <div *ngIf="type === 'text'" class="p-4 bg-white/80 rounded-lg shadow-sm">
        <p class="text-gray-800">{{ text }}</p>
      </div>

      <!-- Card Response -->
      <div *ngIf="type === 'card'" class="glass-panel p-6 rounded-xl flex flex-col items-center justify-center text-center">
        <h3 class="text-lg font-semibold text-gray-500 mb-2">{{ data.title }}</h3>
        <div class="text-4xl font-bold text-gray-800 mb-1" [ngStyle]="{'color': data.color}">{{ data.value }}</div>
        <div class="text-sm text-gray-500 font-medium">{{ data.subValue || data.trend }}</div>
      </div>

      <!-- Table Response -->
      <div *ngIf="type === 'table'" class="glass-panel rounded-xl overflow-hidden">
        <div class="p-4 bg-gray-50/50 border-b border-gray-100">
          <h3 class="font-semibold text-gray-700">{{ text }}</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-xs text-gray-500 uppercase bg-gray-50/50">
              <tr>
                <th *ngFor="let key of getKeys(data[0])" class="px-6 py-3">{{ key }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of data" class="bg-white/40 border-b border-gray-100 last:border-0 hover:bg-white/60 transition-colors">
                <td *ngFor="let key of getKeys(row)" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {{ row[key] }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `,
    styles: [`
    /* Additional component-specific styles if needed */
  `]
})
export class DataVisualizationComponent {
    @Input() type: 'text' | 'table' | 'card' | 'chart' = 'text';
    @Input() data: any;
    @Input() text: string = '';

    getKeys(obj: any): string[] {
        return obj ? Object.keys(obj) : [];
    }
}
