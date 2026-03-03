import { TestBed } from '@angular/core/testing';

import { CuentaServicio } from './cuenta';

describe('Cuenta', () => {
  let service: CuentaServicio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CuentaServicio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
