import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportIpbxComponent } from './import-ipbx.component';

describe('ImportIpbxComponent', () => {
  let component: ImportIpbxComponent;
  let fixture: ComponentFixture<ImportIpbxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportIpbxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportIpbxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
