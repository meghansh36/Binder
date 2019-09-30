import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiletableComponent } from './filetable.component';

describe('FiletableComponent', () => {
  let component: FiletableComponent;
  let fixture: ComponentFixture<FiletableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiletableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiletableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
