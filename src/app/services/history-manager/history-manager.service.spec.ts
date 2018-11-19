import { TestBed } from '@angular/core/testing';

import { HistoryManagerService } from './history-manager.service';

describe('HistoryManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HistoryManagerService = TestBed.get(HistoryManagerService);
    expect(service).toBeTruthy();
  });
});
