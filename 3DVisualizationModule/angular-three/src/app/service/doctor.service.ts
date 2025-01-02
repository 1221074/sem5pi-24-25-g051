import {Injectable} from '@angular/core';
import { Operationrequest } from '../interface/operationrequest';
import { environment } from '../../environments/environment';
import { Allergy } from '../interface/allergy';
import { MedicalCondition } from '../interface/medical-condition';
import { MedicalRecord } from '../interface/medical-record';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  url = environment.apiURL + '/operationrequest';

  constructor() {}

  async getAllDoctorOperations(): Promise<Operationrequest[]> {
    const data = await fetch(this.url);
    return await data.json() ?? [];
  }

  async getOperationOfDoctorById(id: string): Promise<Operationrequest | undefined> {
    const data = await fetch(`${this.url}/${id}`);
        return await data.json() ?? [];
  }

// SYSTEM DATA =================================================================================================

  async getSystemAllergies(): Promise<Allergy[]> {
    const data = await fetch(environment.apiURL2 + '/allergy');
    return await data.json() ?? [];
  }

  async getSystemMedicalConditions(): Promise<MedicalCondition[]> {
    const data = await fetch(environment.apiURL2 + '/medicalcondition');
    return await data.json() ?? [];
  }

  async getSystemMedicalRecords(): Promise<MedicalRecord[]> {
    const data = await fetch(environment.apiURL2 + '/medicalrecord');
    return await data.json() ?? [];
  }

//OPERATION REQUEST =================================================================================================

  async postOperationRequest(operationData: any) {
    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(operationData),
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

    //http.post(this.url, operationData).subscribe((data) => {
  }

  async updateOperationRequest(id: string, operationData: any) {
    try {
      const response = await fetch(`${this.url}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(operationData),
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
      const response = await fetch(`${this.url}/${id}`, {
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


  //MEDICAL RECORD =================================================================================================

  async updatePatientMedicalRecord(id: string, patientData: any) {
    try {
      const response = await fetch(environment.apiURL2 + '/medicalrecord/' + id, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData)
      });

      if (!response.ok) {
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

  async createMedicalRecord(data: any) {
    try {
      const response = await fetch(environment.apiURL2 + '/medicalrecord', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error creating medical record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
}
