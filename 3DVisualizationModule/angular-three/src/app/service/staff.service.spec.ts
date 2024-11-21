import { TestBed } from '@angular/core/testing';
import { StaffService } from './staff.service';
import { Staff } from '../interface/staff';

describe('StaffService', () => {
  let service: StaffService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StaffService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all staff members', async () => {
    const mockStaff: Staff[] = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe',
        specializationId: 101,
        email: 'johndoe@mail.com',
        phone: '123-456-7890',
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        fullName: 'Jane Smith',
        specializationId: 102,
        email: 'janesmith@mail.com',
        phone: '987-654-3210',
      },
    ];

    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(new Response(JSON.stringify(mockStaff)))
    );

    const staff = await service.getAllStaff();

    expect(window.fetch).toHaveBeenCalledWith(service['url']);
    expect(staff).toEqual(mockStaff);
  });

  it('should fetch staff by ID', async () => {
    const mockStaff: Staff = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe',
      specializationId: 101,
      email: 'johndoe@mail.com',
      phone: '123-456-7890',
    };

    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(new Response(JSON.stringify(mockStaff)))
    );

    const staff = await service.getStaffById('1');

    expect(window.fetch).toHaveBeenCalledWith(`${service['url']}/1`);
    expect(staff).toEqual(mockStaff);
  });

  it('should post a new staff member', async () => {
    const mockStaff = {
      firstName: 'John',
      lastName: 'Doe',
      specializationId: 101,
      email: 'johndoe@mail.com',
      phone: '123-456-7890',
    };

    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(new Response(JSON.stringify({ message: 'Staff created successfully' }), { status: 201 }))
    );

    const response = await service.postStaff(mockStaff);

    expect(window.fetch).toHaveBeenCalledWith(service['url'], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockStaff),
      credentials: 'include',
    });
    expect(response).toEqual({ message: 'Staff created successfully' });
  });

  it('should handle errors when posting a new staff member', async () => {
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(new Response(JSON.stringify({ message: 'Error posting staff profile' }), { status: 400 }))
    );

    const mockStaff = {
      firstName: 'John',
      lastName: 'Doe',
      specializationId: 101,
      email: 'johndoe@mail.com',
      phone: '123-456-7890',
    };

    await expectAsync(service.postStaff(mockStaff)).toBeRejectedWith(
      jasmine.objectContaining({ status: 400, message: 'Error posting staff profile' })
    );
  });

  it('should update a staff profile', async () => {
    const mockStaff = {
      firstName: 'John',
      lastName: 'Doe',
      specializationId: 101,
      email: 'johndoe@mail.com',
      phone: '123-456-7890',
    };

    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(new Response(JSON.stringify({ message: 'Staff updated successfully' })))
    );

    const response = await service.updateStaff('1', mockStaff);

    expect(window.fetch).toHaveBeenCalledWith(`${service['url']}/1`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockStaff),
      credentials: 'include',
    });
    expect(response).toEqual({ message: 'Staff updated successfully' });
  });

  it('should delete a staff member permanently', async () => {
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(new Response(JSON.stringify({ message: 'Staff deleted successfully' })))
    );

    const response = await service.deleteStaff('1');

    expect(window.fetch).toHaveBeenCalledWith(`${service['url']}/1/hard`, {
      method: 'DELETE',
      credentials: 'include',
    });
    expect(response).toEqual({ message: 'Staff deleted successfully' });
  });

  it('should deactivate a staff member', async () => {
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(new Response(JSON.stringify({ message: 'Staff deactivated successfully' })))
    );

    const response = await service.deactivateStaff('1');

    expect(window.fetch).toHaveBeenCalledWith(`${service['url']}/1`, {
      method: 'DELETE',
      credentials: 'include',
    });
    expect(response).toEqual({ message: 'Staff deactivated successfully' });
  });
});
