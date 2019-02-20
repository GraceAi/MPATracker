import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectReportPrintComponent } from './project-report-print.component';

describe('ProjectReportPrintComponent', () => {
  let component: ProjectReportPrintComponent;
  let fixture: ComponentFixture<ProjectReportPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectReportPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectReportPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
