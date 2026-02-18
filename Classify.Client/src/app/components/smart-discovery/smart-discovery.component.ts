import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search, FileText, Database, Code, ChevronRight, ChevronDown, Sparkles } from 'lucide-angular';

@Component({
  selector: 'app-smart-discovery',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './smart-discovery.component.html',
  styleUrl: './smart-discovery.component.css'
})
export class SmartDiscoveryComponent {
  searchText = '';
  showAnalysis = false;
  readonly icons = { Search, FileText, Database, Code, ChevronRight, ChevronDown, Sparkles };

  matchedReports = [
    { name: 'ISI_Cash_Master_v2', type: 'Report', description: 'Daily cash positions across accounts.' },
    { name: 'Liquidity_Daily_Snapshot', type: 'Report', description: 'Aggregated liquidity metrics.' }
  ];

  dataOrigins = ['BFS_ACCOUNT', 'TRADE_HIST', 'CUST_MASTER'];

  metadataTree = [
    {
      name: 'World Net',
      expanded: false,
      children: [
        { name: 'Quickfiles', type: 'Table' },
        { name: 'TSL', type: 'Table' },
        { name: 'RDC', type: 'Table' }
      ]
    },
    {
      name: 'Mid Office Data',
      type: 'schema',
      expanded: true,
      children: [
        { name: 'account', type: 'table' },
        { name: 'transaction', type: 'table' },
        { name: 'client', type: 'table' }
      ]
    },
    {
      name: 'Quick Reports',
      type: 'schema',
      expanded: false,
      children: [
        { name: 'Quickfiles', type: 'table' },
        { name: 'master', type: 'table' }
      ]
    }
  ];

  onSearch() {
    if (this.searchText.trim()) {
      this.showAnalysis = true;
    }
  }

  toggleNode(node: any) {
    node.expanded = !node.expanded;
  }
}
