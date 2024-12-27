import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Patient } from '../../interface/patient';
import { AdminService } from '../../service/admin.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { AuthenticationService } from '../../service/authentication.service';
import { Staff } from '../../interface/staff';
import { StaffService } from '../../service/staff.service';
import { OperationType } from '../../interface/operationtype';
import { OperationTypeService } from '../../service/operation-type.service';
import { SpecializationService } from '../../service/specialization.service';
import { SpecializationSub } from '../../interface/specialization-sub';
import { PlanningService } from 'src/app/service/planning.service';
import { HttpClientModule } from '@angular/common/http';
import { StaffDisplay } from '../../interface/staff-display';
import { OperationTypeDisplay } from 'src/app/interface/operationtype-display';
import { SurgeryRoom } from 'src/app/interface/surgeryroom';
import { PatientDisplay } from 'src/app/interface/patient-display';
import { Allergy } from 'src/app/interface/allergy';
import { DoctorService } from 'src/app/service/doctor.service';
import { Specialization } from 'src/app/interface/specialization';
import { SpecializationDisplay } from 'src/app/interface/specialization-display';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

//SERVICE ______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
  adminService: AdminService = inject(AdminService);
  userService: UserService = inject(UserService);
  doctorService: DoctorService = inject(DoctorService);
  authService: AuthenticationService = inject(AuthenticationService);
  staffService: StaffService = inject(StaffService);
  specializationService: SpecializationService= inject(SpecializationService);
  planningService: PlanningService = inject(PlanningService);
  operationTypeService: OperationTypeService = inject(OperationTypeService);

//VARIABLES ______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

  //Patient
  patientSearchQuery: string = '';
  filteredPatientList: Patient[] = [];
  selectedPatient: Patient | null = null;
  patientList: Patient[] =  [];
  patientListToBeDisplayed: PatientDisplay[] = [];
  fullPatientListToBeDisplayed: PatientDisplay[] = [];

  //Staff
  staffSearchQuery: string = '';
  filteredStaffList: Staff[] = [];
  staffList: Staff[] = [];
  staffListToBeDisplayed: StaffDisplay[] = [];
  fullStaffListToBeDisplayed: StaffDisplay[] = [];
  selectedStaff: Staff | null = null;

  //Specializations
  specList: SpecializationSub [] = [];

  specializationSearchQuery: string = '';
  filteredSpecializationList: Specialization[] = [];
  specializationList: Specialization[] = [];
  specializationListToBeDisplayed: SpecializationDisplay[] = [];
  fullSpecializationListToBeDisplayed: SpecializationDisplay[] = [];
  selectedSpecialization: Specialization | null = null;

  //Operation Types
  operationTypeSearchQuery: string = '';
  filteredOperationTypeList: OperationType[] = [];
  operationTypeList: OperationType[] = [];
  operationTypeListToBeDisplayed: OperationTypeDisplay[] = [];
  fullOperationTypeListToBeDisplayed: OperationTypeDisplay[] = [];
  selectedOperationType: OperationType | null = null;

  //Planning Module
  roomNumbers: SurgeryRoom[] | null = [];
  roomNumber: string = '';
  planningDate: string = '';
  surgeriesList: string = '';
  heuristic: string = '';
  planningResult: any = null;
  loading: boolean = false;
  planningResultComplexity: Array<{ execution_time: number; number_of_surgeries: number }> = [];

  // Allergy Lists
  availableAllergies: Allergy[] = [];
  filteredAllergyList: Allergy[] = [];


  selectedSection = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.getSpecs();
    this.updatePatientList();
    this.updateStaffList();
    this.updateSpecializationList();
    this.updateOperationTypeList();
    this.getRooms();
    this.getSpecs();
    this.getAllergies();
  }

  showSection(section: string) {
    this.selectedSection = section;
    // Clear messages when switching sections
    this.errorMessage = '';
    this.successMessage = '';
    this.selectedStaff = null;
    this.selectedOperationType = null;
    this.planningResult = null;
    this.loading = false;
    this.roomNumber = '';
    this.planningDate = '';
    this.surgeriesList = '';
    this.heuristic = '';
  }


//HELPER METHODS __________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

logout() {this.authService.logout();}
showHospital() {this.router.navigate(['/hospital']);}

clearMessages() {
  this.planningResult = null;
  this.errorMessage = '';
  this.successMessage = '';
}

