import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightSectionTaggingComponent } from './right-section-tagging.component';

describe('RightSectionTaggingComponent', () => {
  let component: RightSectionTaggingComponent;
  let fixture: ComponentFixture<RightSectionTaggingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightSectionTaggingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightSectionTaggingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
