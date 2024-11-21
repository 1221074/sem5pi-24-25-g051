/*import { Router } from "@angular/router";
import { AuthenticationService } from "src/app/service/authentication.service";
import { DoctorService } from "src/app/service/doctor.service";
import { OperationTypeService } from "src/app/service/operation-type.service";
import { PatientService } from "src/app/service/patient.service";
import { DoctorComponent } from "./doctor.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe('DoctorComponent', () => {
    let component: DoctorComponent;
    let fixture: ComponentFixture<DoctorComponent>;
    let doctorService: jasmine.SpyObj<DoctorService>;
    let authService: jasmine.SpyObj<AuthenticationService>;
    let patientService: jasmine.SpyObj<PatientService>;
    let operationTypeService: jasmine.SpyObj<OperationTypeService>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        const doctorServiceSpy = jasmine.createSpyObj('DoctorService', ['getAllDoctorOperations', 'postOperationRequest', 'updateOperationRequest', 'deleteOperationRequest']);
        const authServiceSpy = jasmine.createSpyObj('AuthenticationService', ['getUserId', 'logout']);
        const patientServiceSpy = jasmine.createSpyObj('PatientService', ['getAllPatients']);
        const operationTypeServiceSpy = jasmine.createSpyObj('OperationTypeService', ['getAllOperationTypes']);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            declarations: [DoctorComponent],
            providers: [
                { provide: DoctorService, useValue: doctorServiceSpy },
                { provide: AuthenticationService, useValue: authServiceSpy },
                { provide: PatientService, useValue: patientServiceSpy },
                { provide: OperationTypeService, useValue: operationTypeServiceSpy },
                { provide: Router, useValue: routerSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(DoctorComponent);
        component = fixture.componentInstance;
        doctorService = TestBed.inject(DoctorService) as jasmine.SpyObj<DoctorService>;
        authService = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
        patientService = TestBed.inject(PatientService) as jasmine.SpyObj<PatientService>;
        operationTypeService = TestBed.inject(OperationTypeService) as jasmine.SpyObj<OperationTypeService>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load patients on init', async () => {
        const mockPatients = [{ id: '1', fullName: 'John Doe' }];
        patientService.getAllPatients.and.returnValue(Promise.resolve(mockPatients));

        await component.ngOnInit();

        expect(component.patients).toEqual(mockPatients);
    });

    it('should handle error when loading patients fails', async () => {
        patientService.getAllPatients.and.returnValue(Promise.reject('Error'));

        await component.ngOnInit();

        expect(component.errorMessage).toBe('Failed to load patients. Please try again.');
    });

    it('should load operation types on init', async () => {
        const mockOperationTypes = [{ id: '1', name: 'Surgery' }];
        operationTypeService.getAllOperationTypes.and.returnValue(Promise.resolve(mockOperationTypes));

        await component.ngOnInit();

        expect(component.operationTypes).toEqual(mockOperationTypes);
    });

    it('should handle error when loading operation types fails', async () => {
        operationTypeService.getAllOperationTypes.and.returnValue(Promise.reject('Error'));

        await component.ngOnInit();

        expect(component.errorMessage).toBe('Failed to load operation types. Please try again.');
    });

    it('should update operation list on init', async () => {
        const mockOperations = [{ id: 1, doctorId: '123', patientId: '1', operationTypeId: '1', deadlineDate: '2023-12-31', priorityState: 'High' }];
        const mockUserId = '123';
        doctorService.getAllDoctorOperations.and.returnValue(Promise.resolve(mockOperations));
        authService.getUserId.and.returnValue(mockUserId);

        await component.ngOnInit();

        expect(component.operationList).toEqual(mockOperations);
    });

    it('should handle error when updating operation list fails', async () => {
        doctorService.getAllDoctorOperations.and.returnValue(Promise.reject('Error'));

        await component.ngOnInit();

        expect(component.errorMessage).toBe('Failed to load operations. Please try again.');
    });

    it('should register operation successfully', async () => {
        const mockUserId = '123';
        authService.getUserId.and.returnValue(mockUserId);
        doctorService.postOperationRequest.and.returnValue(Promise.resolve());

        await component.registerOperation('John Doe', 'Surgery', '2023-12-31', 'High');

        expect(component.successMessage).toBe('Operation registered successfully.');
    });
});*/
