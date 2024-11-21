import { Injectable } from '@angular/core';
import { OperationType } from '../interface/operationtype';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OperationTypeService {
  url = environment.apiURL + '/operationtype';

  constructor() { }

  async getAllOperationTypes(): Promise<OperationType[]> {
    const data = await fetch(this.url);
    return await data.json() ?? [];
  }

}
