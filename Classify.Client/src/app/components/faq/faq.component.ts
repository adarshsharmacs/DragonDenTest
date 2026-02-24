import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, HelpCircle, ChevronDown, ChevronRight } from 'lucide-angular';
import { AiAnalystService } from '../../services/ai-analyst.service';

interface FAQItem {
    question: string;
    answer: string;
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
            const faqs = this.aiService.getFaqsForRole(role);
            this.faqsByRole[role] = faqs.map(f => ({ ...f, expanded: false }));
        });
        // Select Judges by default if available, otherwise first role
        if (this.roles.includes('Judges')) {
            this.selectedRole = 'Judges';
        } else if (this.roles.length > 0) {
            this.selectedRole = this.roles[0];
        }
    }

    selectRole(role: string) {
        this.selectedRole = role;
    }

    toggleFAQ(faq: FAQItem) {
        faq.expanded = !faq.expanded;
    }

    askAiAnalyst(faq: FAQItem) {
        this.aiService.askAi(faq.question);
    }

    viewRelatedDocs() {
        window.open('https://cibc.sharepoint.com/:w:/r/sites/pmowm/PWM/FISPhase2/Shared%2Documents/Classify/CIBC_ClassifyIntelligence_Suite_Proposal.docx?d=wf4f5843bd1f849309a831d15bfef7190&csf=1&web=1&e=xQbmom', '_blank');
    }

    get currentFAQs(): FAQItem[] {
        return this.faqsByRole[this.selectedRole] || [];
    }
}
