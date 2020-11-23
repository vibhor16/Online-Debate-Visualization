import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RankEvolutionCustComponent } from './rank-evolution-cust.component';

describe('RankEvolutionCustComponent', () => {
  let component: RankEvolutionCustComponent;
  let fixture: ComponentFixture<RankEvolutionCustComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RankEvolutionCustComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RankEvolutionCustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
