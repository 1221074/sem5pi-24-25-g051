import { Component, inject, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.scss'
})
export class PatientComponent implements OnInit {

  authService: AuthenticationService = inject(AuthenticationService);
  selectedSection = '';
  errorMessage: string = '';
  successMessage: string = '';


  constructor() { }

  ngOnInit(): void {}

  // UI METHODS


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
