import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrivefileComponent } from './drivefile.component';

describe('DrivefileComponent', () => {
  let component: DrivefileComponent;
  let fixture: ComponentFixture<DrivefileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrivefileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrivefileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
