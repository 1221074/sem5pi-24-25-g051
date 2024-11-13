import {Injectable} from '@angular/core';
import { Operationrequest } from '../interface/operationrequest';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  url = 'https://localhost:7252/api/operationrequest';

  constructor() {}

  async getAllDoctorOperations(): Promise<Operationrequest[]> {
    const data = await fetch(this.url);
    return await data.json() ?? [];
  }

  async getOperationOfDoctorById(id: string): Promise<Operationrequest | undefined> {
    const data = await fetch(`${this.url}/${id}`);
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

  async updateOperationRequest( operationData: any) {
    try {
      const response = await fetch(this.url, {
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
}
