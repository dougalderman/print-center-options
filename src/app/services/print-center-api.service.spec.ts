import { TestBed } from '@angular/core/testing';

import { PrintCenterApiService } from './print-center-api.service';

describe('PrintCenterApiService', () => {
  let service: PrintCenterApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrintCenterApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
