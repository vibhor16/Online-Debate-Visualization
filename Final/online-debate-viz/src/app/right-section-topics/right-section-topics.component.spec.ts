import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightSectionTopicsComponent } from './right-section-topics.component';

describe('RightSectionTopicsComponent', () => {
  let component: RightSectionTopicsComponent;
  let fixture: ComponentFixture<RightSectionTopicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightSectionTopicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightSectionTopicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
