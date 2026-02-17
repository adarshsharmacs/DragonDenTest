
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourService, TourStep } from '../../services/tour.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tour-overlay',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="currentStep" class="fixed inset-0 z-[10000] flex items-center justify-center transition-opacity duration-300">
      
      <!-- Backdrop with cutout (Simplification: using high z-index overlay and relying on visual focus for now) -->
      <!-- For a true cutout, needed canvas or svg, but here we'll use a semi-transparent dark overlay 
           and highlight the specific element by adding a class or just placing the tooltip near it -->
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" (click)="endTour()"></div>

      <!-- Centered Modal Step -->
      <div *ngIf="!currentStep.targetId" class="relative glass-panel p-8 max-w-lg text-center rounded-2xl animate-scale-in border border-white/20 shadow-2xl">
        <div class="mb-4">
          <span class="text-xs uppercase tracking-wider text-indigo-500 font-bold bg-indigo-50 px-3 py-1 rounded-full">Onboarding</span>
        </div>
        <h2 class="text-3xl font-bold text-gray-800 mb-4">{{ currentStep.title }}</h2>
        <p class="text-gray-600 mb-8 text-lg leading-relaxed">{{ currentStep.content }}</p>
        <button (click)="next()" class="px-8 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
          {{ hasNext ? 'Next' : 'Get Started' }}
        </button>
      </div>

      <!-- Targeted Tooltip Step -->
      <!-- We use a fixed positioned container that calculates position based on target -->
      <div *ngIf="currentStep.targetId" 
           class="absolute transition-all duration-500 ease-out"
           [style.top.px]="tooltipPosition.top"
           [style.left.px]="tooltipPosition.left">
           
           <!-- The Spotlight Circle (Visual Only) -->
           <div class="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-white/20 animate-ping"></div>

           <div class="glass-panel p-6 max-w-sm rounded-xl border border-white/20 shadow-2xl relative animate-slide-in">
              <!-- Arrow/Pointer (simplified) -->
              
              <h3 class="text-xl font-bold text-gray-800 mb-2">{{ currentStep.title }}</h3>
              <p class="text-sm text-gray-600 mb-4">{{ currentStep.content }}</p>
              <div class="flex justify-end gap-2">
                <button (click)="endTour()" class="text-gray-500 text-sm hover:text-gray-800 px-3 py-1">Skip</button>
                <button (click)="next()" class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm shadow hover:bg-indigo-700 transition-colors">
                  {{ hasNext ? 'Next' : 'Finish' }}
                </button>
              </div>
           </div>
      </div>

    </div>
  `,
  styles: [`
    .animate-scale-in {
      animation: scaleIn 0.3s ease-out forwards;
    }
    @keyframes scaleIn {
      from { transform: scale(0.9); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `]
})
export class TourOverlayComponent implements OnInit, OnDestroy {
  currentStep: TourStep | null = null;
  hasNext = false;
  tooltipPosition = { top: 0, left: 0 };
  private sub: Subscription | null = null;

  constructor(private tourService: TourService) { }

  ngOnInit() {
    this.sub = this.tourService.currentStep$.subscribe(stepIndex => {
      this.currentStep = this.tourService.getCurrentStep();
      this.hasNext = this.tourService.hasNext();

      if (this.currentStep?.targetId) {
        // Poll for element existence (fixing race condition on first load)
        let attempts = 0;
        const maxAttempts = 10; // 2 seconds total

        const checkElement = () => {
          const el = document.getElementById(this.currentStep!.targetId!);
          if (el) {
            this.updatePosition();
          } else if (attempts < maxAttempts) {
            attempts++;
            setTimeout(checkElement, 200);
          } else {
            // Final attempt -> will trigger fallback
            this.updatePosition();
          }
        };

        checkElement();
      }
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  next() {
    this.tourService.next();
  }

  endTour() {
    this.tourService.endTour();
  }

  @HostListener('window:resize')
  updatePosition() {
    if (!this.currentStep?.targetId) return;

    const targetId = this.currentStep.targetId;
    const element = document.getElementById(targetId);

    if (!element) {
      // Fallback: If element not found, show as centered modal
      this.currentStep.targetId = undefined;
      return;
    }

    if (element) {
      const rect = element.getBoundingClientRect();

      // Calculate position based on 'position' preference (simplified logic)
      // Defaulting to 'top-left' of the target for now for the chatbot button
      // Adjust offsets as needed
      let top = rect.top;
      let left = rect.left;

      if (this.currentStep.position === 'left') {
        top = rect.top - 20; // Start slightly above the target's top
        left = rect.left - 420; // Shift left by width of card (approx 380px) + gap
      } else if (this.currentStep.position === 'bottom') {
        top = rect.bottom + 20;
        left = rect.left - 150; // Center-ish
      } else if (this.currentStep.position === 'center') {
        // Fallback or specific logic
      }

      // Viewport Boundary Protection
      const viewportHeight = window.innerHeight;
      const estimatedHeight = 300; // Safe estimate for card height
      const padding = 20;

      // If tooltip would go off the bottom, shift it up
      if (top + estimatedHeight > viewportHeight) {
        top = viewportHeight - estimatedHeight - padding;
      }

      // If tooltip goes off the top
      if (top < padding) top = padding;

      // If tooltip goes off the left
      if (left < padding) left = padding;

      this.tooltipPosition = { top, left };
    }
  }
}
