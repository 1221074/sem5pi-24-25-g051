import { Injectable } from '@angular/core';
import { Patient } from '../interface/patient';
import { environment } from '../../environments/environment';
import { MedicalCondition } from '../interface/medical-condition';
import { Allergy } from '../interface/allergy';
import { MedicalRecord } from '../interface/medical-record';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  url = environment.apiURL + '/patient';

  constructor() {}

// PATIENT/MEDICALRECORD (GET) =================================================================================================

  async getAllPatients(): Promise<Patient[]> {
    const data = await fetch(this.url);
    return await data.json() ?? [];
  }

  async getPatientByEmail(email: string): Promise<Patient> {
    const data = await fetch(this.url + '/email/' + email);
    return await data.json() ?? [];
  }

  async getPatientById(id: string): Promise<Patient> {
    const data = await fetch(`${this.url}/${id}`);
    return await data.json() ?? [];
  }

  async getPatientByName(name: string): Promise<Patient> {
    const data = await fetch(this.url + '/name/' + name);
    return await data.json() ?? [];
  }

  async getPatientMedicalRecord(id: string): Promise<MedicalRecord> {
    const data = await fetch(environment.apiURL2 + '/medicalrecord/' + id);
    return await data.json() ?? [];
  }


// PATIENT (PUT, DELETE) =================================================================================================

  async updatePatient(id: string, patientData: any) {
    console.log(patientData);
    try {
      const response = await fetch(`${this.url}/${id}`, {
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
        throw new Error(errorData.message || 'Error updating your profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      // Handle or rethrow the error as appropriate
      throw error;
    }
  }

  async deactivatePatient(id: string) {
    try {
      const response = await fetch(`${this.url}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        // Handle non-200 responses
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error deactivating your profile');
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
      const response = await fetch(`${this.url}/${id}/hard`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        // Handle non-200 responses
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error deleting your profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      // Handle or rethrow the error as appropriate
      throw error;
    }
  }

  async downloadPersonalData(patientId: string):  Promise<Observable<any>> {
    try {
      const response = await fetch(this.url + `/${patientId}/sendEncryptedData`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        //body: JSON.stringify(patientId),
        credentials: 'include',
      });

      if (!response.ok) {
        // Handle non-200 responses
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error sending your data');
      }

      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      // Handle or rethrow the error as appropriate
      throw error;
    }
  }

  async downloadMedicalRecordData(patientId: string):  Promise<Observable<any>> {
    try {
      const response = await fetch(environment.apiURL2 + `/medicalrecord/${patientId}/${localStorage.getItem('email')}/sendEncryptedData`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        //body: JSON.stringify(patientId),
      });

      if (!response.ok) {
        // Handle non-200 responses
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error sending your data');
      }

      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      // Handle or rethrow the error as appropriate
      throw error;
    }
  }
}
