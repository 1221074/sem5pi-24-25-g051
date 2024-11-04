import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // This makes the service available app-wide
})
export class ApiService {
  private apiUrl = 'http://localhost:7252'; // Replace with your .NET API URL

  constructor(private http: HttpClient) {}

  // Method to get values from the backend
  getValues(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/api/user`);
  }

  // Add other methods as needed, like POST, PUT, DELETE
}
