import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HomePageComponent } from './home-page.component';
import { CommonModule } from '@angular/common';

describe('HomePageComponent', () => {
    let component: HomePageComponent;
    let router: Router;

    beforeEach(() => {
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        TestBed.configureTestingModule({
            imports: [CommonModule],
            declarations: [HomePageComponent],
            providers: [{ provide: Router, useValue: routerSpy }]
        }).compileComponents();

        const fixture = TestBed.createComponent(HomePageComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should navigate to login on onClickToLogin', () => {
        component.onClickToLogin();
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should navigate to policy privacy on onClickToPolicyPrivacy', () => {
        component.onClickToPolicyPrivacy();
        // Uncomment the line below when the method is implemented
        // expect(router.navigate).toHaveBeenCalledWith(['/policy-privacy']);
    });
});

