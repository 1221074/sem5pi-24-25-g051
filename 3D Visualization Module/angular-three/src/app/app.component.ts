import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  title = 'angular-three';
  values: string[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getValues().subscribe(
      (data) => (this.values = data),
      (error) => console.error(error)
    );
}
}
