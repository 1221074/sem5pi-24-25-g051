import { Injectable } from '@angular/core';
import { OperationType } from '../interface/operationtype';

@Injectable({
  providedIn: 'root'
})
export class OperationTypeService {
  url = 'https://localhost:7252/api/operationtype';

  constructor() { }

  async getAllOperationTypes(): Promise<OperationType[]> {
    const data = await fetch(this.url);
    return await data.json() ?? [];
  }

}
