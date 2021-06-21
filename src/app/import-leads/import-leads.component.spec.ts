import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportLeadsComponent } from './import-leads.component';

describe('ImportLeadsComponent', () => {
  let component: ImportLeadsComponent;
  let fixture: ComponentFixture<ImportLeadsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportLeadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
