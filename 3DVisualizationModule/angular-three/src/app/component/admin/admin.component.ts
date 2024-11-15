import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Patient } from '../../interface/patient';
import { AdminService } from '../../service/admin.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { AuthenticationService } from '../../service/authentication.service';

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

  //VARIABLES
  filteredPatientList: Patient[] = [];
  patientList: Patient[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  selectedSection = '';
  selectedPatient: Patient | null = null;

  constructor(private router: Router) {
    this.updatePatientList();
  }

  updatePatientList() {
    this.adminService.getAllPatients().then((patientList: Patient[]) => {
      this.patientList = patientList;
      this.filteredPatientList = patientList;
    });
  }

  updateListSearch(filteredPatientList: Patient[]) {
    this.filteredPatientList = filteredPatientList;
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
    FirstName: string,
    LastName: string,
    FullName: string,
    BrirthDate: string,
    Sex: string,
    Email: string,
    Phone: string,
    EmergencyContact: string)
{


this.errorMessage = '';
this.successMessage = '';

if (!FirstName || !LastName || !FullName || !BrirthDate || !Sex || !Email || !Phone || !EmergencyContact) {
  this.errorMessage = 'Please fill in all required fields.';
  return;
}

if (new Date(BrirthDate) > new Date()) {
 this.errorMessage = 'Birth date must be in the past.';
 return;
}
  const patientData = {
    FirstName,
    LastName,
    FullName,
    BrirthDate,
    Sex,
    Email,
    Phone,
    EmergencyContact
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

//UPDATE CLASSES

cancelUpdate() {
  this.selectedPatient = null;
  this.errorMessage = '';
  this.successMessage = '';
}

async submitUpdate() {
  if (!this.selectedPatient) {
    this.errorMessage = 'No patient selected for update.';
    return;
  }

  if (
    !this.selectedPatient.FirstName ||
    !this.selectedPatient.LastName ||
    !this.selectedPatient.FullName ||
    !this.selectedPatient.BrirthDate ||
    !this.selectedPatient.Sex ||
    !this.selectedPatient.Email ||
    !this.selectedPatient.Phone ||
    !this.selectedPatient.EmergencyContact
  ) {
    this.errorMessage = 'Please fill in all required fields.';
    return;
  }

  if (new Date(this.selectedPatient.BrirthDate) > new Date()) {
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


selectPatientForUpdate(patient: Patient) {
  this.errorMessage = '';
  this.successMessage = '';
  // Create a copy of the patient to avoid mutating the list directly
  this.selectedPatient = patient;
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
    op.FirstName.toString().toLowerCase() === lowerQuery ||
    op.LastName.toString().toLowerCase()=== lowerQuery ||
    op.FullName.toString().toLowerCase() === lowerQuery ||
    op.BrirthDate.toString() === lowerQuery ||
    op.Sex.toLowerCase() === lowerQuery ||
    op.Email.toLowerCase() === lowerQuery ||
    op.Phone.toLowerCase() === lowerQuery ||
    op.EmergencyContact.toLowerCase() === lowerQuery
  );
}

}
