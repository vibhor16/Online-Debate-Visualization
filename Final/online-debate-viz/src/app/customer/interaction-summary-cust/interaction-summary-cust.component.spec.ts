import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractionSummaryCustComponent } from './interaction-summary-cust.component';

describe('InteractionSummaryCustComponent', () => {
  let component: InteractionSummaryCustComponent;
  let fixture: ComponentFixture<InteractionSummaryCustComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteractionSummaryCustComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractionSummaryCustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
