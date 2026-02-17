
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface TourStep {
    targetId?: string; // ID of the element to highlight. If null, it's a modal (e.g., Welcome)
    title: string;
    content: string;
    position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

@Injectable({
    providedIn: 'root'
})
export class TourService {
    private steps: TourStep[] = [
        {
            title: 'Welcome to Classify',
            content: 'Experience the future of Mid Office Intelligence. This dashboard gives you real-time insights into trading information, and client activities.',
            position: 'center'
        },
        {
            targetId: 'smart-discovery-search',
            title: 'Smart Discovery',
            content: 'On the Discovery page, use this search bar to find reports, trace data, or estimate dev effort.',
            position: 'bottom'
        },
        {
            targetId: 'ai-analyst-trigger',
            title: 'Meet Your AI Analyst',
            content: 'Need answers fast? Just ask! Click here to talk to your data, generate reports, and uncover risks/dependencies instantly.',
            position: 'left' // Since the button is bottom-right, tooltip should be to its left or top
        },
        {
            title: 'Ready to Explore?',
            content: 'Jump in and start optimizing your workflow today.',
            position: 'center'
        }
    ];

    private currentStepIndexSubject = new BehaviorSubject<number>(-1); // -1 means tour not active
    currentStep$ = this.currentStepIndexSubject.asObservable();

    constructor() { }

    startTour() {
        this.currentStepIndexSubject.next(0);
    }

    next() {
        const nextIndex = this.currentStepIndexSubject.value + 1;
        if (nextIndex < this.steps.length) {
            this.currentStepIndexSubject.next(nextIndex);
        } else {
            this.endTour();
        }
    }

    endTour() {
        this.currentStepIndexSubject.next(-1);
    }

    getCurrentStep(): TourStep | null {
        const index = this.currentStepIndexSubject.value;
        if (index >= 0 && index < this.steps.length) {
            return this.steps[index];
        }
        return null;
    }

    hasNext(): boolean {
        return this.currentStepIndexSubject.value < this.steps.length - 1;
    }
}
