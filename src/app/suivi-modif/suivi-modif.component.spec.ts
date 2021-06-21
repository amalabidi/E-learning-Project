import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SuiviModifComponent } from './suivi-modif.component';

describe('SuiviModifComponent', () => {
  let component: SuiviModifComponent;
  let fixture: ComponentFixture<SuiviModifComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SuiviModifComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuiviModifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
