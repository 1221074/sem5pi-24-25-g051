import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HomePageComponent } from './home-page.component';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      imports: [HomePageComponent], // Import the standalone component
      providers: [{ provide: Router, useValue: routerSpy }],
    }).compileComponents();

    const fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to login on onClickToLogin', () => {
    component.onClickToLogin();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
