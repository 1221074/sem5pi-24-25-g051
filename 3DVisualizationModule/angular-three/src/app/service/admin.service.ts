import {Injectable} from '@angular/core';
import { Patient } from '../interface/patient';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  patient_url = 'https://localhost:7252/api/patient';

  constructor() {}

  async getAllPatients(): Promise<Patient[]> {
    const data = await fetch(this.patient_url);
    return await data.json() ?? [];
  }

  async getPatientById(id: string): Promise<Patient | undefined> {
    const data = await fetch(`${this.patient_url}/${id}`);
        return await data.json() ?? [];
  }

  async postPatient(patientData: any) {
    try {
      const response = await fetch(this.patient_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
        credentials: 'include',
      });

      if (!response.ok) {
        // Handle non-200 responses
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error posting operation request');
      }

      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      // Handle or rethrow the error as appropriate
      throw error;
    }

    //http.post(this.patient_url, operationData).subscribe((data) => {
  }

  async updateOperationRequest( patientData: any) {
    try {
      const response = await fetch(this.patient_url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
        credentials: 'include',
      });

      if (!response.ok) {
        // Handle non-200 responses
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error updating operation request');
      }

      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      // Handle or rethrow the error as appropriate
      throw error;
    }
  }

  async deleteOperationRequest(id: string) {
    try {
      const response = await fetch(`${this.patient_url}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        // Handle non-200 responses
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error deleting operation request');
      }

      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      // Handle or rethrow the error as appropriate
      throw error;
    }
  }
}
