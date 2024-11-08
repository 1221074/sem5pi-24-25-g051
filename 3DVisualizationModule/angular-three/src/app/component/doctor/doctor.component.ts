import { ChangeDetectorRef, Component } from '@angular/core';

@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [],
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.scss'
})
export class DoctorComponent {
  selectedSection: string = '';
  operations = [
    { id: 1, patientId: 'P001', doctorId: 'D001', type: 'Surgery', deadlineDate: '2024-11-10', priorityState: 'Urgent' },
    { id: 2, patientId: 'P002', doctorId: 'D002', type: 'Checkup', deadlineDate: '2024-11-12', priorityState: 'Normal' },
  ];
  nextOperationId = 3;

  constructor(private cdr: ChangeDetectorRef) {}

  showSection(section: string) {
    this.selectedSection = section;
    this.cdr.detectChanges(); // Manually trigger change detection
  }

  registerOperation(patientId: string, doctorId: string, operationTypeId: string, deadlineDate: string, priorityState: string) {
    const operationData = {
      patientId,
      doctorId,
      operationTypeId,
      deadlineDate,
      priorityState
    };

    //proced to post a OpereationRequest

  }

  submitUpdate(operationId: number, ) {
    let isUpdated: boolean = false;
    //update in the Db the operation with the new data

    //update

    if (isUpdated) {
      alert('Operation updated successfully');
    } else {
      alert('Operation not found');
    }

  }

  submitRemoval(operationId: number) {
     let isUpdated: boolean = false;
    //remove in the Db the operation with the new data

    //remove
    if (isUpdated) {
      alert('Operation removed successfully');
    } else {
      alert('Operation not found');
    }
  }



  filterResults(query: string) {
    const lowerQuery = query.toLowerCase();
    const filtered = this.operations.filter(
      op =>
        op.patientId.toLowerCase().includes(lowerQuery) ||
        op.doctorId.toLowerCase().includes(lowerQuery) ||
        op.type.toLowerCase().includes(lowerQuery)
    );
    console.log('Filtered Results:', filtered);
    // Display these results on the UI (table can be updated with filtered data)
  }
}

