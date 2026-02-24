
import { Component, ElementRef, ViewChild, AfterViewChecked, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiAnalystService, AiResponse } from '../../../services/ai-analyst.service';
import { DataVisualizationComponent } from '../data-visualization/data-visualization.component';
import { LucideAngularModule, Send, Bot, User, Sparkles } from 'lucide-angular';

interface ChatMessage {
  sender: 'user' | 'ai';
  content: AiResponse;
  timestamp: Date;
}

@Component({
  selector: 'app-chat-interface',
  standalone: true,
  imports: [CommonModule, FormsModule, DataVisualizationComponent, LucideAngularModule],
  template: `
    <div class="fixed bottom-6 right-6 w-[450px] h-[600px] flex flex-col glass rounded-2xl shadow-2xl overflow-hidden border border-white/40 z-[9999] transition-all duration-300 transform"
         [class.translate-y-[110%]]="!isOpen"
         [class.translate-y-0]="isOpen">
      
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex justify-between items-center shadow-md">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-white/20 rounded-full">
            <lucide-icon [img]="icons.Sparkles" class="w-5 h-5 text-yellow-300"></lucide-icon>
          </div>
          <div>
            <h2 class="font-bold text-lg">AI Analyst</h2>
            <p class="text-xs text-blue-100 opacity-80">Mid Office Intelligence</p>
          </div>
        </div>
        <button (click)="toggleChat()" class="text-white/80 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Messages Area -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-white/40 backdrop-blur-sm" #scrollContainer>
        
        <div *ngIf="messages.length === 0" class="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-4 py-8">
          <div class="p-4 bg-white/50 rounded-full shadow-lg animate-pulse-glow mb-2">
             <lucide-icon [img]="icons.Bot" class="w-10 h-10 text-indigo-500"></lucide-icon>
          </div>
          
          <div *ngIf="!selectedRole" class="space-y-4 w-full px-8 animate-fade-in-up">
              <h3 class="font-bold text-gray-700">Select your role to get started:</h3>
              <div class="grid grid-cols-2 gap-2">
                  <button *ngFor="let role of roles" (click)="selectRole(role)" 
                          class="p-2 text-xs bg-white/60 hover:bg-white hover:text-indigo-600 border border-transparent hover:border-indigo-100 rounded-lg transition-all shadow-sm text-gray-600 font-medium">
                      {{ role }}
                  </button>
              </div>
          </div>

          <div *ngIf="selectedRole" class="space-y-4 w-full px-6 animate-fade-in-up">
              <div class="flex items-center justify-between">
                  <h3 class="font-bold text-gray-700 text-sm">Suggested for {{ selectedRole }}:</h3>
                  <button (click)="selectedRole = ''" class="text-xs text-indigo-500 hover:underline">Change Role</button>
              </div>
              <div class="flex flex-col gap-2">
                  <button *ngFor="let q of roleQuestions" (click)="quickAsk(q)" 
                          class="p-3 text-left text-xs bg-white/70 hover:bg-white border border-indigo-50 hover:border-indigo-200 rounded-xl transition-all shadow-sm hover:shadow-md text-gray-700">
                      "{{ q }}"
                  </button>
              </div>
          </div>
        </div>

        <div *ngFor="let msg of messages" class="flex gap-3" [ngClass]="{'flex-row-reverse': msg.sender === 'user'}">
          
          <!-- Avatar -->
          <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
               [ngClass]="msg.sender === 'ai' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-600'">
            <lucide-icon [img]="msg.sender === 'ai' ? icons.Bot : icons.User" class="w-5 h-5"></lucide-icon>
          </div>

          <!-- Message Bubble -->
          <div class="max-w-[85%]">
            <div [ngClass]="msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none'"
                 class="p-3 rounded-2xl shadow-sm text-sm">
              <ng-container *ngIf="msg.sender === 'user'">
                {{ msg.content.text }}
              </ng-container>
              <ng-container *ngIf="msg.sender === 'ai'">
                <app-data-visualization [type]="msg.content.type" [data]="msg.content.data" [text]="msg.content.text"></app-data-visualization>
              </ng-container>
            </div>
             <div class="text-[10px] text-gray-400 mt-1" [ngClass]="{'text-right': msg.sender === 'user'}">
              {{ msg.timestamp | date:'shortTime' }}
            </div>
          </div>
        </div>
        
        <!-- Loading Indicator -->
        <div *ngIf="isLoading" class="flex gap-3">
           <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
             <lucide-icon [img]="icons.Bot" class="w-5 h-5"></lucide-icon>
           </div>
           <div class="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
             <div class="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
             <div class="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
             <div class="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
           </div>
        </div>

      </div>

      <!-- Input Area -->
      <div class="p-4 bg-white/80 border-t border-white/50">
        <form (submit)="sendMessage()" class="relative">
          <input type="text" [(ngModel)]="currentInput" name="userInput" 
                 placeholder="Ask a question about your data..." 
                 class="w-full pl-4 pr-12 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-inner placeholder-gray-400 text-sm"
                 [disabled]="isLoading">
          <button type="submit" 
                  [disabled]="!currentInput.trim() || isLoading"
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md">
            <lucide-icon [img]="icons.Send" class="w-4 h-4"></lucide-icon>
          </button>
        </form>
      </div>
    </div>

    <!-- Toggle Button (Floating Action Button) -->
    <button *ngIf="!isOpen" (click)="toggleChat()" id="ai-analyst-trigger"
            class="fixed bottom-6 right-6 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all duration-300 flex items-center gap-3 px-5 py-3 z-[9999] animate-bounce-slow group">
       <lucide-icon [img]="icons.Sparkles" class="w-6 h-6"></lucide-icon>
       <span class="font-semibold text-sm">AI Analyst</span>
    </button>
  `,
  styles: [`
    .animate-bounce-slow {
      animation: bounce 3s infinite;
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  `]
})
export class ChatInterfaceComponent implements AfterViewChecked, OnInit {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  readonly icons = { Send, Bot, User, Sparkles };
  isOpen = false;
  currentInput = '';
  isLoading = false;
  messages: ChatMessage[] = [];

  roles: string[] = [];
  selectedRole = '';
  roleQuestions: string[] = [];

  constructor(private aiService: AiAnalystService) { }

  ngOnInit() {
    this.roles = this.aiService.getRoles();
    this.aiService.chatOpen$.subscribe(isOpen => {
      this.isOpen = isOpen;
    });

    this.aiService.suggestedQuery$.subscribe(query => {
      if (query) {
        this.currentInput = query;
        // Optionally auto-send if you want, but pre-filling is safer
      }
    });
  }

  selectRole(role: string) {
    this.selectedRole = role;
    this.roleQuestions = this.aiService.getQuestionsForRole(role);
  }

  toggleChat() {
    this.aiService.toggleChat();
  }

  quickAsk(query: string) {
    this.currentInput = query;
    this.sendMessage();
  }

  sendMessage() {
    if (!this.currentInput.trim() || this.isLoading) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      content: { text: this.currentInput, type: 'text' },
      timestamp: new Date()
    };
    this.messages.push(userMsg);

    const query = this.currentInput;
    this.currentInput = '';
    this.isLoading = true;
    this.scrollToBottom();

    this.aiService.processQuery(query).subscribe({
      next: (response) => {
        const aiMsg: ChatMessage = {
          sender: 'ai',
          content: response,
          timestamp: new Date()
        };
        this.messages.push(aiMsg);
        this.isLoading = false;
        this.scrollToBottom();
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
}
