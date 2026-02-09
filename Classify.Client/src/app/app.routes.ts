import { Routes } from '@angular/router';
import { ShellComponent } from './components/shell/shell.component';
import { SmartDiscoveryComponent } from './components/smart-discovery/smart-discovery.component';
import { IntelligentRoadmapComponent } from './components/intelligent-roadmap/intelligent-roadmap.component';

export const routes: Routes = [
    {
        path: '',
        component: ShellComponent,
        children: [
            { path: '', redirectTo: 'discovery', pathMatch: 'full' },
            { path: 'discovery', component: SmartDiscoveryComponent },
            { path: 'roadmap', component: IntelligentRoadmapComponent }
        ]
    }
];
