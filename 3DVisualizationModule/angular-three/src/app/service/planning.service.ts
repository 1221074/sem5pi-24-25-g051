import { Injectable } from '@angular/core';
import { SurgeryRoom } from '../interface/surgeryroom';

@Injectable({
  providedIn: 'root',
})
export class PlanningService {

  //url = localhost:5000

  private url = 'http://localhost:5000';


  constructor() {}

  private async fetchData(
    url: string,
    params: Record<string, any>,
    method: string = 'POST'
  ): Promise<any> {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    // Convert params to x-www-form-urlencoded format
    const body = new URLSearchParams(params).toString();

    const response = await fetch(url, {
      method,
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return response.json(); // Parse JSON response
  }


  async getOptimalSchedule(room: string, date: string, surgeries: string): Promise<any> {
    const url = 'http://localhost:5000/optimal_schedule';

    const params = new URLSearchParams({
      room,
      date,
      surgeries,
    });

    console.log(params.toString());
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error(`Error fetching optimal schedule: ${response.statusText}`);
    }

    return response.json();
  }


  async getHeuristicSchedule(room: string, date: string, surgeries: string, heuristic: string): Promise<any> {
    const url = '';
    console.log(heuristic);

    if (heuristic === 'earliest') {
      this.url = 'http://localhost:5000/heuristic_schedule_earliest';
    }else if (heuristic === 'maximized') {
      this.url = 'http://localhost:5000/heuristic_schedule_maximized';
    }

    console.log(this.url);

    const params = new URLSearchParams({
      room,
      date,
      surgeries,
    });

    console.log(params.toString());
    const response = await fetch(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error(`Error fetching heuristic schedule: ${response.statusText}`);
    }

    return response.json();
  }


  async getComplexityAnalysis(room: string, date: string): Promise<any> {
    return this.fetchData(this.url+'/complexity_analysis', { room, date });
  }

  getAllRooms(): Promise<SurgeryRoom[]> {
    //declare an array so i can place data
    let rooms: SurgeryRoom[] = [
      {"id": 1, "name": "or1"},
      {"id": 2, "name": "or2"},
      {"id": 3, "name": "or3"},
      {"id": 4, "name": "or4"},
      {"id": 5, "name": "or5"},
      {"id": 6, "name": "or6"},
      {"id": 7, "name": "or7"},
      {"id": 8, "name": "or8"},
      {"id": 9, "name": "or9"},
      {"id": 10, "name": "or10"},
    ];

    return Promise.resolve(rooms);
  }

}
