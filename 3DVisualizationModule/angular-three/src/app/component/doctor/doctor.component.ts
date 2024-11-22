import { AfterViewInit, Component, inject, Input, OnInit } from '@angular/core';
import { Operationrequest } from '../../interface/operationrequest';
import { DoctorService } from '../../service/doctor.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../service/authentication.service';
import { OperationDisplay } from '../../interface/operation-display';
import { OperationTypeService } from '../../service/operation-type.service';
import { PatientService } from '../../service/patient.service';
import { Patient } from '../../interface/patient'; // Make sure this import exists
import { OperationType } from '../../interface/operationtype'; // Make sure this import exists

declare var google: any;

@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss']
})
export class DoctorComponent implements OnInit {

  // SERVICES
  doctorService: DoctorService = inject(DoctorService);
  authService: AuthenticationService = inject(AuthenticationService);
  patientService: PatientService = inject(PatientService);
  operationTypeService: OperationTypeService = inject(OperationTypeService);

  // VARIABLES
     //list
    filteredOperationList: Operationrequest[] = [];
    operationList: Operationrequest[] = [];
    operationListToBeDisplayed: OperationDisplay[] = [];
    fullOperationListToBeDisplayed: OperationDisplay[] = [];
    selectedOperation: Operationrequest | null = null;

