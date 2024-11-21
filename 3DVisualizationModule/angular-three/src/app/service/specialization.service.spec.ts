import { TestBed } from '@angular/core/testing';
import { SpecializationService } from './specialization.service';
import { SpecializationSub } from '../interface/specialization-sub';

describe('SpecializationService', () => {
  let service: SpecializationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpecializationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all specializations', async () => {
    const mockSpecializations: SpecializationSub[] = [
      { id: 1, specializationName: 'Cardiology' },
      { id: 2, specializationName: 'Neurology' },
    ];

    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(new Response(JSON.stringify(mockSpecializations)))
    );

    const specializations = await service.getAllSpecilizations();

    expect(window.fetch).toHaveBeenCalledWith(service.url);
    expect(specializations).toEqual(mockSpecializations);
  });

  it('should fetch a specialization by name', async () => {
    const mockSpecialization: SpecializationSub = { id: 1, specializationName: 'Cardiology' };

    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(new Response(JSON.stringify(mockSpecialization)))
    );

    const specialization = await service.getSpecializationByName('1');

    expect(window.fetch).toHaveBeenCalledWith(`${service.url}/1`);
    expect(specialization).toEqual(mockSpecialization);
  });

  it('should handle empty response for all specializations', async () => {
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(new Response(JSON.stringify([])))
    );

    const specializations = await service.getAllSpecilizations();

    expect(window.fetch).toHaveBeenCalledWith(service.url);
    expect(specializations).toEqual([]);
  });

  it('should handle fetch errors gracefully', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.reject(new Error('Fetch error')));

    await expectAsync(service.getAllSpecilizations()).toBeRejectedWithError('Fetch error');
  });

  it('should return undefined for nonexistent specialization', async () => {
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(new Response(JSON.stringify([])))
    );
    const specialization = await service.getSpecializationByName('999');

    expect(window.fetch).toHaveBeenCalledWith(`${service.url}/999`);
    expect(specialization?.id).toBeUndefined();
  });

});
