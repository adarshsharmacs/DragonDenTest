
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

      <!-- Scorecard Response -->
      <div *ngIf="type === 'scorecard'" class="glass-panel p-6 rounded-2xl flex flex-col gap-6 bg-gradient-to-br from-indigo-50/50 to-white/80 border border-white/60 shadow-xl">
        <div class="flex items-center justify-between">
          <div class="text-left">
            <h3 class="text-xl font-bold text-gray-800">Pitch Scorecard</h3>
            <p class="text-sm text-gray-500">CIBC Intelligence Suite Evaluation</p>
          </div>
          <div class="flex flex-col items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-inner border border-indigo-100">
            <span class="text-3xl font-black text-indigo-600">{{ data.totalScore }}</span>
            <span class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Score</span>
          </div>
        </div>

        <div class="space-y-4">
          <div *ngFor="let cat of data.categories" class="space-y-1">
            <div class="flex justify-between text-xs font-bold text-gray-600">
              <span>{{ cat.name }}</span>
              <span class="text-indigo-600">{{ cat.score }}/{{ cat.max }}</span>
            </div>
            <div class="h-2 w-full bg-gray-200/50 rounded-full overflow-hidden shadow-inner">
              <div class="h-full bg-gradient-to-r from-indigo-400 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                   [style.width.%]="(cat.score / cat.max) * 100"></div>
            </div>
            <p class="text-[10px] text-gray-500 italic">{{ cat.feedback }}</p>
          </div>
        </div>

        <div class="p-4 bg-indigo-600/5 rounded-xl border border-indigo-100/50">
          <h4 class="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Pro Tips to Win
          </h4>
          <ul class="space-y-2">
            <li *ngFor="let rec of data.recommendations" class="text-xs text-gray-700 flex gap-2">
              <span class="text-indigo-500 font-bold">•</span>
              {{ rec }}
            </li>
          </ul>
        </div>
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
    .glass-panel {
      background: rgba(255, 255, 255, 0.4);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.4);
    }
  `]
})
export class DataVisualizationComponent {
  @Input() type: 'text' | 'table' | 'card' | 'chart' | 'scorecard' = 'text';
  @Input() data: any;
  @Input() text: string = '';

  getKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
}
