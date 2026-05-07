import { TestBed } from '@angular/core/testing';

import { CardApi } from './card-api';

describe('CardApi', () => {
  let service: CardApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
