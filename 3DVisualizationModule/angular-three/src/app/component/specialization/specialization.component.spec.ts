import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpecializationComponent } from './specialization.component';
import { SpecializationService } from '../../service/specialization.service';
import { SpecializationSub } from '../../interface/specialization-sub';
import { of } from 'rxjs';

describe('SpecializationComponent', () => {
  let component: SpecializationComponent;
  let fixture: ComponentFixture<SpecializationComponent>;
  let mockSpecializationService: jasmine.SpyObj<SpecializationService>;

  beforeEach(async () => {
    mockSpecializationService = jasmine.createSpyObj('SpecializationService', ['getAllSpecilizations']);

    // Mock specializations
    const mockSpecializations: SpecializationSub[] = [
      { id: 1, specializationName: 'Cardiology' },
      { id: 2, specializationName: 'Neurology' },
    ];

    mockSpecializationService.getAllSpecilizations.and.returnValue(Promise.resolve(mockSpecializations));

    await TestBed.configureTestingModule({
      imports: [SpecializationComponent],
      providers: [
        { provide: SpecializationService, useValue: mockSpecializationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SpecializationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load and display all specializations on initialization', async () => {
    await fixture.whenStable(); // Wait for the async data to resolve
    expect(component.specializationList.length).toBe(2);
    expect(component.filteredSpecializationList.length).toBe(2);
    expect(mockSpecializationService.getAllSpecilizations).toHaveBeenCalled();
  });

  it('should filter specializations based on search text', async () => {
    await fixture.whenStable(); // Wait for the async data to resolve

    component.filterResults('Cardio');
    expect(component.filteredSpecializationList.length).toBe(1);
    expect(component.filteredSpecializationList[0].specializationName).toBe('Cardiology');

    component.filterResults('Neuro');
    expect(component.filteredSpecializationList.length).toBe(1);
    expect(component.filteredSpecializationList[0].specializationName).toBe('Neurology');

    component.filterResults('Nonexistent');
    expect(component.filteredSpecializationList.length).toBe(0);
  });

  it('should reset filter if search text is empty', async () => {
    await fixture.whenStable(); // Wait for the async data to resolve

    component.filterResults('');
    expect(component.filteredSpecializationList.length).toBe(2);
    expect(component.filteredSpecializationList).toEqual(component.specializationList);
  });

  it('should log specialization click event', () => {
    spyOn(console, 'log');
    const specialization: SpecializationSub = { id: 1, specializationName: 'Cardiology' };

    component.onSpecializationClick(specialization);

    expect(console.log).toHaveBeenCalledWith('Specialization clicked:', specialization);
  });
});