validateInputs(requiredFields: (keyof AdminComponent)[]): boolean {
  for (const field of requiredFields) {
    if (!(this as any)[field]) {
      this.errorMessage = 'Please fill in all required fields.';
      this.loading = false;
      return false;
    }
  }
  return true;
}

formatDate(date: Date): string {
  const formattedDate = date.toISOString().split('T')[0]; // Get YYYY-MM-DD
  return formattedDate.replace(/-/g, ''); // Remove dashes to get YYYYMMDD
}


//REGISTER CLASSES ______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

async registerPatient(
    firstName: string,
    lastName: string,
    fullName: string,
    birthDate: string,
    sex: string,
    email: string,
    phone: string,
    emergencyContact: string)
{


this.errorMessage = '';
this.successMessage = '';

if (!firstName || !lastName || !fullName || !birthDate
  || !sex || !email || !phone || !emergencyContact) {
  this.errorMessage = 'Please fill in all required fields.';
  return;
  }

if (new Date(birthDate) > new Date()) {
 this.errorMessage = 'Birth date must be in the past.';
 return;
}
let appointmentList: string[] = [];
let allergyList: string[] = [];
  const patientData = {
    firstName,
    lastName,
    fullName,
    birthDate,
    sex,
    email,
    phone,
    emergencyContact,
    appointmentList,
    allergyList
  };

  try {
    await this.adminService.postPatient(patientData);
    this.successMessage = 'Patient registered successfully.';
    this.updatePatientList();
  } catch (error: any) {
    if (error.status === 400) {
      this.errorMessage = error.error.message || 'Invalid input. Please check your data.';
    } else {
      this.errorMessage = 'An error occurred while registering the patient. Please try again.';
    }
  }
}

async registerUser(nif: string, userName: string, email: string, phoneNumber: string, role: string) {
  const newUser = { nif, userName, email, phoneNumber, role };
  this.userService.createUser(newUser).then(
    response => {
      this.successMessage = 'User registered successfully!';
      this.errorMessage = '';
      // Optionally, reset the form or perform other actions
    }
  ).catch(
    error => {
      this.errorMessage = 'Failed to register user. Please try again.';
      this.successMessage = '';
    }
  );
}

async registerStaff(firstName: string, lastName: string, fullName: string, specializationId: string, email: string, phone: string) {
  this.errorMessage = '';
  this.successMessage = '';

  if (!firstName || !lastName || !fullName || !specializationId || !email || !phone) {
    this.errorMessage = 'Please fill in all required fields.';
    return;
  }

  if (this.checkIfStaffEmailExists(email)) {
    this.errorMessage = 'This email is already associated to a staff member.';
    return;
  }

  if (this.checkIfStaffPhoneNumberExists(phone)) {
    this.errorMessage = 'This phone number is already associated to a staff member.';
    return;
  }

  const newStaff = { firstName, lastName, fullName, specializationId, email, phone };

  try {
    await this.staffService.postStaff(newStaff);
    this.successMessage = 'Staff registered successfully.';
    this.updateStaffList();
  }catch(error: any) {
    if (error.status === 400) {
      this.errorMessage = error.error.message || 'Invalid input. Please check your data.';
    } else {
      this.errorMessage = 'An error occurred while registering the staff. Please try again.';
    }
  }
}

async registerSpecialization(specializationName: string) {
  this.errorMessage = '';
  this.successMessage = '';

  if (!specializationName) {
    this.errorMessage = 'Please fill in all required fields.';
    return;
  }

  if (this.checkIfSpecializationExists(specializationName)) {
    this.errorMessage = 'This specialization already exists.';
    return;
  }

  const newSpec = { specializationName };

  try {
    await this.specializationService.postSpecialization(newSpec);
    this.successMessage = 'Specialization registered successfully.';
    this.getSpecs();
  }catch(error: any) {
    if (error.status === 400) {
      this.errorMessage = error.error.message || 'Invalid input. Please check your data.';
    } else {
      this.errorMessage = 'An error occurred while creating the specialization. Please try again.';
    }
  }
}

  /**
   * Registers a new allergy in the system.
   * @param newAllergyName - The name of the new allergy.
   */
  async registerAllergy(newAllergyName: string) {
    // Reset messages
    this.errorMessage = '';
    this.successMessage = '';

    // Validate input
    if (!newAllergyName) {
      this.errorMessage = 'Please fill the required field.';
      return;
    }

    // Check for duplicate allergy
    if (this.availableAllergies.find(a => a.name === newAllergyName)) {
      this.errorMessage = 'Allergy already in the list.';
      return;
    }

    const allergyData = { name: newAllergyName };

    try {
      await this.doctorService.createAllergy(allergyData);
      this.successMessage = 'Allergy registered successfully.';
      this.getAllergies();
    } catch (error) {
      this.errorMessage = 'An error occurred while registering the allergy. Please try again.';
    }
  }

