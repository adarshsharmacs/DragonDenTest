import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Trello, GitPullRequest, Calendar, Briefcase, Clock, AlertCircle, CheckCircle2 } from 'lucide-angular';

interface Task {
  id: string;
  title: string;
  type: 'jira' | 'ado' | 'outlook';
  status: 'todo' | 'in-progress' | 'done';
  assignee: string;
  dueDate: Date;
  priority: 'normal' | 'high';
  originalDate?: Date;
}

@Component({
  selector: 'app-intelligent-roadmap',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './intelligent-roadmap.component.html',
  styleUrl: './intelligent-roadmap.component.css'
})
export class IntelligentRoadmapComponent {
  velocity = 82;
  readonly icons = { Trello, GitPullRequest, Calendar, Briefcase, Clock, AlertCircle, CheckCircle2 };

  tasks: Task[] = [
    {
      id: 'TASK-1024',
      title: 'Integrate BFS Account Schema',
      type: 'jira',
      status: 'in-progress',
      assignee: 'Regio F.',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
      priority: 'normal'
    },
    {
      id: 'PR-459',
      title: 'ETF Options',
      type: 'ado',
      status: 'todo',
      assignee: 'Nan C.',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 8)),
      priority: 'normal'
    },
    {
      id: 'MTG-001',
      title: 'Stakeholder Review: Phase 1',
      type: 'outlook',
      status: 'todo',
      assignee: 'Team',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
      priority: 'high'
    }
  ];

  togglePriority(task: Task) {
    task.priority = task.priority === 'normal' ? 'high' : 'normal';

    // Simulate AI recalculation
    if (task.priority === 'high') {
      task.originalDate = new Date(task.dueDate);
      // Reduce due date by 2 days effectively accelerating it
      const newDate = new Date(task.dueDate);
      newDate.setDate(newDate.getDate() - 2);
      task.dueDate = newDate;
    } else if (task.originalDate) {
      task.dueDate = task.originalDate;
      task.originalDate = undefined;
    }
  }

  getIconForType(type: string) {
    switch (type) {
      case 'jira': return this.icons.Trello;
      case 'ado': return this.icons.GitPullRequest;
      case 'outlook': return this.icons.Calendar;
      default: return this.icons.Briefcase;
    }
  }
}
