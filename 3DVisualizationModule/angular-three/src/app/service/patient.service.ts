import { Injectable } from '@angular/core';
import { Patient } from '../interface/patient';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  url = environment.apiURL + '/patient';

  constructor() {}

  async getAllPatients(): Promise<Patient[]> {
    const data = await fetch(this.url);
    return await data.json() ?? [];
  }
}
