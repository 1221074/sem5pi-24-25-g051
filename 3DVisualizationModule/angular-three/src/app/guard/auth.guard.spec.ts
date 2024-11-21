import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthenticationService } from '../service/authentication.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthService: jasmine.SpyObj<AuthenticationService>;

  beforeEach(() => {
    // Define methods to spy on for Router
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // AuthenticationService may not have methods; pass an empty array or object
    mockAuthService = jasmine.createSpyObj('AuthenticationService', [], {});

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: mockRouter },
        { provide: AuthenticationService, useValue: mockAuthService },
      ],
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should create the guard', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access if token exists and role matches expected role', () => {
    const routeMock: any = { data: { expectedRoles: 1 } };
    const stateMock: any = {};
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'token') return 'valid-token';
      if (key === 'role') return '1';
      return null;
    });

    const canActivate = guard.canActivate(routeMock, stateMock);

    expect(canActivate).toBeTrue();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should block access and navigate to /unauthorized if roles do not match', () => {
    const routeMock: any = { data: { expectedRoles: 2 } };
    const stateMock: any = {};
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'token') return 'valid-token';
      if (key === 'role') return '1';
      return null;
    });

    const canActivate = guard.canActivate(routeMock, stateMock);

    expect(canActivate).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/unauthorized']);
  });

  it('should block access and navigate to /login if no token exists', () => {
    const routeMock: any = { data: { expectedRoles: 1 } };
    const stateMock: any = {};
    spyOn(localStorage, 'getItem').and.returnValue(null);

    const canActivate = guard.canActivate(routeMock, stateMock);

    expect(canActivate).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});

