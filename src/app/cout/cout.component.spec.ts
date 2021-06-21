import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CoutComponent } from './cout.component';

describe('CoutComponent', () => {
  let component: CoutComponent;
  let fixture: ComponentFixture<CoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
