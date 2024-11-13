import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  selectedSection: string = '';

  constructor(private router: Router) {}

  showSection(section: string) {
    this.selectedSection = section;
  }

  logout() {
    // Navigate to the HomePageComponent
    this.router.navigate(['/']);
  }

}
