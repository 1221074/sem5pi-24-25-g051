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

  async getSystemAllergies(): Promise<Allergy[]> {
    const data = await fetch(environment.apiURL2 + '/allergy');
    return await data.json() ?? [];
  }

  async getSystemMedicalConditions(): Promise<MedicalCondition[]> {
    const data = await fetch(environment.apiURL2 + '/medicalcondition');
    return await data.json() ?? [];
  }

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

  createSurgeryAppointment(appointmentData: { patientId: string; doctorId: string; operationTypeId: string; appointmentDate: string; }) {
    throw new Error('Method not implemented.');
  }
  async createMedicalCondition(conditionData: MedicalRecord) {
    try {
      const response = await fetch(environment.apiURL2 + '/medicalcondition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(conditionData),
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

  async updatePatientMedicalRecord(id: string, patientData: any) {
    try {
      const response = await fetch(environment.apiURL2 + '/medicalrecord/' + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
        credentials: 'include',
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
}
