import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportRequesterComponent } from './report-requester.component';

describe('ReportRequesterComponent', () => {
  let component: ReportRequesterComponent;
  let fixture: ComponentFixture<ReportRequesterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportRequesterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportRequesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
