import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportReviewerComponent } from './report-reviewer.component';

describe('ReportReviewerComponent', () => {
  let component: ReportReviewerComponent;
  let fixture: ComponentFixture<ReportReviewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportReviewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportReviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
