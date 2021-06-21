import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PrefooterComponent } from './prefooter.component';

describe('PrefooterComponent', () => {
  let component: PrefooterComponent;
  let fixture: ComponentFixture<PrefooterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PrefooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrefooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
