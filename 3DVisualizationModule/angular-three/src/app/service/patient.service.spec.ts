import { TestBed } from '@angular/core/testing';
import { AdminService } from './admin.service';
import { Patient } from '../interface/patient';

describe('PatientService', () => {
  let service: AdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all patients', async () => {
    const mockPatients: Patient[] = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe',
        birthDate: '1990-01-01',
        sex: 'Male',
        email: 'johndoe@mail.com',
        phone: '123-456-7890',
        emergencyContact: '987-654-3210',
        appointmentList: ['Checkup', 'Follow-up'],
        allergyList: ['Peanuts', 'Dust'],
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        fullName: 'Jane Smith',
        birthDate: '1985-05-15',
        sex: 'Female',
        email: 'janesmith@mail.com',
        phone: '111-222-3333',
        emergencyContact: '444-555-6666',
        appointmentList: ['Consultation'],
        allergyList: [],
      },
    ];

    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(new Response(JSON.stringify(mockPatients)))
    );

    const patients = await service.getAllPatients();

    expect(window.fetch).toHaveBeenCalledWith(service['patient_url']);
    expect(patients).toEqual(mockPatients);
  });

  it('should fetch a patient by ID', async () => {
    const mockPatient: Patient = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe',
      birthDate: '1990-01-01',
      sex: 'Male',
      email: 'johndoe@mail.com',
      phone: '123-456-7890',
      emergencyContact: '987-654-3210',
      appointmentList: ['Checkup', 'Follow-up'],
      allergyList: ['Peanuts', 'Dust'],
    };

    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(new Response(JSON.stringify(mockPatient)))
    );

    const patient = await service.getPatientById('1');

    expect(window.fetch).toHaveBeenCalledWith(`${service['patient_url']}/1`);
    expect(patient).toEqual(mockPatient);
  });

  it('should post a new patient', async () => {
    const mockPatientData = {
      firstName: 'John',
      lastName: 'Doe',
      birthDate: '1990-01-01',
      sex: 'Male',
      email: 'johndoe@mail.com',
      phone: '123-456-7890',
      emergencyContact: '987-654-3210',
      appointmentList: ['Checkup', 'Follow-up'],
      allergyList: ['Peanuts', 'Dust'],
    };

    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(new Response(JSON.stringify({ message: 'Patient created successfully' }), { status: 201 }))
    );

    const response = await service.postPatient(mockPatientData);

    expect(window.fetch).toHaveBeenCalledWith(service['patient_url'], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockPatientData),
      credentials: 'include',
    });
    expect(response).toEqual({ message: 'Patient created successfully' });
  });

  it('should handle errors when posting a patient', async () => {
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(new Response(JSON.stringify({ message: 'Error posting patient' }), { status: 400 }))
    );

    const mockPatientData = {
      firstName: 'John',
      lastName: 'Doe',
      birthDate: '1990-01-01',
      sex: 'Male',
      email: 'johndoe@mail.com',
      phone: '123-456-7890',
      emergencyContact: '987-654-3210',
      appointmentList: ['Checkup', 'Follow-up'],
      allergyList: ['Peanuts', 'Dust'],
    };

    await expectAsync(service.postPatient(mockPatientData)).toBeRejectedWith(
      jasmine.objectContaining({ status: 400, message: 'Error posting patient' })
    );
  });

  it('should update a patient profile', async () => {
    const mockPatientData = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      birthDate: '1990-01-01',
      sex: 'Male',
      email: 'johndoe@mail.com',
      phone: '123-456-7890',
      emergencyContact: '987-654-3210',
      appointmentList: ['Checkup', 'Follow-up'],
      allergyList: ['Peanuts', 'Dust'],
    };

    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(new Response(JSON.stringify({ message: 'Patient updated successfully' })))
    );

    const response = await service.updatePatient(mockPatientData);

    expect(window.fetch).toHaveBeenCalledWith(`${service['patient_url']}/1`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockPatientData),
      credentials: 'include',
    });
    expect(response).toEqual({ message: 'Patient updated successfully' });
  });

  it('should delete a patient permanently', async () => {
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(new Response(JSON.stringify({ message: 'Patient deleted successfully' })))
    );

    const response = await service.deletePatient('1');

    expect(window.fetch).toHaveBeenCalledWith(`${service['patient_url']}/1/hard`, {
      method: 'DELETE',
      credentials: 'include',
    });
    expect(response).toEqual({ message: 'Patient deleted successfully' });
  });
});
