import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PlanningService {
  constructor() {}

  async getOptimalSchedule(room: string, date: string, surgeries: string): Promise<any> {
    const url = `/api/OptimalSchedule?room=${encodeURIComponent(room)}&date=${encodeURIComponent(
      date
    )}&surgeries=${encodeURIComponent(surgeries)}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching optimal schedule: ${response.statusText}`);
    }
    return response.json();
  }

  async getHeuristicSchedule(room: string, date: string, surgeries: string, heuristic: string): Promise<any> {
    const url = `/api/HeuristicSchedule?room=${encodeURIComponent(room)}&date=${encodeURIComponent(
      date
    )}&surgeries=${encodeURIComponent(surgeries)}&heuristic=${encodeURIComponent(heuristic)}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching heuristic schedule: ${response.statusText}`);
    }
    return response.json();
  }

  async getComplexityAnalysis(room: string, date: string): Promise<any> {
    const url = `/api/ComplexityAnalysis?room=${encodeURIComponent(room)}&date=${encodeURIComponent(date)}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching complexity analysis: ${response.statusText}`);
    }
    return response.json();
  }
}
