import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightSectionFishComponent } from './right-section-fish.component';

describe('RightSectionFishComponent', () => {
  let component: RightSectionFishComponent;
  let fixture: ComponentFixture<RightSectionFishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightSectionFishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightSectionFishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
