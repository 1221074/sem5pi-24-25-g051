import { Component, inject, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { PatientService } from 'src/app/service/patient.service';
import { Patient } from '../../interface/patient';
import { UserService } from 'src/app/service/user.service';


@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.scss'
})
export class PatientComponent implements OnInit {

  userService: UserService = inject(UserService);
  authService: AuthenticationService = inject(AuthenticationService);
  patientService: PatientService = inject(PatientService);
  selectedSection = '';
  errorMessage: string = '';
  successMessage: string = '';

  patient!: Patient;

  constructor() { }

  ngOnInit(): void {
    this.getPatient().then(patient => {
      this.patient = patient;
    }).catch(error => {
      this.errorMessage = error;
    });
  }

  getPatient() {
    const email = this.authService.getMailSession();
    if (email) {
      return this.patientService.getPatientByEmail(email.toString());
    } else {
      this.errorMessage = 'Email is undefined';
      return Promise.reject('Email is undefined');
    }
  }

  // UI METHODS

  // UPDATE METHODS_____________________________________________________________
  async submitUpdate() {
    try {
      console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', this.patient.id, this.patient.email);
      await this.patientService.updatePatient(this.patient.id.toString(), this.patient);
      this.successMessage = 'Patient profile updated successfully.';
    } catch (error: any) {
      // Handle error based on error response
      if (error.status === 400) {
        this.errorMessage = error.error.message || 'Invalid input. Please check your data.';
      } else if (error.status === 404) {
        this.errorMessage = 'Profile not found.';
      } else {
        this.errorMessage = 'An error occurred while updating your profile. Please try again.';
      }
    }
        
  }

  // DELETE METHODS_____________________________________________________________

  deleteAccount() {
    if (confirm('Are you sure you want to delete your profile?')) {
      this.patientService.deletePatient(this.patient.id.toString()).then(() => {
        this.successMessage = 'Your profile was deleted successfully.';
      }).catch(error => {
        this.errorMessage = 'An error occurred while deleting your profile. Please try again.';
      });
    }
    this.userService.deactivateUser(this.patient.id.toString());
    this.userService.deleteUser(this.patient.id.toString());
    this.logout();
  }  

  // DATA METHODS

  // NAVIGATION METHODS

  logout() {
    this.authService.logout();
  }


  showSection(section: string) {
    this.selectedSection = section;
    // Clear messages when switching sections
  }

}
