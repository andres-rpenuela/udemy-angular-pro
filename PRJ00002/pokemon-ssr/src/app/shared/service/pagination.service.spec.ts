/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { PaginationService } from './pagination.service.';

describe('Service: PaginationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaginationService]
    });
  });

  it('should ...', inject([PaginationService], (service: PaginationService) => {
    expect(service).toBeTruthy();
  }));
});