selectedSpecializations: SpecializationSub[] = [];


onCheckboxChange(event: Event, spec: SpecializationSub): void {
  const checkbox = event.target as HTMLInputElement;

  if (checkbox.checked) {
    // Add to array if checked
    this.selectedSpecializations.push(spec);
  } else {
    // Remove from array if unchecked
    this.selectedSpecializations = this.selectedSpecializations.filter(
      selected => selected.id !== spec.id
    );
  }

  console.log('Selected Specializations:', this.selectedSpecializations);
}

// Get the name of a specialization by its ID
getSpecializationName(id: number): string {
  const spec = this.specList.find(spec => spec.id === id);
  return spec ? spec.specializationName : 'Unknown';
}


async registerOperationType(name: string, duration: string) {
  this.errorMessage = '';
  this.successMessage = '';

  const requiredStaff = this.selectedSpecializations.map(spec => spec.id);

  if (!name || !requiredStaff.length || !duration) {
    this.errorMessage = 'Please fill in all required fields.';
    return;
  }

  const newOperationType = { name, requiredStaff, duration };

  try {
    await this.operationTypeService.postOperationType(newOperationType);
    this.successMessage = 'Operation type registered successfully.';
    this.updateOperationTypeList();
  } catch (error: any) {
    if (error.status === 400) {
      this.errorMessage = error.error.message || 'Invalid input. Please check your data.';
    } else {
      this.errorMessage = 'An error occurred while registering the operation type. Please try again.';
    }
  }
}



//UPDATE CLASSES ______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

//Patient =========================================================================================================================================================================================================================================================
  async updatePatient(id: number, firstName: string,
    lastName: string,
    fullName: string,
    birthDate: string,
    sex: string,
    email: string,
    phone: string,
    emergencyContact: string) {
      let appointmentList: string[] = [];
      let allergyList: string[] = [];
      const patientData = {
        id,
        firstName,
        lastName,
        fullName,
        birthDate,
        sex,
        email,
        phone,
        emergencyContact,
        appointmentList,
        allergyList
      };

      this.adminService.updatePatient(patientData).then(
        (response) => {
          this.successMessage = 'Patient profile updated successfully.';
          this.updatePatientList();
          this.selectedPatient = null;
        },
        (error) => {
          this.errorMessage = 'Error updating patient profile.';
        }
      );
  }

  updatePatientList() {
    this.adminService.getAllPatients().then((patientList: Patient[]) => {
      this.patientList = patientList;
      this.filteredPatientList = patientList;

      this.patientListToBeDisplayed = this.patientList.map(patient => {
        return {
          id: patient.id,
          firstName: patient.firstName,
          lastName: patient.lastName,
          fullName: patient.fullName,
          birthDate: patient.birthDate,
          sex: patient.sex,
          email: patient.email,
          phone: patient.phone,
          emergencyContact: patient.emergencyContact,
          appointmentList: patient.appointmentList,
          allergyList: patient.allergyList
        };
      });

      this.fullPatientListToBeDisplayed = [...this.patientListToBeDisplayed];
  }).catch(error => {
    this.errorMessage = 'Failed to load operations. Please try again.';
  });
  }

  selectPatientForUpdate(patient: Patient) {
  this.errorMessage = '';
  this.successMessage = '';
  // Create a copy of the patient to avoid mutating the list directly
  this.selectedPatient = patient;
  }

  updateListSearch(filteredPatientList: Patient[]) {
    this.filteredPatientList = filteredPatientList;
  }

