import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightSectionVideoComponent } from './right-section-video.component';

describe('RightSectionVideoComponent', () => {
  let component: RightSectionVideoComponent;
  let fixture: ComponentFixture<RightSectionVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightSectionVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightSectionVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
