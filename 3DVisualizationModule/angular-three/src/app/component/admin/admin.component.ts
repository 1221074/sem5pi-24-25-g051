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
import { SpecializationService } from '../../service/specialization.service';
import { SpecializationSub } from '../../interface/specialization-sub';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

  //SERVICE
  adminService: AdminService = inject(AdminService);
  userService: UserService = inject(UserService);
  authService: AuthenticationService = inject(AuthenticationService);
  staffService: StaffService = inject(StaffService);
  specializationService: SpecializationService= inject(SpecializationService);

  //VARIABLES

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

  selectedSection = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private router: Router) {
    this.updatePatientList();
    this.updateStaffList();
    this.getSpecs();
  }

  showSection(section: string) {
    this.selectedSection = section;
    // Clear messages when switching sections
    this.errorMessage = '';
    this.successMessage = '';
    this.selectedPatient = null;
  }

logout() {this.authService.logout();}
showHospital() {this.router.navigate(['/hospital']);}

//REGISTER CLASSES

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
  const newStaff = { firstName, lastName, fullName, specializationId, email, phone };
  this.staffService.postStaff(newStaff).then(
    response => {
      this.successMessage = 'Staff registered successfully!';
      this.errorMessage = '';
    }
  ).catch(
    error => {
      this.errorMessage = 'Failed to register staff. Please try again.';
      this.successMessage = '';
    }
  );
}

//UPDATE CLASSES
  //Patient
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

  //Staff
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

//REMOVE CLASSES

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


//SEARCH CLASSES

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

}
