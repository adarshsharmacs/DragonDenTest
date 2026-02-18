import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, HelpCircle, ChevronDown, ChevronRight } from 'lucide-angular';
import { AiAnalystService } from '../../services/ai-analyst.service';

interface FAQItem {
    question: string;
    expanded: boolean;
}

@Component({
    selector: 'app-faq',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './faq.component.html',
    styleUrl: './faq.component.css'
})
export class FaqComponent implements OnInit {
    readonly icons = { HelpCircle, ChevronDown, ChevronRight };
    roles: string[] = [];
    selectedRole = '';
    faqsByRole: { [key: string]: FAQItem[] } = {};

    constructor(private aiService: AiAnalystService) { }

    ngOnInit() {
        this.roles = this.aiService.getRoles();
        // Initialize FAQs for each role
        this.roles.forEach(role => {
            const questions = this.aiService.getQuestionsForRole(role);
            this.faqsByRole[role] = questions.map(q => ({ question: q, expanded: false }));
        });
        // Select first role by default
        if (this.roles.length > 0) {
            this.selectedRole = this.roles[0];
        }
    }

    selectRole(role: string) {
        this.selectedRole = role;
    }

    toggleFAQ(faq: FAQItem) {
        faq.expanded = !faq.expanded;
    }

    get currentFAQs(): FAQItem[] {
        return this.faqsByRole[this.selectedRole] || [];
    }
}
