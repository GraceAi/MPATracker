import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructionPhaseComponent } from './construction-phase.component';

describe('ConstructionPhaseComponent', () => {
  let component: ConstructionPhaseComponent;
  let fixture: ComponentFixture<ConstructionPhaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConstructionPhaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructionPhaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
