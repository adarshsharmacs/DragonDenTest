
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Trade {
    id: string;
    client: string;
    asset: string;
    amount: number;
    currency: string;
    timestamp: Date;
    riskLevel: 'Low' | 'Medium' | 'High';
    status: 'Settled' | 'Pending' | 'Failed';
}

export interface ClientProfile {
    id: string;
    name: string;
    region: string;
    tier: 'Platinum' | 'Gold' | 'Silver';
    activeTrades: number;
}

export interface SystemHealth {
    status: 'Healthy' | 'Warning' | 'Critical';
    latencyMs: number;
    activeFeeds: number;
    failedFeeds: number;
}

@Injectable({
    providedIn: 'root'
})
export class MockDataService {

    constructor() { }

    getTrades(): Observable<Trade[]> {
        const trades: Trade[] = [
            { id: 'TRD-2024-001', client: 'Alpha Hedge Fund', asset: 'USD/EUR', amount: 1500000, currency: 'USD', timestamp: new Date(), riskLevel: 'Low', status: 'Settled' },
            { id: 'TRD-2024-002', client: 'Beta Capital', asset: 'AAPL', amount: 50000, currency: 'USD', timestamp: new Date(Date.now() - 3600000), riskLevel: 'High', status: 'Pending' },
            { id: 'TRD-2024-003', client: 'Gamma Corp', asset: 'BTC/USD', amount: 250000, currency: 'USD', timestamp: new Date(Date.now() - 7200000), riskLevel: 'Medium', status: 'Settled' },
            { id: 'TRD-2024-004', client: 'Delta Investments', asset: 'GOOGL', amount: 1200000, currency: 'USD', timestamp: new Date(Date.now() - 10000000), riskLevel: 'Low', status: 'Settled' },
            { id: 'TRD-2024-005', client: 'Epsilon Partners', asset: 'EUR/GBP', amount: 3000000, currency: 'EUR', timestamp: new Date(Date.now() - 14000000), riskLevel: 'High', status: 'Failed' },
            { id: 'TRD-2024-006', client: 'Zeta Global', asset: 'TSLA', amount: 75000, currency: 'USD', timestamp: new Date(Date.now() - 400000), riskLevel: 'Medium', status: 'Pending' },
        ];
        return of(trades);
    }

    getClients(): Observable<ClientProfile[]> {
        const clients: ClientProfile[] = [
            { id: 'CL-001', name: 'Alpha Hedge Fund', region: 'NA', tier: 'Platinum', activeTrades: 124 },
            { id: 'CL-002', name: 'Beta Capital', region: 'EU', tier: 'Gold', activeTrades: 45 },
            { id: 'CL-003', name: 'Gamma Corp', region: 'APAC', tier: 'Silver', activeTrades: 12 },
        ];
        return of(clients);
    }

    getSystemHealth(): Observable<SystemHealth> {
        return of({
            status: 'Healthy',
            latencyMs: 45,
            activeFeeds: 12,
            failedFeeds: 0
        });
    }
}
