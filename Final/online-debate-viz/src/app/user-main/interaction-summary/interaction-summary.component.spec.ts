import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractionSummaryComponent } from './interaction-summary.component';

describe('InteractionSummaryComponent', () => {
  let component: InteractionSummaryComponent;
  let fixture: ComponentFixture<InteractionSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteractionSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractionSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
