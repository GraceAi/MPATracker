import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequesterRequestComponent } from './requester-request.component';

describe('RequesterRequestComponent', () => {
  let component: RequesterRequestComponent;
  let fixture: ComponentFixture<RequesterRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequesterRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequesterRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
