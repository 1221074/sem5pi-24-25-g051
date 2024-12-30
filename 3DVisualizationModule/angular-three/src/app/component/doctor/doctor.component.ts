import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Interfaces
import { Operationrequest } from '../../interface/operationrequest';
import { OperationDisplay } from '../../interface/operation-display';
import { OperationType } from '../../interface/operationtype';
import { Patient } from '../../interface/patient';
import { Allergy } from 'src/app/interface/allergy';
import { MedicalCondition } from 'src/app/interface/medical-condition';
import { MedicalRecord } from 'src/app/interface/medical-record';

// Services
import { DoctorService } from '../../service/doctor.service';
import { AuthenticationService } from '../../service/authentication.service';
import { OperationTypeService } from '../../service/operation-type.service';
import { PatientService } from '../../service/patient.service';

@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss']
})
export class DoctorComponent implements OnInit {

  // =========================
  // === Service Injections ===
  // =========================

  doctorService: DoctorService = inject(DoctorService);
  authService: AuthenticationService = inject(AuthenticationService);
  patientService: PatientService = inject(PatientService);
  operationTypeService: OperationTypeService = inject(OperationTypeService);

  // =========================
  // === Component Variables ===
  // =========================

  //Selected Variables
  selectedOperation: Operationrequest | null = null;
  selectedPatientId: string = '';
  selectedPatient: Patient | null = null;
  selectedOperationTypeId: string = '';
  selectedAllergyId: string = '';
  selectedMedicalConditionId: string = '';
  selectedSection: string = '';
  selectedConditionId: string = '';
  selectedPriorityState: string = '';

  // Operation Lists
  filteredOperationList: Operationrequest[] = [];
  operationList: Operationrequest[] = [];
  operationListToBeDisplayed: OperationDisplay[] = [];
  fullOperationListToBeDisplayed: OperationDisplay[] = [];

  // Lists
  availableAllergies: Allergy[] = [];
  filteredAllergyList: Allergy[] = [];
  availableMedicalConditions: MedicalCondition[] = [];
  filteredMedicalConditionList: MedicalCondition[] = [];
  patients: Patient[] = [];

  // Patient Data
  patientMedicalRecord: MedicalRecord | undefined;
  patientMedicalConditions: MedicalCondition[] = [];
  patientAllergies: Allergy[] = [];
  patientFreeText: string = '';

  // Operation Types
  operationTypes: OperationType[] = [];

  // UI State Variables
  errorMessage: string = '';
  successMessage: string = '';
  editingAllergies: boolean = true;

  filters = {
    showDetails: true,
    showMedicalConditions: true,
    showAllergies: true,
    showFreeText: true,
  };


  constructor() { }

  ngOnInit() {
    // Initial data loading
    this.loadOperationTypes();
    this.loadPatients();
    this.loadAllergies();
    this.loadMedicalConditions();
    this.updateList();
    this.filteredAllergyList = this.availableAllergies;
    this.filteredMedicalConditionList = this.availableMedicalConditions;
  }

  // =========================
  // === Data Loaders ===
  // =========================

  /**
   * Loads all patients from the PatientService.
   */
  async loadPatients() {
    try {
      this.patients = await this.patientService.getAllPatients();
    } catch (error) {
      this.errorMessage = 'Failed to load patients. Please try again.';
    }
  }

  /**
   * Loads all operation types from the OperationTypeService.
   */
  async loadOperationTypes() {
    try {
      this.operationTypes = await this.operationTypeService.getAllOperationTypes();
    } catch (error) {
      this.errorMessage = 'Failed to load operation types. Please try again.';
    }
  }

  /**
   * Loads all system allergies from the PatientService.
   */
  async loadAllergies() {
    try {
      this.availableAllergies = await this.doctorService.getSystemAllergies();
      this.filteredAllergyList = this.availableAllergies;
    } catch (error) {
      this.errorMessage = 'Failed to load allergies. Please try again.';
    }
  }


  async loadMedicalConditions() {
    try {
      this.availableMedicalConditions = await this.doctorService.getSystemMedicalConditions();
      this.filteredMedicalConditionList = this.availableMedicalConditions;
    } catch (error) {
      this.errorMessage = 'Failed to load medical conditions. Please try again.';
    }
  }


  // ===========================================================================================================
  // === UI Methods ===
  // ===========================================================================================================