//Staff =========================================================================================================================================================================================================================================================

  updateStaffList() {
    //.getAllStaff() para retornar todos os staffs sem filtar por ativo ou não
    this.staffService.getAllActiveStaff().then((staffList: Staff[]) => {
      this.staffList = staffList;
      this.filteredStaffList = staffList;

      this.staffListToBeDisplayed = this.staffList.map(staff => {
        return {
          id: staff.id,
          firstName: staff.firstName,
          lastName: staff.lastName,
          fullName: staff.fullName,
          specializationName: this.getStaffSpecializationName(staff.specializationId),
          email: staff.email,
          phone: staff.phone
        };
      });

      this.fullStaffListToBeDisplayed = [...this.staffListToBeDisplayed];
  }).catch(error => {
    this.errorMessage = 'Failed to load operations. Please try again.';
  });

  }

  updateSpecializationList() {
    this.specializationService.getAllSpecilizations().then((specializationList: Specialization[]) => {
      this.specializationList = specializationList;
      this.filteredSpecializationList = specializationList;

      this.specializationListToBeDisplayed = this.specializationList.map(specialization => {
        return {
          id: specialization.id,
          specializationName: specialization.specializationName
        };
      });

      this.fullSpecializationListToBeDisplayed = [...this.specializationListToBeDisplayed];
    }).catch(error => {
      this.errorMessage = 'Failed to load specializations. Please try again.';
    });
  }

  getStaffSpecializationName(specializationId: number): string {
    const specialization = this.specList.find(spec => spec.id === specializationId);
    return specialization ? specialization.specializationName : '';
  }

  updateFilteredStaffList(staffToBeDisplayed: StaffDisplay[]) {
    this.staffListToBeDisplayed = staffToBeDisplayed;
  }

  cancelUpdate(): void {
  this.selectedStaff = null;
  this.successMessage = '';
  this.errorMessage = '';
  }

  cancelSpecializationUpdate(): void {
    this.selectedSpecialization = null;
    this.successMessage = '';
    this.errorMessage = '';
  }
/*
  async updateStaff(id: number, firstName: string,lastName: string,fullName: string,specializationId: string,email: string,phone: string) {
    const updatedStaff: Staff = {
      id: id,
      firstName: firstName,
      lastName: lastName,
      fullName: fullName,
      specializationId: Number(specializationId),
      email: email,
      phone: phone
    };

    this.staffService.updateStaff(id, updatedStaff).then(
      (response) => {
        this.successMessage = 'Staff profile updated successfully.';
        this.updateStaffList();
        this.selectedStaff = null;
      },
      (error) => {
        this.errorMessage = 'Error updating staff profile.';
      }
    );
  }
*/

async updateStaff() {
  if (!this.selectedStaff) {
    this.errorMessage = 'No staff member selected for update.';
    return;
  }

  try {
    // Proceed to update the OperationRequest
    await this.staffService.updateStaff(this.selectedStaff.id.toString(), this.selectedStaff);
    this.successMessage = 'Staff updated successfully.';
    this.selectedStaff = null;
    this.updateStaffList();
  } catch (error: any) {
    // Handle error based on error response
    if (error.status === 400) {
      this.errorMessage = error.error.message || 'Invalid input. Please check your data.';
    } else if (error.status === 404) {
      this.errorMessage = 'Staff member not found.';
    } else {
      this.errorMessage = 'An error occurred while updating the staff profile. Please try again.';
    }
  }
}

