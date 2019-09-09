import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameSheetComponent } from './rename-sheet.component';

describe('RenameSheetComponent', () => {
  let component: RenameSheetComponent;
  let fixture: ComponentFixture<RenameSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenameSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenameSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
