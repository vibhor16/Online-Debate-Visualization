import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightSectionCustComponent } from './right-section-cust.component';

describe('RightSectionCustComponent', () => {
  let component: RightSectionCustComponent;
  let fixture: ComponentFixture<RightSectionCustComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightSectionCustComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightSectionCustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
