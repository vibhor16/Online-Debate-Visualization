import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightSectionFishCustComponent } from './right-section-fish-cust.component';

describe('RightSectionFishCustComponent', () => {
  let component: RightSectionFishCustComponent;
  let fixture: ComponentFixture<RightSectionFishCustComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightSectionFishCustComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightSectionFishCustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
