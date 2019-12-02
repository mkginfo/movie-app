import { TestBed } from '@angular/core/testing';

import { OmdbService } from './omdb.service';

describe('OmdbService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OmdbService = TestBed.get(OmdbService);
    expect(service).toBeTruthy();
  });
});
