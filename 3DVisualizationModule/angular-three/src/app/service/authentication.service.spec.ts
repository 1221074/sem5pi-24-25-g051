import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthenticationService,
        { provide: Router, useValue: routerMock }
      ]
    });

    service = TestBed.inject(AuthenticationService);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the user ID', () => {
    service['userId'] = '12345'; // Set private property
    expect(service.getUserId()).toBe('12345');
  });

  it('should return the mail session', () => {
    service['mail'] = 'test@mail.com'; // Set private property
    expect(service.getMailSession()).toBe('test@mail.com');
  });

  it('should clear session and navigate to "/" on logout', () => {
    spyOn(localStorage, 'clear');
    service.logout();
    expect(localStorage.clear).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    expect(service.getMailSession()).toBeNull();
    expect(service.getUserId()).toBeNull();
  });

  it('should update user information with valid email', async () => {
    const userMock = { nif: '12345' } as any;
    spyOn(service as any, 'getUserByMail').and.returnValue(Promise.resolve(userMock));
    spyOn(console, 'log');

    await service.updateUserInformation('test@mail.com');

    expect(service.getUserId()).toBe('12345');
    expect(console.log).toHaveBeenCalledWith('Mail:', 'test@mail.com');
    expect(console.log).toHaveBeenCalledWith('User ID:', '12345');
  });

  it('should handle non-existent user in updateUserInformation', async () => {
    spyOn(service as any, 'getUserByMail').and.returnValue(Promise.resolve(null));
    spyOn(console, 'error');

    await service.updateUserInformation('nonexistent@mail.com');

    expect(service.getUserId()).toBeNull();
    expect(console.error).toHaveBeenCalledWith('User not found for email nonexistent@mail.com');
  });

  it('should fetch user by mail with getUserByMail', async () => {
    const mockResponse = { nif: '12345' };
    spyOn(window, 'fetch').and.returnValue(Promise.resolve(new Response(JSON.stringify(mockResponse))));

    const user = await (service as any).getUserByMail('test@mail.com');

    expect(window.fetch).toHaveBeenCalledWith('https://localhost:7252/api/user/email/test@mail.com');
    expect(user).toEqual(mockResponse);
  });
});
