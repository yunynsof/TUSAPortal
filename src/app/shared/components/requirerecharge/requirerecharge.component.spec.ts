import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirerechargeComponent } from './requirerecharge.component';

describe('RequirerechargeComponent', () => {
  let component: RequirerechargeComponent;
  let fixture: ComponentFixture<RequirerechargeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequirerechargeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirerechargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
