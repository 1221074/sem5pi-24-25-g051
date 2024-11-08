import { ChangeDetectorRef, Component } from '@angular/core';

@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [],
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.scss'
})
export class DoctorComponent {
  selectedSection: string = '';

  constructor(private cdr: ChangeDetectorRef) {}

  showSection(section: string) {
    this.selectedSection = section;
    this.cdr.detectChanges(); // Manually trigger change detection
  }


}
