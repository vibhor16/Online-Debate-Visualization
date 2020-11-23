import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RankEvolutionComponent } from './rank-evolution.component';

describe('RankEvolutionComponent', () => {
  let component: RankEvolutionComponent;
  let fixture: ComponentFixture<RankEvolutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RankEvolutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RankEvolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
