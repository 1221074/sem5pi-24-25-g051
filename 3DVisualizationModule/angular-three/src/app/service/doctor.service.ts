import {Injectable} from '@angular/core';
import { Operationrequest } from '../interface/operationrequest';
@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  url = 'https://localhost:7252/api/operationrequest';

  constructor() { }

  async getAllDoctorOperations(): Promise<Operationrequest[]> {
    const data = await fetch(this.url);
    return await data.json() ?? [];
  }

  async getOperationOfDoctorById(id: string): Promise<Operationrequest | undefined> {
    const data = await fetch(`${this.url}/${id}`);
        return await data.json() ?? [];
  }
}
