import { Injectable } from '@angular/core';
import { Patient } from '../interface/patient';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  url = 'https://localhost:7252/api/patient';

  constructor() {}

  async getAllPatients(): Promise<Patient[]> {
    const data = await fetch(this.url);
    return await data.json() ?? [];
  }
}
