import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightSectionTopicsNewComponent } from './right-section-topics-new.component';

describe('RightSectionTopicsNewComponent', () => {
  let component: RightSectionTopicsNewComponent;
  let fixture: ComponentFixture<RightSectionTopicsNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightSectionTopicsNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightSectionTopicsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
