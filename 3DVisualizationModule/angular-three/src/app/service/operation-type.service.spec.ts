import { TestBed } from '@angular/core/testing';
import { OperationTypeService } from './operation-type.service';
import { OperationType } from '../interface/operationtype';

describe('OperationTypeService', () => {
  let service: OperationTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperationTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all operation types', async () => {
    const mockOperationTypes: OperationType[] = [
      {
        id: '1',
        name: 'Operation Type 1',
        requiredStaff: ['Doctor', 'Nurse'],
        duration: '1h',
      },
      {
        id: '2',
        name: 'Operation Type 2',
        requiredStaff: ['Doctor', 'Assistant'],
        duration: '2h',
      },
    ];

    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(new Response(JSON.stringify(mockOperationTypes)))
    );

    const operationTypes = await service.getAllOperationTypes();

    expect(window.fetch).toHaveBeenCalledWith(service.url);
    expect(operationTypes).toEqual(mockOperationTypes);
  });

  it('should handle an empty response gracefully', async () => {
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(new Response(JSON.stringify([])))
    );

    const operationTypes = await service.getAllOperationTypes();

    expect(window.fetch).toHaveBeenCalledWith(service.url);
    expect(operationTypes).toEqual([]);
  });

  it('should handle fetch errors gracefully', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.reject(new Error('Fetch error')));

    await expectAsync(service.getAllOperationTypes()).toBeRejectedWithError('Fetch error');
  });
});
