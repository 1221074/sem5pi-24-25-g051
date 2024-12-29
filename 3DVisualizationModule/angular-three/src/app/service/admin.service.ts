import {Injectable} from '@angular/core';
import { Patient } from '../interface/patient';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AdminService {
  patient_url = environment.apiURL + '/patient';
  medicalRecordUrl = environment.apiURL2 + '/medicalrecord';

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
        throw new Error('Failed to create patient');
      }

      const createdPatient = await response.json();
      const patientId = createdPatient.id;

      console.log(patientId);

      // Create an empty medical record
      const medicalRecord = {
        patientId: patientId,
        allergies: [],
        medicalConditions: [],
        freeText: '',
        createdAt: new Date().toISOString(),
        updatedAt: '',
      };

      const medicalRecordResponse = await fetch(`${environment.apiURL2}/medicalrecord`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(medicalRecord),
        credentials: 'include',
      });

      if (!medicalRecordResponse.ok) {
        throw new Error('Failed to create medical record');
      }

      console.log('Medical record created successfully');

      return createdPatient;
    } catch (error) {
      console.error('Error:', error);
      // Handle or rethrow the error as appropriate
      throw error;
    }
  }

  async updatePatient( patientData: any) {
    try {
      const response = await fetch(`${this.patient_url}/${patientData.id}`, {
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
        throw new Error(errorData.message || 'Error updating Patient');
      }

      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      // Handle or rethrow the error as appropriate
      throw error;
    }
  }

  async deletePatient(id: string) {
    try {
      const response = await fetch(`${this.patient_url}/${id}/hard`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        // Handle non-200 responses
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error deleting Patient');
      }

      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      // Handle or rethrow the error as appropriate
      throw error;
    }
  }

  async createAllergy(allergyData: any) {
    try {
      const response = await fetch(environment.apiURL2 + '/allergy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(allergyData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error posting operation request');
      }

      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      // Handle or rethrow the error as appropriate
      throw error;
    }
  }


  async updateAllergy(allergyData: any) {
    try {
      const response = await fetch(environment.apiURL2 + `/allergy/${allergyData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(allergyData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error updating allergy');
      }

      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      // Handle or rethrow the error as appropriate
      throw error;
    }



  }
}
