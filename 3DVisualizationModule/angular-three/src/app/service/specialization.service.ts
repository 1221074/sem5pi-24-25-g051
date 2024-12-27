import {Injectable} from '@angular/core';
import {SpecializationSub} from '../interface/specialization-sub';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SpecializationService {
  url = environment.apiURL + '/specialization';

  //protected specializationList: SpecializationSub[] = [];
  constructor() { }

  async getAllSpecilizations(): Promise<SpecializationSub[]> {
    const data = await fetch(this.url);
    return await data.json() ?? [];
  }

  async getSpecializationByName(id: string): Promise<SpecializationSub | undefined> {
    const data = await fetch(`${this.url}/${id}`);
        return await data.json() ?? [];
  }

  async postSpecialization(spec: any) {
    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(spec),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Include the status in the error
        throw { status: response.status, message: errorData.message || 'Error posting specialization' };
      }

      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async updateSpecialization(id:string, specialization: any) {
    try {
      const response = await fetch(`${this.url}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(specialization),
        credentials: 'include',
      });

      if (!response.ok) {
        // Handle non-200 responses
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error updating specialization');
      }

      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      // Handle or rethrow the error as appropriate
      throw error;
    }
  }

  async deleteSpecialization(id: string) {
    try {
      const response = await fetch(`${this.url}/${id}/hard`, {
        method: 'DELETE',
        credentials: 'include',
      });
  
      if (!response.ok) {
        // Handle non-200 responses
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error deleting specialization');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      // Handle or rethrow the error as appropriate
      throw error;
    }
  }
}