  /**
   * Updates the list of operations associated with the logged-in doctor.
   */
  updateList() {
    this.doctorService.getAllDoctorOperations().then((operationList: Operationrequest[]) => {
      const loggedInDoctorId = this.authService.getUserId() as string;
      // Filter operations by the logged-in doctor's ID
      this.operationList = operationList.filter(op => op.doctorId === loggedInDoctorId);

      // Map operations to display format
      this.operationListToBeDisplayed = this.operationList.map(op => ({
        id: op.id,
        patientName: this.getNameOfpatient(op.patientId),
        doctorId: op.doctorId,
        operationTypeName: this.getOperationTypeName(op.operationTypeId),
        deadlineDate: op.deadlineDate,
        priorityState: op.priorityState
      }));

      // Initialize the master list for search functionality
      this.fullOperationListToBeDisplayed = [...this.operationListToBeDisplayed];
    }).catch(error => {
      this.errorMessage = 'Failed to load operations. Please try again.';
    });
  }

  /**
   * Updates the displayed operation list based on search or filter results.
   * @param operationToBeDisplayed - The filtered list of operations to display.
   */
  updateOperationListSearch(operationToBeDisplayed: OperationDisplay[]) {
    this.operationListToBeDisplayed = operationToBeDisplayed;
  }

  /**
   * Navigates to the specified section within the component.
   * @param section - The section identifier to display.
   */
  showSection(section: string) {
    this.selectedSection = section;
    // Clear any existing messages and selected operation
    this.errorMessage = '';
    this.successMessage = '';
    this.selectedOperation = null;
  }

  /**
   * Logs out the current user.
   */
  logout() {
    this.authService.logout();
  }

  // ===========================================================================================================
  // === Register Methods ===
  // ===========================================================================================================

