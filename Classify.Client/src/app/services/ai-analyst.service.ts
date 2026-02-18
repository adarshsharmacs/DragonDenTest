
import { Injectable } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
import { MockDataService, Trade, SystemHealth } from './mock-data.service';

export interface AiResponse {
    text: string;
    type: 'text' | 'table' | 'card' | 'chart';
    data?: any;
}

@Injectable({
    providedIn: 'root'
})
export class AiAnalystService {

    private roleQuestions: { [key: string]: string[] } = {
        'Project Manager': [
            'What is the impact of adding a new ISI Account range on existing reports?',
            'Show me the project status for the Q3 release.',
            'Are there any improved efficiencies in the trade processing workflow?'
        ],
        'Business Analyst': [
            'I want to understand the flow of Market Mate application.',
            'Show me the data lineage for the Client Master schema.',
            'What are the dependencies for the new derivative product launch?'
        ],
        'Business Operations': [
            'How many trades are pending manual review?',
            'Show me the daily reconciliation report for yesterday.',
            'Which accounts have the highest cash balance discrepancies?'
        ],
        'Product Owners': [
            'What is the adoption rate of the new dashboard?',
            'Show me the user feedback summary for the last sprint.',
            'Are we meeting the SLA for report generation?'
        ],
        'Technology Stakeholders': [
            'What is the current system uptime?',
            'Are there any performance bottlenecks in the database?',
            'Show me the API latency trends for the last 24 hours.'
        ],
        'Production Support': [
            'I am a Production Support and want to know how many zena jobs failed today.',
            'Show me the error logs for the last hour.',
            'Are there any active alerts for the trading engine?'
        ],
        'Application Delivery': [
            'What is the build status for the latest release?',
            'Show me the deployment pipeline metrics.',
            'Are there any flaky tests in the regression suite?'
        ],
        'BSA': [
            'What data fields are required for the new compliance report?',
            'Show me the mapping document for the legacy migration.',
            'Validate the schema for the new transaction feed.'
        ],
        'WN Applications': [
            'What is the status of the World Net gateway?',
            'Show me the transaction volume for World Net today.',
            'Are there any connectivity issues with the external payment providers?'
        ]
    };

    constructor(private mockDataService: MockDataService) { }

    getRoles(): string[] {
        return Object.keys(this.roleQuestions);
    }

    getQuestionsForRole(role: string): string[] {
        return this.roleQuestions[role] || [];
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
