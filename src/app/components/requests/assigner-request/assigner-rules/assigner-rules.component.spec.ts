import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignerRulesComponent } from './assigner-rules.component';

describe('AssignerRulesComponent', () => {
  let component: AssignerRulesComponent;
  let fixture: ComponentFixture<AssignerRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignerRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignerRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
