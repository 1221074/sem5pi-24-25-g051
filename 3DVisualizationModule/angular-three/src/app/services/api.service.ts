import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // This makes the service available app-wide
})
export class ApiService {
  private apiUrl = 'http://localhost:7252'; // Replace with your .NET API URL

  constructor(private http: HttpClient) {}

  // Method to get values from the backend
  getItems(): Observable<string[]> {
    const endpoints = ['user', 'operationrequest', 'operationtype', 'patient'];

    const requests = endpoints.map(item =>
      this.http.get(`${this.apiUrl}/api/${item}`)
    );
    return forkJoin(requests) as Observable<string[]>;
  }

}
