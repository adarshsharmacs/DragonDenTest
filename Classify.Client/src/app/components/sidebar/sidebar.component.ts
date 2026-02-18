import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, Database, Brain, Calendar, Settings, LayoutDashboard, Globe, HelpCircle } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  readonly icons = { Database, Brain, Calendar, Settings, LayoutDashboard, Globe, HelpCircle };
  currentLang = 'EN';

  toggleLanguage() {
    this.currentLang = this.currentLang === 'EN' ? 'FR' : 'EN';
    // Ideally this would trigger a translation service
  }
}
