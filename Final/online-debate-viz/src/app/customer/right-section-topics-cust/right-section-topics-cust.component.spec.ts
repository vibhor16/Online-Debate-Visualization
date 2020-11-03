import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightSectionTopicsCustComponent } from './right-section-topics-cust.component';

describe('RightSectionTopicsCustComponent', () => {
  let component: RightSectionTopicsCustComponent;
  let fixture: ComponentFixture<RightSectionTopicsCustComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightSectionTopicsCustComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightSectionTopicsCustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
