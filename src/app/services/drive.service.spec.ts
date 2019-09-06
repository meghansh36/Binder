import { TestBed } from '@angular/core/testing';

import { DriveService } from './drive.service';

describe('DriveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DriveService = TestBed.get(DriveService);
    expect(service).toBeTruthy();
  });
});