  /**
   * Registers a new operation request.
   * @param patientName - The name of the patient.
   * @param operationTypeName - The type of operation.
   * @param deadlineDate - The deadline date for the operation.
   * @param priorityState - The priority state of the operation.
   */
  async registerOperation(
    patientName: string,
    operationTypeName: string,
    deadlineDate: string,
    priorityState: string
  ) {
    // Reset messages
    this.errorMessage = '';
    this.successMessage = '';
    const doctorId = this.authService.getUserId() as string;

    // Validate required fields
    if (!patientName || !operationTypeName || !deadlineDate || !priorityState) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    // Validate deadline date is in the future
    if (new Date(deadlineDate) <= new Date()) {
      this.errorMessage = 'Deadline date must be in the future.';
      return;
    }

    // Retrieve patient and operation type IDs based on names
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
      // Handle different error statuses
      if (error.status === 400) {
        this.errorMessage = error.error.message || 'Invalid input. Please check your data.';
      } else if (error.status === 404) {
        this.errorMessage = 'One of the IDs provided does not exist.';
      } else {
        this.errorMessage = 'An error occurred while registering the operation. Please try again.';
      }
    }
  }

  /**
   * Registers a new surgery appointment.
   * @param patientId - The ID of the patient.
   * @param operationTypeId - The ID of the operation type.
   * @param appointmentDate - The date of the appointment.
   */
  async registerSurgeryAppointment(
    patientId: string,
    operationTypeId: string,
    deadlineDate: string,
    priorityState: string
  ) {
    // Reset messages
    this.errorMessage = '';
    this.successMessage = '';

    // Validate required fields
    if (!patientId || !operationTypeId || !deadlineDate || !priorityState) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    // Validate appointment date is in the future
    if (new Date(deadlineDate) <= new Date()) {
      this.errorMessage = 'Appointment date must be in the future.';
      return;
    }

    const doctorId = this.authService.getUserId() as string;

    //Operation Request Data
    const appointmentData = {
      patientId,
      doctorId,
      operationTypeId,
      deadlineDate,
      priorityState
    };

    console.log(appointmentData);

    this.selectedPatient = await this.patientService.getPatientById(patientId);
    this.selectedPatient.appointmentList.push(deadlineDate);

    try {
      await this.doctorService.postOperationRequest(appointmentData);
      await this.patientService.updatePatient(appointmentData.patientId, this.selectedPatient);
      this.clearAppointmentValue();
      this.successMessage = 'Surgery appointment created successfully.';
    } catch (error) {
      this.errorMessage = 'An error occurred while creating the surgery appointment. Please try again.';
    }
  }

  /**
   * Registers the new free text for the patient.
   * @param freeText - The information to be updated.
   */
  async registerFreeTextInput(freeText: string) {
    // Reset messages
    this.errorMessage = '';
    this.successMessage = '';

    // Validate required fields
    if (!this.selectedPatientId || !freeText) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    try {
      this.patientMedicalRecord = await this.patientService.getPatientMedicalRecord(this.selectedPatientId);
      this.patientMedicalRecord.freeText += freeText;
      console.log(this.patientMedicalRecord.freeText);
      await this.doctorService.updatePatientMedicalRecord(this.patientMedicalRecord.patientId, this.patientMedicalRecord);
    } catch (error) {
      this.errorMessage = 'An error occurred while updating the free text. Please try again.';
    }
  }

  // ===========================================================================================================
  // === Update Methods ===
  // ===========================================================================================================

  /**
   * Cancels the current update operation.
   */
  cancelOperationUpdate() {
    this.selectedOperation = null;
    this.errorMessage = '';
    this.successMessage = '';
  }

  /**
   * Submits the updated operation details.
   */
  async submitOperationUpdate() {
    if (!this.selectedOperation) {
      this.errorMessage = 'No operation selected for update.';
      return;
    }

    // Validate deadline date is in the future
    if (new Date(this.selectedOperation.deadlineDate) <= new Date()) {
      this.errorMessage = 'Deadline date must be in the future.';
      return;
    }

    try {
      // Update the OperationRequest via service
      await this.doctorService.updateOperationRequest(this.selectedOperation.id.toString(), this.selectedOperation);
      this.successMessage = 'Operation updated successfully.';
      this.selectedOperation = null;
      this.updateList();
    } catch (error: any) {
      // Handle different error statuses
      if (error.status === 400) {
        this.errorMessage = error.error.message || 'Invalid input. Please check your data.';
      } else if (error.status === 404) {
        this.errorMessage = 'Operation not found.';
      } else {
        this.errorMessage = 'An error occurred while updating the operation. Please try again.';
      }
    }
  }

  /**
   * Selects an operation for updating.
   * @param operation - The operation to be updated.
   */
  selectOperationForUpdate(operation: OperationDisplay) {
    // Reset messages
    this.errorMessage = '';
    this.successMessage = '';
    // Find the corresponding operation in the operationList
    const selectedOp = this.operationList.find(op => op.id === operation.id);
    if (selectedOp) {
      this.selectedOperation = { ...selectedOp }; // Create a copy for editing
    } else {
      this.errorMessage = 'Operation not found for editing.';
    }
  }

  /**
  * Updates Patient Medical Conditions for the selected patient.
  * @param medicalConditionId - The name of the new medical condition.
  */
  async updatePatientMedicalConditions(medicalConditionId: string) {
    // Reset messages
    this.errorMessage = '';
    this.successMessage = '';

    // Validate required fields
    if (!this.selectedPatientId || !medicalConditionId) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }



    try {
      this.patientMedicalRecord = await this.patientService.getPatientMedicalRecord(this.selectedPatientId);
      //update medical conditions array with the new condition
      this.patientMedicalRecord.medicalConditions.push(medicalConditionId as unknown as MedicalCondition);
      await this.doctorService.updatePatientMedicalRecord(this.patientMedicalRecord.patientId, this.patientMedicalRecord);
      this.selectedConditionId = '';
    } catch (error) {
      this.errorMessage = 'An error occurred while updating the free text. Please try again.';
    }
  }


  /**
 * Updates Patient Allergies for the selected patient.
 * @param allergyId - The name of the new medical condition.
 */
  async updatePatientAllergy(allergyId: string) {
    // Reset messages
    this.errorMessage = '';
    this.successMessage = '';

    // Validate required fields
    if (!this.selectedPatientId || !allergyId) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    try {
      this.patientMedicalRecord = await this.patientService.getPatientMedicalRecord(this.selectedPatientId);
      //update allergies array with the new allergy (verify it isn't already in the patientAllergies)
      if (!this.patientMedicalRecord.allergies.includes(allergyId as unknown as Allergy))
        this.patientMedicalRecord.allergies.push(allergyId as unknown as Allergy);

      await this.doctorService.updatePatientMedicalRecord(this.patientMedicalRecord.patientId, this.patientMedicalRecord);

      this.selectedAllergyId = '';
      this.clearPatientValue();

    } catch (error) {
      this.errorMessage = 'An error occurred while updating the free text. Please try again.';
    }
  }

  // ===========================================================================================================
  // === Remove Methods ===
  // ===========================================================================================================

  /**
   * Submits a request to remove an operation.
   * @param operationId - The ID of the operation to remove.
   */
  submitOperationRemoval(operationId: number) {
    if (confirm('Are you sure you want to remove this operation?')) {
      this.doctorService.deleteOperationRequest(operationId.toString())
        .then(() => {
          this.successMessage = 'Operation removed successfully.';
          this.updateList();
        })
        .catch(error => {
          this.errorMessage = 'An error occurred while removing the operation. Please try again.';
        });
    }
  }

  /**
   * Removes an allergy from the local list based on index.
   * @param index - The index of the allergy to remove.
   */
  removeAllergy(index: number) {
    this.availableAllergies.splice(index, 1);
  }

  // ===========================================================================================================
  // === Search Methods ===
  // ===========================================================================================================

  /**
   * Filters the operation list based on the search query.
   * @param query - The search query string.
   */
  filterOperationResults(query: string) {
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

    this.updateOperationListSearch(filteredList);

    // Display a message if no results are found
    if (filteredList.length === 0) {
      this.errorMessage = 'No operations found matching your search.';
    } else {
      this.errorMessage = '';
    }
  }

  /**
   * Searches and filters allergies based on the query.
   * @param query - The search query string.
   */
  searchAllergies(query: string) {
    const lowerQuery = query?.toLowerCase() ?? '';

    if (!lowerQuery) {
      // Reset the list if the query is empty
      this.filteredAllergyList = this.availableAllergies ?? [];
      return;
    }

    if (!this.availableAllergies) {
      // If the allergy list isn't loaded yet, set to empty array
      this.filteredAllergyList = [];
      return;
    }

    // Filter allergy list based on query
    this.filteredAllergyList = this.availableAllergies.filter(allergy =>
      allergy?.name?.toLowerCase().includes(lowerQuery) || allergy?.description?.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Searches and filters Medical Conditions based on the query.
   * @param query - The search query string.
   */
  searchMedicalConditions(query: string) {
    const lowerQuery = query?.toLowerCase() ?? '';

    if (!lowerQuery) {
      // Reset the list if the query is empty
      this.filteredMedicalConditionList = this.availableMedicalConditions ?? [];
      return;
    }

    if (!this.availableMedicalConditions) {
      // If the Medical conditions list isn't loaded yet, set to empty array
      this.filteredMedicalConditionList = [];
      return;
    }

    // Filter Medical Conditions list based on query
    this.filteredMedicalConditionList = this.availableMedicalConditions.filter(medicalCondition =>
      medicalCondition?.name?.toLowerCase().includes(lowerQuery) || medicalCondition?.description?.toLowerCase().includes(lowerQuery)
    );
  }

  // ===========================================================================================================
  // === Helper Methods ===
  // ===========================================================================================================

  /**
   * Displays the medical record of a selected patient.
   * @param patientId - The ID of the patient.
   */
  async showPatientMedicalRecord(patientId: string) {
    // Reset messages and previous data
    this.errorMessage = '';
    this.successMessage = '';
    this.patientMedicalRecord = undefined;
    this.patientAllergies = [];
    this.patientMedicalConditions = [];

    if (!patientId) {
      return;
    }

    try {
      const record = await this.patientService.getPatientMedicalRecord(patientId);
      this.patientMedicalRecord = record;
      console.log(record);
      this.patientMedicalConditions = record.medicalConditions as MedicalCondition[] || [];
      this.patientAllergies = record.allergies as Allergy[] || [];
      this.patientFreeText = record.freeText || '';
    } catch (error) {
      this.errorMessage = 'Unable to fetch patient medical record.';
    }
  }

  /**
   * Retrieves the full name of a patient based on their ID.
   * @param patientId - The ID of the patient.
   * @returns The full name of the patient or 'Unknown Patient' if not found.
   */
  getNameOfpatient(patientId: string): string {
    const patient = this.patients.find(p => p.id.toString() === patientId);
    return patient ? patient.fullName : 'Unknown Patient';
  }

  /**
   * Retrieves the name of the operation type based on its ID.
   * @param operationTypeId - The ID of the operation type.
   * @returns The name of the operation type or 'Unknown Operation Type' if not found.
   */
  getOperationTypeName(operationTypeId: string): string {
    const operationType = this.operationTypes.find(o => o.id.toString() === operationTypeId);
    return operationType ? operationType.name : 'Unknown Operation Type';
  }

  /**
   * Handles changes when a patient is selected from a dropdown or list.
   */
  onPatientSelectChange() {
    this.loadSelectedPatient();

  }

  clearPatientValue() {
    this.selectedPatient = null;
    this.selectedPatientId = '';

  }

  clearAppointmentValue() {
    this.selectedPatientId = '';
    this.selectedPriorityState = '';
    this.selectedOperationTypeId = '';
  }

  /**
   * Loads data for the selected patient, including medical conditions and allergies.
   */
  async loadSelectedPatient() {
    if (!this.selectedPatientId) {
      // Reset patient-related data if no patient is selected
      this.selectedPatient = null;
      this.patientMedicalConditions = [];
      this.patientAllergies = [];
      return;
    }
    console.log(this.selectedPatientId);
    console.log(this.selectedPatient);

    try {
      this.selectedPatient = await this.patientService.getPatientById(this.selectedPatientId);
      this.showPatientMedicalRecord(this.selectedPatientId);
    } catch (error) {
      this.errorMessage = 'Failed to load patient data. Please try again.';
    }
  }

}
