import {Injectable} from '@angular/core';
import {SpecializationSub} from '../interface/specialization-sub';
@Injectable({
  providedIn: 'root',
})
export class SpecializationService {
  url = 'https://10.9.25.158:7252/api/specialization';

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
}
