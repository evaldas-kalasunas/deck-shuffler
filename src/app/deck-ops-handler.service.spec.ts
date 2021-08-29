import { TestBed } from '@angular/core/testing';

import { DeckOpsHandlerService } from './deck-ops-handler.service';

describe('DeckOpsHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeckOpsHandlerService = TestBed.get(DeckOpsHandlerService);
    expect(service).toBeTruthy();
  });
});
