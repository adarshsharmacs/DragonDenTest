import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatInterfaceComponent } from './components/ai-analyst/chat-interface/chat-interface.component';
import { TourOverlayComponent } from './components/tour/tour-overlay.component';
import { TourService } from './services/tour.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChatInterfaceComponent, TourOverlayComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Classify.Client';

  constructor(private tourService: TourService) { }

  ngOnInit() {
    // Auto-start tour for demo purposes
    // In a real app, check localStorage if user has seen it
    setTimeout(() => {
      this.tourService.startTour();
    }, 1000); // Slight delay to ensure app is loaded
  }
}
