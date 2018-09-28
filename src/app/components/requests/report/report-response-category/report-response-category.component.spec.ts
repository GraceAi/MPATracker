import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportResponseCategoryComponent } from './report-response-category.component';

describe('ReportResponseCategoryComponent', () => {
  let component: ReportResponseCategoryComponent;
  let fixture: ComponentFixture<ReportResponseCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportResponseCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportResponseCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
