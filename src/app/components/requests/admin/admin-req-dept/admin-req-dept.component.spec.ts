import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReqDeptComponent } from './admin-req-dept.component';

describe('AdminReqDeptComponent', () => {
  let component: AdminReqDeptComponent;
  let fixture: ComponentFixture<AdminReqDeptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminReqDeptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminReqDeptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
