import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartDiscoveryComponent } from './smart-discovery.component';

describe('SmartDiscoveryComponent', () => {
  let component: SmartDiscoveryComponent;
  let fixture: ComponentFixture<SmartDiscoveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmartDiscoveryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SmartDiscoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
