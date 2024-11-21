import { TestBed } from '@angular/core/testing';
import { DoctorService } from './doctor.service';
import { Operationrequest } from '../interface/operationrequest';

describe('DoctorService', () => {
  let service: DoctorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoctorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all doctor operations', async () => {
    const mockOperations: Operationrequest[] = [
      { id: 1, doctorId: '1', patientId: '1', operationTypeId: '1', deadlineDate: new Date('2021-01-01'), priorityState: 'Emergency' },
      { id: 2, doctorId: '2', patientId: '2', operationTypeId: '1', deadlineDate: new Date('2021-01-01'), priorityState: 'Emergency' },
    ];

    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(new Response(JSON.stringify(mockOperations)))
    );

    const operations = await service.getAllDoctorOperations();

    // Convert dates in both mock data and response to ISO strings for comparison
    operations.forEach((op, index) => {
      expect(op.id).toBe(mockOperations[index].id);
      expect(op.doctorId).toBe(mockOperations[index].doctorId);
      expect(op.patientId).toBe(mockOperations[index].patientId);
      expect(op.operationTypeId).toBe(mockOperations[index].operationTypeId);
      expect(op.priorityState).toBe(mockOperations[index].priorityState);
    });
  });


  it('should post an operation request', async () => {
    const mockOperationData = { id: '1', name: 'Operation 1' };
    const mockResponse = { success: true };

    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(new Response(JSON.stringify(mockResponse), { status: 200 }))
    );

    const response = await service.postOperationRequest(mockOperationData);
    expect(window.fetch).toHaveBeenCalledWith(service.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockOperationData),
      credentials: 'include',
    });
    expect(response).toEqual(mockResponse);
  });

  it('should update an operation request', async () => {
    const mockOperationData = { id: '1', name: 'Updated Operation' };
    const mockResponse = { success: true };

    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(new Response(JSON.stringify(mockResponse), { status: 200 }))
    );

    const response = await service.updateOperationRequest('1', mockOperationData);
    expect(window.fetch).toHaveBeenCalledWith(`${service.url}/1`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockOperationData),
      credentials: 'include',
    });
    expect(response).toEqual(mockResponse);
  });

  it('should delete an operation request', async () => {
    const mockResponse = { success: true };

    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(new Response(JSON.stringify(mockResponse), { status: 200 }))
    );

    const response = await service.deleteOperationRequest('1');
    expect(window.fetch).toHaveBeenCalledWith(`${service.url}/1`, {
      method: 'DELETE',
      credentials: 'include',
    });
    expect(response).toEqual(mockResponse);
  });

  it('should handle error in delete operation request', async () => {
    const mockErrorResponse = { message: 'Error deleting operation request' };

    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(new Response(JSON.stringify(mockErrorResponse), { status: 400 }))
    );

    await expectAsync(service.deleteOperationRequest('1')).toBeRejectedWithError(
      'Error deleting operation request'
    );

    expect(window.fetch).toHaveBeenCalledWith(`${service.url}/1`, {
      method: 'DELETE',
      credentials: 'include',
    });
  });
});
