import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopSectionCustComponent } from './top-section-cust.component';

describe('TopSectionCustComponent', () => {
  let component: TopSectionCustComponent;
  let fixture: ComponentFixture<TopSectionCustComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopSectionCustComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopSectionCustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
