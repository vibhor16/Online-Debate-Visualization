import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightSectionVideoCustComponent } from './right-section-video-cust.component';

describe('RightSectionVideoCustComponent', () => {
  let component: RightSectionVideoCustComponent;
  let fixture: ComponentFixture<RightSectionVideoCustComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightSectionVideoCustComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightSectionVideoCustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
