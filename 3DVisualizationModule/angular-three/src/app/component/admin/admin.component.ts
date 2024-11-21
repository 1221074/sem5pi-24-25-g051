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
  selectedPatient: Patient | null = null;
  patientList: Patient[] =  [];

  //Staff
  staffSearchQuery: string = '';
  filteredStaffList: Staff[] = [];
  staffList: Staff[] = [];
  staffListToBeDisplayed: StaffDisplay[] = [];
  fullStaffListToBeDisplayed: StaffDisplay[] = [];
  selectedStaff: Staff | null = null;

  //Specializations
  specList: SpecializationSub [] = [];

  //Operation Types
  operationTypeSearchQuery: string = '';
  filteredOperationTypeList: OperationType[] = [];
  operationTypeList: OperationType[] = [];
  operationTypeListToBeDisplayed: OperationTypeDisplay[] = [];
  fullOperationTypeListToBeDisplayed: OperationTypeDisplay[] = [];
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
    this.getSpecs();
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

  getSpecs() {
    this.specializationService.getAllSpecilizations().then((specList: SpecializationSub[]) => {
      this.specList = specList;
    });
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
      this.operationTypeService.getAllOperationTypes().then((operationTypeList: OperationType[]) => {
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

updateStaffListSearch(filteredStaffList: StaffDisplay[]) {
  this.staffListToBeDisplayed = filteredStaffList;
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
