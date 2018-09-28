import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportResponseReviewerComponent } from './report-response-reviewer.component';

describe('ReportResponseReviewerComponent', () => {
  let component: ReportResponseReviewerComponent;
  let fixture: ComponentFixture<ReportResponseReviewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportResponseReviewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportResponseReviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
