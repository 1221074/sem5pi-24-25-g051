/*import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoctorComponent } from './doctor.component';
import { Router } from '@angular/router';
import { DoctorService } from '../../service/doctor.service';
import { AuthenticationService } from '../../service/authentication.service';
import { PatientService } from '../../service/patient.service';
import { OperationTypeService } from '../../service/operation-type.service';

describe('DoctorComponent', () => {
  let component: DoctorComponent;
  let fixture: ComponentFixture<DoctorComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockDoctorService: jasmine.SpyObj<DoctorService>;
  let mockAuthService: jasmine.SpyObj<AuthenticationService>;
  let mockPatientService: jasmine.SpyObj<PatientService>;
  let mockOperationTypeService: jasmine.SpyObj<OperationTypeService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockDoctorService = jasmine.createSpyObj('DoctorService', [
      'getAllDoctorOperations',
      'postOperationRequest',
      'deleteOperationRequest',
      'updateOperationRequest',
    ]);
    mockAuthService = jasmine.createSpyObj('AuthenticationService', [
      'getUserId',
      'logout',
    ]);
    mockPatientService = jasmine.createSpyObj('PatientService', ['getAllPatients']);
    mockOperationTypeService = jasmine.createSpyObj('OperationTypeService', [
      'getAllOperationTypes',
    ]);

    await TestBed.configureTestingModule({
      imports: [DoctorComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: DoctorService, useValue: mockDoctorService },
        { provide: AuthenticationService, useValue: mockAuthService },
        { provide: PatientService, useValue: mockPatientService },
        { provide: OperationTypeService, useValue: mockOperationTypeService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load patients on initialization', async () => {
    const mockPatients = [
      { id: 1, fullName: 'John Doe', birthDate: '01-01-1990', sex: 'M', email: 'johndoe@gmail.com', phone: '12345', emergencyContact: '67890', appointmentList: [], allergyList: [] },
    ];
    mockPatientService.getAllPatients.and.returnValue(Promise.resolve(mockPatients));

    await component.loadPatients();
    expect(component.patients.length).toBe(1);
    expect(component.patients[0].fullName).toBe('John Doe');
  });

  it('should load operation types on initialization', async () => {
    const mockOperationTypes = [
      { id: '1', name: 'Surgery', requiredStaff: ['Doctor', 'Nurse'], duration: '2 hours' },
    ];
    mockOperationTypeService.getAllOperationTypes.and.returnValue(Promise.resolve(mockOperationTypes));

    await component.loadOperationTypes();
    expect(component.operationTypes.length).toBe(1);
    expect(component.operationTypes[0].name).toBe('Surgery');
  });

  it('should filter operations based on logged-in doctor ID', async () => {
    const mockOperations = [
      { id: 1, doctorId: '123', patientId: '1', operationTypeId: '1', deadlineDate: new Date('2021-01-01'), priorityState: 'High' },
      { id: 2, doctorId: '456', patientId: '2', operationTypeId: '2', deadlineDate: new Date('2021-01-01'), priorityState: 'Low' },
    ];
    mockAuthService.getUserId.and.returnValue('123');
    mockDoctorService.getAllDoctorOperations.and.returnValue(Promise.resolve(mockOperations));

    await component.updateList();

    expect(component.operationList.length).toBe(1);
    expect(component.operationList[0].id).toBe(1);
    expect(component.operationList[0].doctorId).toBe('123');
    expect(component.operationList[0].priorityState).toBe('High');
  });

  it('should register a new operation successfully', async () => {
    mockAuthService.getUserId.and.returnValue('123');
    mockDoctorService.postOperationRequest.and.returnValue(Promise.resolve());

    await component.registerOperation('John Doe', 'Surgery', '2024-01-01', 'High');

    expect(component.successMessage).toBe('Operation registered successfully.');
  });

  it('should handle operation registration errors', async () => {
    mockAuthService.getUserId.and.returnValue('123');
    mockDoctorService.postOperationRequest.and.returnValue(Promise.reject({ status: 400, error: { message: 'Invalid input' } }));

    await component.registerOperation('John Doe', 'Surgery', '2024-01-01', 'High');

    expect(component.errorMessage).toBe('Invalid input. Please check your data.');
  });

  it('should update an operation successfully', async () => {
    const mockOperation = { id: 1, doctorId: '123', patientId: '1', operationTypeId: '1', deadlineDate: new Date('2024-01-01'), priorityState: 'High' };
    mockDoctorService.updateOperationRequest.and.returnValue(Promise.resolve());

    component.selectedOperation = mockOperation;
    await component.submitUpdate();

    expect(component.successMessage).toBe('Operation updated successfully.');
  });

  it('should handle operation update errors', async () => {
    const mockOperation = { id: 1, doctorId: '123', patientId: '1', operationTypeId: '1', deadlineDate: new Date('2024-01-01'), priorityState: 'High' };
    mockDoctorService.updateOperationRequest.and.returnValue(Promise.reject({ status: 404 }));

    component.selectedOperation = mockOperation;
    await component.submitUpdate();

    expect(component.errorMessage).toBe('Operation not found.');
  });

  it('should delete an operation successfully', async () => {
    spyOn(window, 'confirm').and.returnValue(true);
    mockDoctorService.deleteOperationRequest.and.returnValue(Promise.resolve());

    await component.submitRemoval(1);
    expect(component.successMessage).toBe('Operation removed successfully.');
  });

  it('should handle operation deletion errors', async () => {
    spyOn(window, 'confirm').and.returnValue(true);
    mockDoctorService.deleteOperationRequest.and.returnValue(Promise.reject({}));

    await component.submitRemoval(1);
    expect(component.errorMessage).toBe('An error occurred while removing the operation. Please try again.');
  });

  it('should log out the user', () => {
    component.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
  });
});
*/
