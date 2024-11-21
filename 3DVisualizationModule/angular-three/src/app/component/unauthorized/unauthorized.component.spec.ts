import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { UnauthorizedComponent } from './unauthorized.component';
import { AuthenticationService } from '../../service/authentication.service';

describe('UnauthorizedComponent', () => {
  let component: UnauthorizedComponent;
  let fixture: ComponentFixture<UnauthorizedComponent>;
  let mockAuthService: jasmine.SpyObj<AuthenticationService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthenticationService', ['logout']);

    await TestBed.configureTestingModule({
      imports: [UnauthorizedComponent],
      providers: [
        { provide: AuthenticationService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UnauthorizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain(
      "You've accessed a page that you don't have access to. Please log in again into the system."
    );
  });

  it('should call logout after 5 seconds', fakeAsync(() => {
    spyOn(window, 'setTimeout').and.callThrough(); // Spy on setTimeout
    component.ngAfterViewInit();

    // Fast-forward time
    tick(5000);

    expect(mockAuthService.logout).toHaveBeenCalled();
  }));
});
