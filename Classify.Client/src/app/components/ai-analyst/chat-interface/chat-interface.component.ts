
import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
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
            <lucide-icon name="sparkles" class="w-5 h-5 text-yellow-300"></lucide-icon>
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
        
        <div *ngIf="messages.length === 0" class="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-4">
          <div class="p-4 bg-white/50 rounded-full shadow-lg animate-pulse-glow">
             <lucide-icon name="bot" class="w-12 h-12 text-indigo-500"></lucide-icon>
          </div>
          <p class="max-w-[200px]">Ask me about Trade Volumes, Risk Levels, or System Health.</p>
           <div class="flex flex-wrap justify-center gap-2">
            <button (click)="quickAsk('Show high risk trades')" class="px-3 py-1 bg-white/60 hover:bg-white rounded-full text-xs shadow-sm transition-all border border-indigo-100">High Risk Trades</button>
            <button (click)="quickAsk('System health status')" class="px-3 py-1 bg-white/60 hover:bg-white rounded-full text-xs shadow-sm transition-all border border-indigo-100">System Status</button>
          </div>
        </div>

        <div *ngFor="let msg of messages" class="flex gap-3" [ngClass]="{'flex-row-reverse': msg.sender === 'user'}">
          
          <!-- Avatar -->
          <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
               [ngClass]="msg.sender === 'ai' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-600'">
            <lucide-icon [name]="msg.sender === 'ai' ? 'bot' : 'user'" class="w-5 h-5"></lucide-icon>
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
             <lucide-icon name="bot" class="w-5 h-5"></lucide-icon>
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
            <lucide-icon name="send" class="w-4 h-4"></lucide-icon>
          </button>
        </form>
      </div>
    </div>

    <!-- Toggle Button (Floating Action Button) -->
    <button *ngIf="!isOpen" (click)="toggleChat()" id="ai-analyst-trigger"
            class="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 hover:scale-110 transition-all duration-300 flex items-center justify-center z-[9999] animate-bounce-slow">
       <lucide-icon name="sparkles" class="w-7 h-7"></lucide-icon>
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
export class ChatInterfaceComponent implements AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  isOpen = false;
  currentInput = '';
  isLoading = false;
  messages: ChatMessage[] = [];

  constructor(private aiService: AiAnalystService) { }

  toggleChat() {
    this.isOpen = !this.isOpen;
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
