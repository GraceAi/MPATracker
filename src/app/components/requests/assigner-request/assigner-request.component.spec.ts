import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignerRequestComponent } from './assigner-request.component';

describe('AssignerRequestComponent', () => {
  let component: AssignerRequestComponent;
  let fixture: ComponentFixture<AssignerRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignerRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignerRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
