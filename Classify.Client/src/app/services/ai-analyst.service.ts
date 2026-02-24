
import { Injectable } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
import { MockDataService, Trade, SystemHealth } from './mock-data.service';

export interface FAQItem {
    question: string;
    answer: string;
}

export interface AiResponse {
    text: string;
    type: 'text' | 'table' | 'card' | 'chart' | 'scorecard';
    data?: any;
}

@Injectable({
    providedIn: 'root'
})
export class AiAnalystService {

    private roleFaqs: { [key: string]: FAQItem[] } = {
        'Judges': [
            { question: 'What is \"Discovery Debt\"?', answer: 'Within Wealth Management, we define Discovery Debt as the efficiency loss (approx. 30% of capacity) caused by manual research through 1,000+ reports and BFS tables. Classify eliminates this bottleneck.' },
            { question: 'What is the financial impact of this issue?', answer: 'We estimate an annual loss of $280,000 in high-value productivity due to technical capacity being spent on discovery and impact analysis rather than delivery.' },
            { question: 'How does the Smart Discovery Agent work?', answer: 'It uses a Retrieval-Augmented Generation (RAG) architecture to transform report documentation and SQL metadata into a searchable semantic knowledge base, providing actionable technical recommendations.' },
            { question: 'What is the Intelligent Roadmap?', answer: 'It is a live, stakeholder-facing module that provides real-time operational transparency by integrating intake, execution, and availability data from Jira, Azure DevOps, and Outlook.' },
            { question: 'How is team velocity calculated?', answer: 'The engine uses automated webhooks from Jira and ADO to continuously calculate team velocity and re-forecast delivery timelines based on actual capacity rather than static estimates.' },
            { question: 'How do you ensure data governance?', answer: 'Classify processes metadata only—no client data or PII—ensuring full compliance with CIBC security standards while leveraging existing cloud infrastructure.' },
            { question: 'What is the estimated ROI?', answer: 'By reducing discovery effort by 45%, we reclaim 2,600+ hours of delivery capacity annually, achieving payback within months of implementation.' }
        ],
        'Project Manager': [
            { question: 'What is the impact of adding a new ISI Account range on existing reports?', answer: 'The Smart Discovery Agent can analyze the account range dependencies across all 1,000+ Quick Reports to identify which schemas need updating.' },
            { question: 'Show me the project status for the Q3 release.', answer: 'The Intelligent Roadmap provides real-time visibility by integrating Jira/ADO webhooks, showing we are currently 68% complete for Q3.' },
            { question: 'Are there any improved efficiencies in the trade processing workflow?', answer: 'By automating the discovery layer, we reduce the specification churn by 45%, allowing the team to focus on processing logic.' }
        ],
        'Business Analyst': [
            { question: 'I want to understand the flow of Market Mate application.', answer: 'Market Mate flows through the BFS core layer before being aggregated into the Wealth Management reporting suite.' },
            { question: 'Show me the data lineage for the Client Master schema.', answer: 'Client Master originates in the Legacy Core and is mapped to BFS_TABLE_A and BFS_TABLE_B for reporting.' },
            { question: 'What are the dependencies for the new derivative product launch?', answer: 'New products depend on the Product Master update and the Transaction History indexing.' }
        ],
        'BSA': [
            { question: 'What data fields are required for the new compliance report?', answer: 'Required fields include Account_ID, Tax_Status, and YTD_Contribution from the TFSA_History table.' },
            { question: 'Show me the mapping document for the legacy migration.', answer: 'The mapping document links 45 legacy fields to the new Smart Discovery metadata schema.' },
            { question: 'Validate the schema for the new transaction feed.', answer: 'The transaction feed schema is currently 95% aligned with BFS standards.' }
        ],
        'Competition Team': [
            { question: 'Evaluate our project pitch for the judges.', answer: 'Analysis complete: Your current readiness score is 91/100. Focus on quantifying Operational Risk to reach 100.' },
            { question: 'What are the judging criteria for this competition?', answer: 'Judges focus on: Problem Statement, Magnitude, Proposed Solution, Implementation Plan, and CIBC Themes.' },
            { question: 'How can we improve our solution for the CIBC Intelligence Suite?', answer: 'Incorporate more direct Jira webhooks for real-time velocity tracking in Module 2.' }
        ]
    };

