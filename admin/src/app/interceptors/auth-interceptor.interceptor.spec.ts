import { TestBed } from '@angular/core/testing';

import { AuthInterceptorInterceptor } from './auth-interceptor.interceptor';

describe('AuthInterceptorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      AuthInterceptorInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: AuthInterceptorInterceptor = TestBed.inject(AuthInterceptorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
