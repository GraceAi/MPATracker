import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewerRequestComponent } from './reviewer-request.component';

describe('ReviewerRequestComponent', () => {
  let component: ReviewerRequestComponent;
  let fixture: ComponentFixture<ReviewerRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewerRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewerRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
