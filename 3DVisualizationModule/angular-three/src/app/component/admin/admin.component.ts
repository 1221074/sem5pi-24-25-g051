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
  authService: AuthenticationService = inject(AuthenticationService);
  staffService: StaffService = inject(StaffService);
  specializationService: SpecializationService= inject(SpecializationService);
  planningService: PlanningService = inject(PlanningService);
  operationTypeService: OperationTypeService = inject(OperationTypeService);

//VARIABLES ______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

  //Patient
  filteredPatientList: Patient[] = [];
  patientList: Patient[] = [];
  selectedPatient: Patient | null = null;

  //Staff
  filteredStaffList: Staff[] = [];
  staffList: Staff[] = [];
  selectedStaff: Staff | null = null;

  //Specializations
  specList: SpecializationSub [] = [];

  //Operation Types
  operationTypeList: OperationType[] = [];
  filteredOperationTypeList: OperationType[] = [];
  selectedOperationType: OperationType | null = null;

  //Planning Module
  roomNumber: string = '';
  planningDate: string = '';
  surgeriesList: string = '';
  heuristic: string = '';
  planningResult: any = null;
  loading: boolean = false;


  selectedSection = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.updatePatientList();
    this.updateStaffList();
    this.updateOperationTypeList();
    this.getSpecs();
  }

  showSection(section: string) {
    this.selectedSection = section;
    // Clear messages when switching sections
    this.errorMessage = '';
    this.successMessage = '';
    this.selectedPatient = null;
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

formatDate(dateString: string): string {
  // dateString is in format 'YYYY-MM-DD'
  return dateString.replace(/-/g, '');
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
  const patientData = {
    firstName,
    lastName,
    fullName,
    birthDate,
    sex,
    email,
    phone,
    emergencyContact
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
  cancelUpdatePatient() {
  this.selectedPatient = null;
  this.errorMessage = '';
  this.successMessage = '';
  }

  async submitUpdatePatient() {
  if (!this.selectedPatient) {
    this.errorMessage = 'No patient selected for update.';
    return;
  }

  if (
    !this.selectedPatient.firstName ||
    !this.selectedPatient.lastName ||
    !this.selectedPatient.fullName ||
    !this.selectedPatient.birthDate ||
    !this.selectedPatient.sex ||
    !this.selectedPatient.email ||
    !this.selectedPatient.phone ||
    !this.selectedPatient.emergencyContact
  ) {
    this.errorMessage = 'Please fill in all required fields.';
    return;
  }

  if (new Date(this.selectedPatient.birthDate) > new Date()) {
    this.errorMessage = 'Deadline date must be in the past.';
    return;
  }

  try {
    // Proceed to update the OperationRequest
    await this.adminService.updatePatient(this.selectedPatient);
    this.successMessage = 'Patient updated successfully.';
    this.selectedPatient = null;
    this.updatePatientList();
  } catch (error: any) {
    // Handle error based on error response
    if (error.status === 400) {
      this.errorMessage = error.error.message || 'Invalid input. Please check your data.';
    } else if (error.status === 404) {
      this.errorMessage = 'Patient not found.';
    } else {
      this.errorMessage = 'An error occurred while updating the patient. Please try again.';
    }
  }
  }

  updatePatientList() {
    this.adminService.getAllPatients().then((patientList: Patient[]) => {
      this.patientList = patientList;
      this.filteredPatientList = patientList;
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

  updateStaff(id: number,firstName: string,lastName: string,fullName: string,specializationId: string,email: string,phone: string): void {
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

  updateStaffList() {
    this.staffService.getAllStaff().then((staffList: Staff[]) => {
      this.staffList = staffList;
      this.filteredStaffList = staffList;
    });
  }

  cancelUpdate(): void {
  this.selectedStaff = null;
  this.successMessage = '';
  this.errorMessage = '';
  }

  selectStaffForUpdate(staff: Staff) {
    this.errorMessage = '';
    this.successMessage = '';
    // Create a copy of the patient to avoid mutating the list directly
    this.selectedStaff = staff;
  }

  getSpecs() {
    this.specializationService.getAllSpecilizations().then((specList: SpecializationSub[]) => {
      this.specList = specList;
    });
  }

  //Operation Type =========================================================================================================================================================================================================================================================

  updateOperationType(id: string, name: string, requiredStaff: string[], duration: string): void {
    const updateOperationType: OperationType = {
      id: id,
      name: name,
      requiredStaff: requiredStaff,
      duration: duration
    };
  
    this.operationTypeService.updateOperationType(id, updateOperationType).then(
      (response) => {
        this.successMessage = 'Operation type updated successfully.';
        this.updateOperationTypeList();
        this.selectedOperationType = null;
      },
      (error) => {
        this.errorMessage = 'Error updating operation type.';
      }
    );
    }
  
    updateOperationTypeList() {
      this.operationTypeService.getAllOperationTypes().then((operationTypeList: OperationType[]) => {
        this.operationTypeList = operationTypeList;
        this.filteredOperationTypeList = operationTypeList;
      });
    }
  
    cancelOperationTypeUpdate(): void {
    this.selectedOperationType = null;
    this.successMessage = '';
    this.errorMessage = '';
    }
  
    selectOperationTypeForUpdate(operationType: OperationType) {
      this.errorMessage = '';
      this.successMessage = '';
      // Create a copy of the patient to avoid mutating the list directly
      this.selectedOperationType = operationType;
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

submitStaffDeactivation(staffId: number) {}


//SEARCH CLASSES ______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

filterResults(query: string) {
  const lowerQuery = query.toLowerCase();

  // If the query is empty, reset the list to display all operations
  if (!lowerQuery) {
    this.filteredPatientList = [...this.patientList];
    return;
  }

  // Filter the list based on the query
  this.filteredPatientList = this.patientList.filter(op =>
    op.id.toString().toLowerCase() === lowerQuery ||
    op.firstName.toString().toLowerCase() === lowerQuery ||
    op.lastName.toString().toLowerCase()=== lowerQuery ||
    op.fullName.toString().toLowerCase() === lowerQuery ||
    op.birthDate.toString() === lowerQuery ||
    op.sex.toLowerCase() === lowerQuery ||
    op.email.toLowerCase() === lowerQuery ||
    op.phone.toLowerCase() === lowerQuery ||
    op.emergencyContact.toLowerCase() === lowerQuery
  );
}

filterStaffResults(query: string) {
  const lowerQuery = query.toLowerCase();

  // If the query is empty, reset the list to display all operations
  if (!lowerQuery) {
    this.filteredStaffList = [...this.staffList];
    return;
  }

  // Filter the list based on the query
  this.filteredStaffList.filter(op =>
    op.id.toString().toLowerCase().includes(lowerQuery) 
    || op.firstName.toString().toLowerCase().includes(lowerQuery)
    || op.lastName.toString().toLowerCase().includes(lowerQuery)
    || op.fullName.toString().toLowerCase().includes(lowerQuery)
    || op.specializationId.toString().toLowerCase().includes(lowerQuery)
    || op.email.toString().toLowerCase().includes(lowerQuery)
    || op.phone.toString().toLowerCase().includes(lowerQuery)
  );
}

updateStaffListSearch(filteredStaffList: Staff[]) {
  this.filteredStaffList = filteredStaffList;
}

checkIfStaffPhoneNumberExists(phoneNumber: string): boolean {
  const lowerPhoneNumber = phoneNumber.toLowerCase();

  // Check if the phone number exists in the staff list
  const staffExists = this.staffList.some(staff => staff.phone.toLowerCase() === lowerPhoneNumber);

  return staffExists;
}

checkIfStaffEmailExists(email: string): boolean {
  const lowerEmail = email.toLowerCase();

  // Check if the email exists in the staff list
  const emailExists = this.staffList.some(staff => staff.email.toLowerCase() === lowerEmail);

  return emailExists;
}

filterOperationTypeResults(query: string) {
  const lowerQuery = query.toLowerCase();

  // If the query is empty, reset the list to display all operations
  if (!lowerQuery) {
    this.filteredOperationTypeList = [...this.operationTypeList];
    return;
  }

  // Filter the list based on the query
  this.filteredOperationTypeList.filter(op =>
    op.id.toString().toLowerCase().includes(lowerQuery) 
    || op.name.toString().toLowerCase().includes(lowerQuery)
    || op.requiredStaff.toString().toLowerCase().includes(lowerQuery)
    || op.duration.toString().toLowerCase().includes(lowerQuery)
  );
}

updateOperationTypeListSearch(filteredOperationTypeList: OperationType[]) {
  this.filteredOperationTypeList = filteredOperationTypeList;
}



// ALGAV USER STORIES ________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

// 6.3.1
async startOptimizedPlanning() {
  this.errorMessage = '';
  this.successMessage = '';
  this.loading = true;
  this.planningResult = null;

  if (!this.roomNumber || !this.planningDate || !this.surgeriesList) {
    this.errorMessage = 'Please fill in all required fields.';
    this.loading = false;
    return;
  }

  const formattedDate = this.formatDate(this.planningDate);

  try {
    const result = await this.planningService.getOptimalSchedule(
      this.roomNumber,
      formattedDate,
      this.surgeriesList
    );
    this.planningResult = result;
    this.loading = false;
    this.successMessage = 'Optimized planning completed successfully.';
  } catch (error: any) {
    this.errorMessage = 'An error occurred during optimized planning.';
    this.loading = false;
  }
}

// 6.3.2

async performComplexityAnalysis() {
  this.errorMessage = '';
  this.successMessage = '';
  this.loading = true;
  this.planningResult = null;

  if (!this.roomNumber || !this.planningDate) {
    this.errorMessage = 'Please fill in all required fields.';
    this.loading = false;
    return;
  }

  const formattedDate = this.formatDate(this.planningDate);

  try {
    const result = await this.planningService.getComplexityAnalysis(
      this.roomNumber,
      formattedDate
    );
    this.planningResult = result;
    this.loading = false;
    this.successMessage = 'Complexity analysis completed successfully.';
  } catch (error: any) {
    this.errorMessage = 'An error occurred during complexity analysis.';
    this.loading = false;
  }
}


// 6.3.3

async startHeuristicPlanning() {
  this.errorMessage = '';
  this.successMessage = '';
  this.loading = true;
  this.planningResult = null;

  if (!this.roomNumber || !this.planningDate || !this.surgeriesList || !this.heuristic) {
    this.errorMessage = 'Please fill in all required fields.';
    this.loading = false;
    return;
  }

  const formattedDate = this.formatDate(this.planningDate);

  try {
    const result = await this.planningService.getHeuristicSchedule(
      this.roomNumber,
      formattedDate,
      this.surgeriesList,
      this.heuristic
    );
    this.planningResult = result;
    this.loading = false;
    this.successMessage = 'Heuristic planning completed successfully.';
  } catch (error: any) {
    this.errorMessage = 'An error occurred during heuristic planning.';
    this.loading = false;
  }
}


}
