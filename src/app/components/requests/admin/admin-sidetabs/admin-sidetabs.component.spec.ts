import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSidetabsComponent } from './admin-sidetabs.component';

describe('AdminSidetabsComponent', () => {
  let component: AdminSidetabsComponent;
  let fixture: ComponentFixture<AdminSidetabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSidetabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSidetabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
