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
}
