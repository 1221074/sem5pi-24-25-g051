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
}
