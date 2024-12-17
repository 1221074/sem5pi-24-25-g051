import { Component, inject, OnInit } from '@angular/core';
import { Operationrequest } from '../../interface/operationrequest';
import { DoctorService } from '../../service/doctor.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../service/authentication.service';
import { OperationDisplay } from '../../interface/operation-display';
import { OperationTypeService } from '../../service/operation-type.service';
import { PatientService } from '../../service/patient.service';
import { Patient } from '../../interface/patient';
import { OperationType } from '../../interface/operationtype';
import { Allergy } from 'src/app/interface/allergy';
import { MedicalCondition } from 'src/app/interface/medical-condition';
import { MedicalRecord } from 'src/app/interface/medical-record';
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
  filteredOperationList: Operationrequest[] = [];
  operationList: Operationrequest[] = [];
  operationListToBeDisplayed: OperationDisplay[] = [];
  fullOperationListToBeDisplayed: OperationDisplay[] = [];
  selectedOperation: Operationrequest | null = null;

    //data
  operationTypes: OperationType[] = [];
  allergyListResults: Allergy[] = [];
  patients: Patient[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  selectedSection = '';

  // New variables for additional functionalities
  selectedPatientId: string = '';
  selectedPatient: Patient | null = null;
  patientMedicalRecord: MedicalRecord | null = null;
  patientMedicalConditions: MedicalCondition[] = [];
  patientAllergies: Allergy[] = [];
  editingAllergies = true;
  newAllergyName = '';
  newAllergyDescription = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadOperationTypes();
    this.loadPatients();
    this.loadAllergies();
    this.updateList();
  }

  // UI METHODS

//Data Loaders===================================

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

async loadAllergies() {
  try {
    this.allergyListResults = await this.patientService.getSystemAllergies();
  } catch (error) {
    this.errorMessage = 'Failed to load allergies. Please try again.';
  }
}

//=================================================

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

// REGISTER METHODS _______________________________________________________________________________________________________________________________________________________________________________

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

    const patientId = this.patientService.getPatientByName(patientName);
    const operationTypeId = this.operationTypeService.getOperationTypeByName(operationTypeName);


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

  async registerMedicalCondition(condition: string) {
    throw new Error('Method not implemented.');
  }

  async registerAllergy() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.newAllergyName) {
      this.errorMessage = 'Please fill the required field.';
      return;
    }

    //verify the allergy is not already in the list
    if (this.allergyListResults.find(a => a.name === this.newAllergyName)) {
      this.errorMessage = 'Allergy already in the list.';
      return;
    }

    const allergyData = {
      name: this.newAllergyName,
    };

    try {
      await this.doctorService.createAllergy(allergyData);
      this.successMessage = 'Allergy registered successfully.';
      this.loadAllergies();
    } catch (error) {
      this.errorMessage = 'An error occurred while registering the allergy. Please try again.';
    }
  }


  async registerSurgeryAppointment(
    patientId: string,
    operationTypeId: string,
    appointmentDate: string
  ) {
    this.errorMessage = '';
    this.successMessage = '';

    if (!patientId || !operationTypeId || !appointmentDate) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    if (new Date(appointmentDate) <= new Date()) {
      this.errorMessage = 'Appointment date must be in the future.';
      return;
    }

    const doctorId = this.authService.getUserId() as string;

    const appointmentData = {
      patientId,
      doctorId,
      operationTypeId,
      appointmentDate
    };

    try {
     await this.doctorService.createSurgeryAppointment(appointmentData);
      this.successMessage = 'Surgery appointment created successfully.';
    } catch (error) {
      this.errorMessage =
        'An error occurred while creating the surgery appointment. Please try again.';
    }
  }


// UPDATE METHODS _______________________________________________________________________________________________________________________________________________________________________________

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
    // Find the corresponding operation in the operationList
    const selectedOp = this.operationList.find(op => op.id === operation.id);
    if (selectedOp) {
      this.selectedOperation = { ...selectedOp }; // Copy data for editing
    } else {
      this.errorMessage = 'Operation not found for editing.';
    }
  }

  savePatientMedicalRecord() {}

  // REMOVE METHODS _______________________________________________________________________________________________________________________________________________________________________________

  submitRemoval(operationId: number) {
    if (confirm('Are you sure you want to remove this operation?')) {
      this.doctorService
        .deleteOperationRequest(operationId.toString())
        .then(() => {
          this.successMessage = 'Operation removed successfully.';
          this.updateList();
        }).catch(error => {
          this.errorMessage = 'An error occurred while removing the operation. Please try again.';
        });
    }
  }

  // SEARCH METHODS ______________________________________________________________________________________________________________________________________________________________________________
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

  removeAllergy(index: number) {
    this.allergyListResults.splice(index, 1);
  }


  // HELPER METHODS ______________________________________________________________________________________________________________________________________________________________________________

  getNameOfpatient(patientId: string): string {
    const patient = this.patients.find(p => p.id.toString() === patientId);
    return patient ? patient.fullName : 'Unknown Patient';
  }

  getOperationTypeName(operationTypeId: string): string {
    const operationType = this.operationTypes.find(o => o.id.toString() === operationTypeId);
    return operationType ? operationType.name : 'Unknown Operation Type';
  }

  // PATIENT MEDICAL RECORD METHODS
  onPatientSelectChange() {
    this.loadSelectedPatient();
  }

  async loadSelectedPatient() {
    if (!this.selectedPatientId) {
      this.selectedPatient = null;
      this.patientMedicalConditions = [];
      this.patientAllergies = [];
      return;
    }

    try {
      this.selectedPatient = await this.patientService.getPatientById(this.selectedPatientId);

      // Load patient's medical conditions and allergies
      /*this.patientMedicalConditions = await this.patientService.getPatientMedicalConditions(
        this.selectedPatientId
      );*/

      //this.patientAllergies = await this.patientService.getPatientAllergies(this.selectedPatientId);
    } catch (error) {
      this.errorMessage = 'Failed to load patient data. Please try again.';
    }
  }
}