    //data
  operationTypes: OperationType[] = [];
  patients: Patient[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  selectedSection = '';


  constructor(private router: Router) {}

  ngOnInit() { 
    this.loadOperationTypes();
    this.loadPatients();

    this.updateList();
  }

  // UI METHODS
  async loadPatients() {
    try {
      this.patients = await this.patientService.getAllPatients();
    } catch (error) {
      this.errorMessage = 'Failed to load patients. Please try again.';
    }
  }

  async loadOperationTypes() {
    try {
      this.operationTypes = await this.operationTypeService.getAllOperationTypes();
    } catch (error) {
      this.errorMessage = 'Failed to load operation types. Please try again.';
    }
  }

  updateList() {
  this.doctorService.getAllDoctorOperations().then((operationList: Operationrequest[]) => {
    const loggedInDoctorId = this.authService.getUserId() as string;
    this.operationList = operationList.filter(op => op.doctorId === loggedInDoctorId);

    this.operationListToBeDisplayed = this.operationList.map(op => {
      return {
        id: op.id,
        patientName: this.getNameOfpatient(op.patientId),
        doctorId: op.doctorId,
        operationTypeName: this.getOperationTypeName(op.operationTypeId),
        deadlineDate: op.deadlineDate,
        priorityState: op.priorityState
      };
    });

    // Initialize the master list
    this.fullOperationListToBeDisplayed = [...this.operationListToBeDisplayed];
  }).catch(error => {
    this.errorMessage = 'Failed to load operations. Please try again.';
  });
}


  updateListSearch(operationToBeDisplayed: OperationDisplay[]) {
    this.operationListToBeDisplayed = operationToBeDisplayed;
  }

  showSection(section: string) {
    this.selectedSection = section;
    // Clear messages when switching sections
    this.errorMessage = '';
    this.successMessage = '';
    this.selectedOperation = null;
  }

  logout() {
    this.authService.logout();
  }

  // REGISTER METHODS

  async registerOperation(
    patientName: string,
    operationTypeName: string,
    deadlineDate: string,
    priorityState: string
  ) {

    this.errorMessage = '';
    this.successMessage = '';
    const doctorId = this.authService.getUserId() as string;

    if (!patientName || !operationTypeName || !deadlineDate || !priorityState) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    if (new Date(deadlineDate) <= new Date()) {
      this.errorMessage = 'Deadline date must be in the future.';
      return;
    }

    const patientId = this.getPatientId(patientName);
    const operationTypeId = this.getOperationTypeId(operationTypeName);


    if (!patientId || !operationTypeId) {
      this.errorMessage = 'Patient or operation type not found. Insert valid data.';
      return;
    }

    const operationData = {
      patientId,
      doctorId,
      operationTypeId,
      deadlineDate,
      priorityState
    };

    try {
      await this.doctorService.postOperationRequest(operationData);
      this.successMessage = 'Operation registered successfully.';
      this.updateList();
    } catch (error: any) {
      if (error.status === 400) {
        this.errorMessage = error.error.message || 'Invalid input. Please check your data.';
      } else if (error.status === 404) {
        this.errorMessage = 'One of the IDs provided does not exist.';
      } else {
        this.errorMessage = 'An error occurred while registering the operation. Please try again.';
      }
    }
  }

  // UPDATE METHODS

  cancelUpdate() {
    this.selectedOperation = null;
    this.errorMessage = '';
    this.successMessage = '';
  }

  async submitUpdate() {
    if (!this.selectedOperation) {
      this.errorMessage = 'No operation selected for update.';
      return;
    }

    if (new Date(this.selectedOperation.deadlineDate) <= new Date()) {
      this.errorMessage = 'Deadline date must be in the future.';
      return;
    }

    try {
      // Proceed to update the OperationRequest
      await this.doctorService.updateOperationRequest(this.selectedOperation.id.toString(), this.selectedOperation);
      this.successMessage = 'Operation updated successfully.';
      this.selectedOperation = null;
      this.updateList();
    } catch (error: any) {
      // Handle error based on error response
      if (error.status === 400) {
        this.errorMessage = error.error.message || 'Invalid input. Please check your data.';
      } else if (error.status === 404) {
        this.errorMessage = 'Operation not found.';
      } else {
        this.errorMessage = 'An error occurred while updating the operation. Please try again.';
      }
    }
  }


  selectOperationForUpdate(operation: OperationDisplay) {
    this.errorMessage = '';
    this.successMessage = '';
    // Procurar pela operação correspondente no array `operationList`
    const selectedOp = this.operationList.find(op => op.id === operation.id);
    if (selectedOp) {
      this.selectedOperation = { ...selectedOp }; // Copiar os dados para edição
    } else {
      this.errorMessage = 'Operation not found for editing.';
    }
  }

  // REMOVE METHODS

  submitRemoval(operationId: number) {
    if (confirm('Are you sure you want to remove this operation?')) {
      this.doctorService.deleteOperationRequest(operationId.toString()).then(() => {
        this.successMessage = 'Operation removed successfully.';
        this.updateList();
      }).catch(error => {
        this.errorMessage = 'An error occurred while removing the operation. Please try again.';
      });
    }
  }

  // SEARCH METHODS

  filterResults(query: string) {
    const lowerQuery = query.toLowerCase();

    if (!lowerQuery) {
      // If the query is empty, reset to show all operations
      this.operationListToBeDisplayed = [...this.fullOperationListToBeDisplayed];
      this.errorMessage = '';
      return;
    }

    // Filter the list based on the query
    const filteredList = this.fullOperationListToBeDisplayed.filter(op =>
      op.id.toString().toLowerCase().includes(lowerQuery) ||
      op.patientName.toLowerCase().includes(lowerQuery) ||
      op.doctorId.toString().toLowerCase().includes(lowerQuery) ||
      op.operationTypeName.toLowerCase().includes(lowerQuery) ||
      op.deadlineDate.toString().includes(lowerQuery) ||
      op.priorityState.toLowerCase().includes(lowerQuery)
    );

    this.updateListSearch(filteredList);

    // Display a message if no results are found
    if (filteredList.length === 0) {
      this.errorMessage = 'No operations found matching your search.';
    } else {
      this.errorMessage = '';
    }
  }


  // HELPER METHODS

  getNameOfpatient(patientId: string): string {
    const patient = this.patients.find(p => p.id.toString() === patientId);
    return patient ? patient.fullName : 'Unknown Patient';
  }

  getOperationTypeName(operationTypeId: string): string {
    const operationType = this.operationTypes.find(o => o.id.toString() === operationTypeId);
    return operationType ? operationType.name : 'Unknown Operation Type';
  }


  getOperationTypeId(operationTypeName: string) : string {
    const operationType = this.operationTypes.find(o => o.name === operationTypeName);
    return operationType ? operationType.id.toString() : 'Unknown Operation Type Id';
  }

  getPatientId(patientName: string) {
    const patient = this.patients.find(p => p.fullName === patientName);
    return patient ? patient.id : 'Unknown Patient Id';
  }


}


