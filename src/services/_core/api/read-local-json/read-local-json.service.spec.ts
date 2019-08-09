import { TestBed } from '@angular/core/testing';

import { ReadLocalJsonService } from './read-local-json.service';

describe('ReadLocalJsonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReadLocalJsonService = TestBed.get(ReadLocalJsonService);
    expect(service).toBeTruthy();
  });
});
