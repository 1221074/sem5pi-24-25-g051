import { AfterViewInit, Component, inject, Input } from '@angular/core';
import { Operationrequest } from '../../interface/operationrequest';
import { DoctorService } from '../../service/doctor.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../service/authentication.service';

declare var google: any;

@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.scss'
})
export class DoctorComponent  {

  //SERVICE
  doctorService: DoctorService = inject(DoctorService);
  authService: AuthenticationService = inject(AuthenticationService);

  //VARIABLES
  filteredOperationList: Operationrequest[] = [];
  operationList: Operationrequest[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  selectedSection = '';
  selectedOperation: Operationrequest | null = null;

  constructor(private router: Router) {
    this.updateList();
  }

//UI METHODS
  updateList() {
    this.doctorService.getAllDoctorOperations().then((operationList: Operationrequest[]) => {
      const loggedInDoctorId = this.authService.userId as string;
      // Filter operations where doctorId matches the logged-in user's ID
      this.operationList = operationList.filter(op => op.doctorId === loggedInDoctorId);

      // Initially set the filtered list to the filtered operation list
      this.filterResults(loggedInDoctorId);
    }).catch(error => {
      this.errorMessage = 'Failed to load operations. Please try again.';
    })
  }

  updateListSearch(filteredOperationList: Operationrequest[]) {
    this.filteredOperationList = filteredOperationList

  }

  showSection(section: string) {
    this.selectedSection = section;
    // Clear messages when switching sections
    this.errorMessage = '';
    this.successMessage = '';
    this.selectedOperation = null;
  }

  logout() {this.authService.logout();}

//REGISTER CLASSES

async registerOperation(
    patientId: string,
    doctorId: string,
    operationTypeId: string,
    deadlineDate: string,
    priorityState: string)
{

  this.errorMessage = '';
  this.successMessage = '';

  if (!patientId || !doctorId || !operationTypeId || !deadlineDate || !priorityState) {
    this.errorMessage = 'Please fill in all required fields.';
    return;
  }

  if (new Date(deadlineDate) <= new Date()) {
   this.errorMessage = 'Deadline date must be in the future.';
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

//UPDATE CLASSES

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

    if (
      !this.selectedOperation.patientId ||
      !this.selectedOperation.doctorId ||
      !this.selectedOperation.operationTypeId ||
      !this.selectedOperation.deadlineDate ||
      !this.selectedOperation.priorityState
    ) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    if (new Date(this.selectedOperation.deadlineDate) <= new Date()) {
      this.errorMessage = 'Deadline date must be in the future.';
      return;
    }

    try {
      // Proceed to update the OperationRequest
      await this.doctorService.updateOperationRequest(this.selectedOperation.id.toString(),this.selectedOperation);
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


  selectOperationForUpdate(operation: Operationrequest) {
    this.errorMessage = '';
    this.successMessage = '';
    // Create a copy of the operation to avoid mutating the list directly
    this.selectedOperation = operation;
  }

//REMOVE CLASSES

  submitRemoval(operationId: number) {
    if (confirm('Are you sure you want to remove this operation?')) {
      this.doctorService.deleteOperationRequest(operationId.toString()).then(() => {
        this.successMessage = 'Operation removed successfully.';
        this.updateList();
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
      this.filteredOperationList = [...this.operationList];
      return;
    }

    // Filter the list based on the query
    this.filteredOperationList = this.operationList.filter(op =>
      op.id.toString().toLowerCase() === lowerQuery ||
      op.patientId.toString().toLowerCase() === lowerQuery ||
      op.doctorId.toString().toLowerCase()=== lowerQuery ||
      op.operationTypeId.toString().toLowerCase() === lowerQuery ||
      op.deadlineDate.toString() === lowerQuery ||
      op.priorityState.toLowerCase() === lowerQuery
    );
  }
}

