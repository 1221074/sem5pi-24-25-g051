declare var google: any;
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../service/authentication.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthService: jasmine.SpyObj<AuthenticationService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAuthService = jasmine.createSpyObj('AuthenticationService', ['updateUserInformation']);

    // Mock the global `google` object
    (window as any).google = {
      accounts: {
        id: {
          initialize: jasmine.createSpy('initialize'),
          renderButton: jasmine.createSpy('renderButton'),
          revoke: jasmine.createSpy('revoke'),
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthenticationService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    delete (window as any).google;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize Google login on ngOnInit', () => {
    component.ngOnInit();

    expect(google.accounts.id.initialize).toHaveBeenCalledWith(
      jasmine.objectContaining({
        client_id: jasmine.any(String),
        callback: jasmine.any(Function),
      })
    );
    expect(google.accounts.id.renderButton).toHaveBeenCalled();
  });

  it('should handle credential response and login user based on role', async () => {
    const mockResponse = {
      credential:
        'eyJhbGciOiJSUzI1NiIsImtpZCI6ImQ5NzQwYTcwYjA5NzJkY2NmNzVmYTg4YmM1MjliZDE2YTMwNTczYmQiLCJ0eXAiOiJKV1QifQ.eyJlbWFpbCI6InNlbTVwaTI0MjVnMDUxQGdtYWlsLmNvbSIsInJvbGUiOjF9.signature',
    };
    const decodedToken = { email: 'sem5pi2425g051@gmail.com' };
    const apiResponse = { role: 1 }; // Mock role as 'doctor'

    spyOn(window, 'fetch').and.callFake(async (input: RequestInfo | URL) => {
      if (
        typeof input === 'string' &&
        input.includes(`https://localhost:7252/api/user/role?token=${mockResponse.credential}`)
      ) {
        return new Response(JSON.stringify(apiResponse));
      }
      throw new Error('Unknown endpoint');
    });

    (component as any).jwtDecode = () => decodedToken;

    await component.handleCredentialResponse(mockResponse);

    expect(localStorage.getItem('token')).toBe(mockResponse.credential);
    expect(localStorage.getItem('role')).toBe(null); // Role is not set
});

  it('should log username and password on form submit', () => {
    spyOn(console, 'log');
    component.username = 'testUser';
    component.password = 'testPass';

    component.onSubmit();

    expect(console.log).toHaveBeenCalledWith('Username:', 'testUser');
    expect(console.log).toHaveBeenCalledWith('Password:', 'testPass');
  });
});