    constructor(private mockDataService: MockDataService) { }

    getRoles(): string[] {
        return Object.keys(this.roleFaqs);
    }

    getFaqsForRole(role: string): FAQItem[] {
        return this.roleFaqs[role] || [];
    }

    getQuestionsForRole(role: string): string[] {
        return (this.roleFaqs[role] || []).map(f => f.question);
    }

    processQuery(query: string): Observable<AiResponse> {
        const lowerQuery = query.toLowerCase();

        // Simulate "thinking" time
        const thinkingDelay = 1500;

        if (lowerQuery.includes('high risk') || lowerQuery.includes('risk')) {
            return this.mockDataService.getTrades().pipe(
                delay(thinkingDelay),
                map(trades => {
                    const highRisk = trades.filter(t => t.riskLevel === 'High' || t.riskLevel === 'Medium');
                    return {
                        text: `I found ${highRisk.length} trades flagged as Medium or High risk.`,
                        type: 'table',
                        data: highRisk
                    };
                })
            );
        }

        if (lowerQuery.includes('volume') || lowerQuery.includes('total')) {
            return this.mockDataService.getTrades().pipe(
                delay(thinkingDelay),
                map(trades => {
                    const totalVolume = trades.reduce((acc, t) => acc + t.amount, 0);
                    return {
                        text: `The total trade volume processed today is significantly high.`,
                        type: 'card',
                        data: {
                            title: 'Total Volume',
                            value: `$${(totalVolume / 1000000).toFixed(2)}M`,
                            trend: '+12% vs Yesterday'
                        }
                    };
                })
            );
        }

        if (lowerQuery.includes('evaluate') || lowerQuery.includes('pitch') || lowerQuery.includes('readiness')) {
            return of({
                text: "I've analyzed your project proposal against the CIBC judging criteria. Your pitch is extremely strong, especially in identifying 'Discovery Debt' as a key bottleneck.",
                type: 'scorecard',
                data: {
                    totalScore: 91,
                    categories: [
                        { name: 'Problem Statement', score: 14, max: 15, feedback: 'Concise and very relevant. High impact.' },
                        { name: 'Magnitude of Issue', score: 23, max: 25, feedback: 'Great quantification of loss ($280k/annually).' },
                        { name: 'Proposed Solution', score: 28, max: 30, feedback: 'Strong push for RAG and semantic intelligence.' },
                        { name: 'Implementation Plan', score: 12, max: 15, feedback: 'Timeline is clear. Consider detailing cloud costs.' },
                        { name: 'Competition Themes', score: 14, max: 15, feedback: 'Excellent alignment with Automation and Cost Reduction.' }
                    ],
                    recommendations: [
                        "Add a slide specifically on 'Operational Risk' to hit the risk criteria harder.",
                        "Clarify 'Minimal Incremental Costs' with a small breakdown of Azure service estimates.",
                        "Emphasize how the Smart Discovery Agent reduces 'Discovery Debt' from days to minutes."
                    ]
                }
            } as AiResponse).pipe(delay(thinkingDelay));
        }

        if (lowerQuery.includes('judging') || lowerQuery.includes('criteria')) {
            return of({
                text: "The judges will evaluate you on 5 main categories: Problem Statement, Magnitude of Issue, Proposed Solution, Implementation Plan, and alignment with CIBC Themes (Automation, Cost Reduction, etc.).",
                type: 'text'
            } as AiResponse).pipe(delay(thinkingDelay));
        }

        if (lowerQuery.includes('system') || lowerQuery.includes('health') || lowerQuery.includes('status')) {
            return this.mockDataService.getSystemHealth().pipe(
                delay(thinkingDelay),
                map(health => {
                    return {
                        text: `System is currently ${health.status}. All feeds are operational.`,
                        type: 'card',
                        data: {
                            title: 'System Health',
                            value: health.status,
                            subValue: `${health.latencyMs}ms Latency`,
                            color: health.status === 'Healthy' ? 'green' : 'red'
                        }
                    };
                })
            );
        }

        // Default fallback
        const fallbackResponse: AiResponse = {
            text: "I'm not sure I understand that query. Try asking about 'High Risk Trades', 'Total Volume', or 'System Health'.",
            type: 'text'
        };

        return of(fallbackResponse).pipe(delay(thinkingDelay));
    }
}
