import {TestBed} from '@angular/core/testing';

import {BodyIndexService} from './body-index.service';

describe('BodyIndexService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BodyIndexService = TestBed.get(BodyIndexService);
    expect(service).toBeTruthy();
  });
});