async updateSpecialization() {
  if (!this.selectedSpecialization) {
    this.errorMessage = 'No specialization selected for update.';
    return;
  }

  try {
    // Proceed to update the Specialization
    await this.specializationService.updateSpecialization(this.selectedSpecialization.id.toString(), this.selectedSpecialization);
    this.successMessage = 'Specialization updated successfully.';
    this.selectedSpecialization = null;
    this.updateSpecializationList();
    this.getSpecs();
  } catch (error: any) {
    // Handle error based on error response
    if (error.status === 400) {
      this.errorMessage = error.error.message || 'Invalid input. Please check your data.';
    } else if (error.status === 404) {
      this.errorMessage = 'Specialization not found.';
    } else {
      this.errorMessage = 'An error occurred while updating the specialization. Please try again.';
    }
  }
}

  selectStaffForUpdate(staff: StaffDisplay) {
    this.errorMessage = '';
    this.successMessage = '';
    // Create a copy of the patient to avoid mutating the list directly
    const selectedSt = this.staffList.find(op => op.id === staff.id);
    if (selectedSt) {
      this.selectedStaff = { ...selectedSt }; // Copiar os dados para edição
    } else {
      this.errorMessage = 'Staff not found for editing.';
    }
  }

  selectSpecializationForUpdate(specialization: SpecializationDisplay) {
    this.errorMessage = '';
    this.successMessage = '';

    const selectedSpec = this.specializationList.find(op => op.id === specialization.id);
    if (selectedSpec) {
      this.selectedSpecialization = { ...selectedSpec }; // Copiar os dados para edição
    } else {
      this.errorMessage = 'Specialization not found for editing.';
    }
  }

  getSpecs() {
    this.specializationService.getAllSpecilizations().then((specList: SpecializationSub[]) => {
      this.specList = specList;
    });
  }

  getRooms() {
    this.planningService.getAllRooms().then((planningList: SurgeryRoom[]) => {
      this.roomNumbers = planningList;
    });

  }

    /**
   * Loads all system allergies from the PatientService.
   */
    async getAllergies() {
      try {
        this.availableAllergies = await this.doctorService.getSystemAllergies();
        this.filteredAllergyList = this.availableAllergies;
      } catch (error) {
        this.errorMessage = 'Failed to load allergies. Please try again.';
      }
    }

  //Operation Type =========================================================================================================================================================================================================================================================

  async updateOperationType(): Promise<void> {
    if(!this.selectedOperationType) {
      this.errorMessage = 'No operation type selected for update.';
      return;
    }

    try{
      this.selectedOperationType.requiredStaff = this.selectedSpecializations.map(spec => spec.id);
      await this.operationTypeService.updateOperationType(this.selectedOperationType.id.toString(), this.selectedOperationType);
      this.successMessage = 'Operation type updated successfully.';
      this.selectedOperationType = null;
      this.updateOperationTypeList();
    } catch (error: any) {
      if (error.status === 400) {
        this.errorMessage = error.error.message || 'Invalid input. Please check your data.';
      } else if (error.status === 404) {
        this.errorMessage = 'Operation type not found.';
      } else {
        this.errorMessage = 'An error occurred while updating the operation type. Please try again.';
      }
    }
  }

    updateOperationTypeList() {
      this.operationTypeService.getAllActiveOperationType().then((operationTypeList: OperationType[]) => {
        this.operationTypeList = operationTypeList;
        this.filteredOperationTypeList = operationTypeList;

        this.operationTypeListToBeDisplayed = this.operationTypeList.map(operationType => {
          return {
            id: operationType.id,
            name: operationType.name,
            specializationName: this.getStaffSpecializationNameList(operationType.requiredStaff),
            duration: operationType.duration
          };
        });

        this.fullOperationTypeListToBeDisplayed = [...this.operationTypeListToBeDisplayed];
      }).catch(error => {
        this.errorMessage = 'Failed to load operation types. Please try again.';
      });
    }

    getStaffSpecializationNameList(specializationId: number[]): string[] {

      console.log(specializationId)
      return specializationId.map(id => {
        const numId = id;
        console.log('Converted id:', numId);
        const name = this.getSpecializationName(numId);
        console.log('Specialization name:', name);
        return name;
      });
    }




    cancelOperationTypeUpdate(): void {
    this.selectedOperationType = null;
    this.successMessage = '';
    this.errorMessage = '';
    }

    selectOperationTypeForUpdate(operationType: OperationTypeDisplay) {
      this.errorMessage = '';
      this.successMessage = '';
      this.selectedSpecializations = [];
      // Create a copy of the patient to avoid mutating the list directly
      const selectedOT = this.operationTypeList.find(ot => ot.id === operationType.id);
      if(selectedOT){
        this.selectedOperationType = { ...selectedOT};
      } else {
        this.errorMessage = 'Operation Type not found';
      }
    }

    onCheckboxUpdate(event: Event, spec: SpecializationSub): void {
      const checkbox = event.target as HTMLInputElement;

      if (checkbox.checked) {
        // Add to array if checked
        this.selectedSpecializations.push(spec);
      } else {
        // Remove from array if unchecked
        this.selectedSpecializations = this.selectedSpecializations.filter(
          selected => selected.id !== spec.id
        );
      }

    }


//REMOVE CLASSES ______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

submitRemoval(patientId: number) {
  if (confirm('Are you sure you want to remove this patient?')) {
    this.adminService.deletePatient(patientId.toString()).then(() => {
      this.successMessage = 'Operation removed successfully.';
      this.updatePatientList();
    }).catch(error => {
      this.errorMessage = 'An error occurred while removing the operation. Please try again.';
    });
  }
}

