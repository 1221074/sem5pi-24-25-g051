import {Injectable} from '@angular/core';
import {SpecializationSub} from '../interface/specialization-sub';
@Injectable({
  providedIn: 'root',
})
export class SpecializationService {
  url = 'http://localhost:5280/api/specialization';

  protected specializationList: SpecializationSub[] = [];

    async getAllSpecilizations(): Promise<SpecializationSub[]> {
      const data = await fetch(this.url);
      return await data.json() ?? [];
    }

    async getSpecializationByName(name: string): Promise<SpecializationSub | undefined> {
      const data = await fetch(`${this.url}/${name}`);
      return await data.json() ?? [];
    }
}
