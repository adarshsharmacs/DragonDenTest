import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntelligentRoadmapComponent } from './intelligent-roadmap.component';

describe('IntelligentRoadmapComponent', () => {
  let component: IntelligentRoadmapComponent;
  let fixture: ComponentFixture<IntelligentRoadmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntelligentRoadmapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IntelligentRoadmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
