import { TestBed } from '@angular/core/testing';

import { ShareMusicService } from './share-music.service';

describe('ShareMusicService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShareMusicService = TestBed.get(ShareMusicService);
    expect(service).toBeTruthy();
  });
});
