import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PwlinkComponent } from './pwlink.component';

describe('PwlinkComponent', () => {
  let component: PwlinkComponent;
  let fixture: ComponentFixture<PwlinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PwlinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PwlinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
