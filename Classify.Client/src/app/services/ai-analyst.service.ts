
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

    constructor(private mockDataService: MockDataService) { }

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
