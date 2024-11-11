import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { Operationrequest } from '../../interface/operationrequest';
import { DoctorService } from '../../service/doctor.service';

@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [],
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.scss'
})
export class DoctorComponent {
  selectedSection = '';
  @Input() operationrequest!: Operationrequest;
  doctorService: DoctorService = inject(DoctorService);
  filteredOperationList: Operationrequest[] = [];
  operationList : Operationrequest[] = [];

  constructor() {
    this.doctorService.getAllDoctorOperations().then((operationList: Operationrequest[]) => {
      this.operationList = operationList;
      this.filteredOperationList = operationList;
    });}


  showSection(section: string) {
    this.selectedSection = section;
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
    const filtered = this.filteredOperationList.filter(
      op =>
        op.patientId.toLowerCase().includes(lowerQuery) ||
        op.doctorId.toLowerCase().includes(lowerQuery) ||
        op.type.toLowerCase().includes(lowerQuery)
    );
    console.log('Filtered Results:', filtered);
    // Display these results on the UI (table can be updated with filtered data)
  }
}