submitStaffDeactivation(staffId: number) {
  if (confirm('Are you sure you want to deactivate this staff member?')) {
    this.staffService.deactivateStaff(staffId.toString()).then(() => {
      this.successMessage = 'Staff member deactivated successfully.';
      this.updateStaffList();
    }).catch(error => {
      this.errorMessage = 'An error occurred while deactivating the staff member. Please try again.';
    });
  }
}

submitOperationTypeDeactivation(operationTypeId: number) {
  console.log('Operation Type ID:', operationTypeId);
  if (confirm('Are you sure you want to deactivate this operation type?')) {
    this.operationTypeService.deactivateOperationType(operationTypeId).then(() => {
      this.successMessage = 'Operation type deactivated successfully.';
      this.updateOperationTypeList();
    }).catch(error => {
      this.errorMessage = 'An error occurred while deactivating the operation type. Please try again.';
    });
  }
}

submitSpecRemoval(spec: number) {
  if (confirm('Are you sure you want to delete this Specialization?')) {
    this.specializationService.deleteSpecialization(spec.toString()).then(() => {
      this.successMessage = 'Specialization removed successfully.';
      this.updateSpecializationList();
      this.getSpecs();
    }).catch(error => {
      this.errorMessage = 'An error occurred while removing the operation. Please try again.';
    });
  }
}



//SEARCH CLASSES ______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

filterStaffResults(staffParameter: string): void {
  //this.staffListToBeDisplayed = this.fullStaffListToBeDisplayed;

    if (!staffParameter) {
      // If the query is empty, reset to show all operations
      this.staffListToBeDisplayed = [...this.fullStaffListToBeDisplayed];
      this.errorMessage = '';
      return;
    }

  if (staffParameter) {
    const staffListToBeDisplayed = this.fullStaffListToBeDisplayed.filter(staff =>
      staff.firstName.toLowerCase().includes(staffParameter.toLowerCase())||
      staff.lastName.toLowerCase().includes(staffParameter.toLowerCase())||
      staff.fullName.toLowerCase().includes(staffParameter.toLowerCase())||
      staff.specializationName.toLowerCase().includes(staffParameter.toLowerCase())||
      staff.email.toLowerCase().includes(staffParameter.toLowerCase())||
      staff.phone.toLowerCase().includes(staffParameter.toLowerCase())
    );

    this.updateStaffListSearch(staffListToBeDisplayed);
  }
}

filterSpecializationResults(specParameter: string): void {

    if (!specParameter) {
      // If the query is empty, reset to show all operations
      this.specializationListToBeDisplayed = [...this.fullSpecializationListToBeDisplayed];
      this.errorMessage = '';
      return;
    }

  if (specParameter) {
    const specializationListToBeDisplayed = this.fullSpecializationListToBeDisplayed.filter(spec =>
      spec.specializationName.toLowerCase().includes(specParameter.toLowerCase())
    );

    this.updateSpecializationListSearch(specializationListToBeDisplayed);
  }
}


filterPatientResults(patientParameter: string) {
  if (!patientParameter) {
    // If the query is empty, reset to show all operations
    this.patientListToBeDisplayed = [...this.fullPatientListToBeDisplayed];
    this.errorMessage = '';
    return;
  }

if (patientParameter) {
  const patientListToBeDisplayed = this.fullPatientListToBeDisplayed.filter(staff =>
    staff.firstName.toLowerCase().includes(patientParameter.toLowerCase())||
    staff.lastName.toLowerCase().includes(patientParameter.toLowerCase())||
    staff.fullName.toLowerCase().includes(patientParameter.toLowerCase())||
    staff.birthDate.toLowerCase().includes(patientParameter.toLowerCase())||
    staff.sex.toLowerCase().includes(patientParameter.toLowerCase())||
    staff.email.toLowerCase().includes(patientParameter.toLowerCase())||
    staff.phone.toLowerCase().includes(patientParameter.toLowerCase())||
    staff.emergencyContact.toLowerCase().includes(patientParameter.toLowerCase())
  );

  this.updatePatientListSearch(patientListToBeDisplayed);
}
}

updatePatientListSearch(filteredPatientList: PatientDisplay[]) {
  this.patientListToBeDisplayed = filteredPatientList;
}

