import { Injectable } from '@angular/core';
import { Staff } from '../interface/staff';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  url = environment.apiURL + '/staff';

  constructor() {}

  async getAllStaff(): Promise<Staff[]> {
    const data = await fetch(this.url);
    return await data.json() ?? [];
  }

  async getStaffById(id: string): Promise<Staff | undefined> {
    const data = await fetch(`${this.url}/${id}`);
        return await data.json() ?? [];
  }

  async postStaff(staff: any) {
    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(staff),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Include the status in the error
        throw { status: response.status, message: errorData.message || 'Error posting staff profile' };
      }

      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }


  async updateStaff(id:string, staff: any) {
    try {
      const response = await fetch(`${this.url}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(staff),
        credentials: 'include',
      });

      if (!response.ok) {
        // Handle non-200 responses
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error updating staff profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      // Handle or rethrow the error as appropriate
      throw error;
    }
  }

  async deleteStaff(id: string) {
    try {
      const response = await fetch(`${this.url}/${id}/hard`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        // Handle non-200 responses
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error deleting staff profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      // Handle or rethrow the error as appropriate
      throw error;
    }
  }

  async deactivateStaff(id: string) {
    try {
      const response = await fetch(`${this.url}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        // Handle non-200 responses
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error deleting staff profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      // Handle or rethrow the error as appropriate
      throw error;
    }
  }

  async getAllActiveStaff() {
    try {
      const response = await fetch(`${this.url}/active`);
      if (!response.ok) {
        // Handle non-200 responses
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error getting active staff profiles');
      }

      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      // Handle or rethrow the error as appropriate
      throw error;
    }
  }
}
