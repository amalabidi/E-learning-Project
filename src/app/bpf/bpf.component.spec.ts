import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BpfComponent } from './bpf.component';

describe('BpfComponent', () => {
  let component: BpfComponent;
  let fixture: ComponentFixture<BpfComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BpfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
