import { Component, inject, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { PatientService } from 'src/app/service/patient.service';
import { Patient } from '../../interface/patient';
import { UserService } from 'src/app/service/user.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.scss'
})
export class PatientComponent implements OnInit {

  //userService: UserService = inject(UserService);
  authService: AuthenticationService = inject(AuthenticationService);
  patientService: PatientService = inject(PatientService);
  selectedSection = '';
  errorMessage: string = '';
  successMessage: string = '';
  notificationMessage: string = '';

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
    const patientData = { ...this.patient }; // Cria um clone do objeto para evitar mutação acidental

    try {
      await this.patientService.updatePatient(this.patient.id.toString(), patientData);
      this.successMessage = 'Patient profile updated successfully.';
    } catch (error: any) {
      // Tratamento de erros com base no status
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

  async deactivateAccount() {
    if (confirm('Are you sure you want to deactivate your profile?')) {
      await this.patientService.deactivatePatient(this.patient.id.toString()).then(() => {
        this.successMessage = 'Your profile was deactivated successfully.';
      }).catch(error => {
        this.errorMessage = 'An error occurred while deactivating your profile. Please try again.';
      });
    }
  }

  async deleteAccount() {
    if (confirm('Are you sure you want to delete your profile?')) {
      await this.patientService.deletePatient(this.patient.id.toString()).then(() => {
        this.successMessage = 'Your profile was deleted successfully.';
      }).catch(error => {
        this.errorMessage = 'An error occurred while deleting your profile. Please try again.';
      });
      this.authService.logout();
    }
  }

  // DATA METHODS

  confirmDataDownload(): void {
    const userConfirmed = confirm(
      'Are you sure you want to download your personal data? ' +
      'We will send you an encrypted ZIP via email.'
    );

    if (userConfirmed) {
      // If user clicked "OK", proceed with sending the data
      this.downloadData();
    } else {
      // If user clicked "Cancel", notify them or just do nothing
      this.notificationMessage = 'Data download canceled.';
    }
  }

  async downloadData() {
    await this.patientService.downloadPersonalData(this.patient.id.toString()).then(() => {
      this.successMessage = 'Your data is being prepared. Check your email soon.';
    }).catch(error => {
      this.errorMessage = 'There was an error sending your data. Please try again later.';
    });

    //await this.patientService.downloadMedicalRecordData(this.patient.id.toString()).then(() => {
  }

  // NAVIGATION METHODS

  logout() {
    this.authService.logout();
  }


  showSection(section: string) {
    this.selectedSection = section;
    // Clear messages when switching sections
    this.errorMessage = '';
    this.successMessage = '';
  }

}