updateStaffListSearch(filteredStaffList: StaffDisplay[]) {
  this.staffListToBeDisplayed = filteredStaffList;
}

updateSpecializationListSearch(filteredSpecializationList: SpecializationDisplay[]) {
  this.specializationListToBeDisplayed = filteredSpecializationList;
}

checkIfStaffPhoneNumberExists(phoneNumber: string): boolean {
  const lowerPhoneNumber = phoneNumber.toLowerCase();

  // Check if the phone number exists in the staff list
  const staffExists = this.staffList.some(staff => staff.phone.toLowerCase() === lowerPhoneNumber);

  return staffExists;
}

checkIfSpecializationExists(specializationName: string): boolean {
  const lowerSpecializationName = specializationName.toLowerCase();

  // Check if the specialization exists in the specialization list
  const specializationExists = this.specList.some(spec => spec.specializationName.toLowerCase() === lowerSpecializationName);

  return specializationExists;
}

checkIfStaffEmailExists(email: string): boolean {
  const lowerEmail = email.toLowerCase();

  // Check if the email exists in the staff list
  const emailExists = this.staffList.some(staff => staff.email.toLowerCase() === lowerEmail);

  return emailExists;
}

filterOperationTypeResults(operationTypeParameter: string): void {


  console.log('Operation Type Parameter:', operationTypeParameter);
  if (!operationTypeParameter) {
    this.operationTypeListToBeDisplayed = [...this.fullOperationTypeListToBeDisplayed];
    this.errorMessage = '';
    return;
  } else {
    const operationTypeListToBeDisplayed = this.fullOperationTypeListToBeDisplayed.filter(operationType =>
      operationType.name.toLowerCase().includes(operationTypeParameter.toLowerCase()) ||
      operationType.duration.toLowerCase().includes(operationTypeParameter.toLowerCase())
    );

    this.updateOperationTypeListSearch(operationTypeListToBeDisplayed);

  }
}

updateOperationTypeListSearch(filteredOperationTypeList: OperationTypeDisplay[]) {
  this.operationTypeListToBeDisplayed = filteredOperationTypeList;
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
      allergy?.name?.toLowerCase().includes(lowerQuery)
    );
  }



// ALGAV USER STORIES ________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

// 6.3.1
async startOptimizedPlanning() {

  this.clearMessages();


  if (!this.validateInputs(['roomNumber', 'planningDate', 'surgeriesList'])) {
    return;
  }

  this.loading = true;

  try {
    const formattedDate = this.formatDate(new Date(this.planningDate));
    const result = await this.planningService.getOptimalSchedule(
      this.roomNumber,
      formattedDate,
      this.surgeriesList
    );
    this.planningResult = result;
    console.log('Planning Result:', this.planningResult);

    this.successMessage = 'Optimized planning completed successfully.';
  } catch (error: any) {
    this.errorMessage = error.message || 'An error occurred during optimized planning.';
  } finally {
    this.loading = false;
  }
}

// 6.3.2

async performComplexityAnalysis() {
  this.clearMessages();

  if (!this.validateInputs(['roomNumber', 'planningDate'])) {
    return;
  }

  this.loading = true;
  try {
    const formattedDate = this.formatDate(new Date(this.planningDate));
    this.planningResultComplexity = await this.planningService.getComplexityAnalysis(this.roomNumber, formattedDate);

    console.log('Complexity Analysis Result:', this.planningResultComplexity);
    this.successMessage = 'Complexity analysis completed successfully.';
  } catch (error: any) {
    this.errorMessage = error.message || 'An error occurred during complexity analysis.';
  } finally {
    this.loading = false;
  }
}



// 6.3.3

async startHeuristicPlanning() {
  this.clearMessages();

  if (!this.validateInputs(['roomNumber', 'planningDate', 'surgeriesList', 'heuristic'])) {
    return;
  }

  this.loading = true;
  try {
    const formattedDate = this.formatDate(new Date(this.planningDate));
    const result = await this.planningService.getHeuristicSchedule(
      this.roomNumber,
      formattedDate,
      this.surgeriesList,
      this.heuristic
    );
    this.planningResult = result;
    this.successMessage = 'Heuristic planning completed successfully.';
  } catch (error: any) {
    this.errorMessage = error.message || 'An error occurred during heuristic planning.';
  } finally {
    this.loading = false;
  }

}

}


