import { TestBed } from '@angular/core/testing';

import { GameListManagerService } from './game-list-manager.service';

describe('GameListManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GameListManagerService = TestBed.get(GameListManagerService);
    expect(service).toBeTruthy();
  });
});
