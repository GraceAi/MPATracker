import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcurementPhaseComponent } from './procurement-phase.component';

describe('ProcurementPhaseComponent', () => {
  let component: ProcurementPhaseComponent;
  let fixture: ComponentFixture<ProcurementPhaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcurementPhaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcurementPhaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
