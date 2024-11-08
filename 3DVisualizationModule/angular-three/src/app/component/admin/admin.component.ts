import { ChangeDetectorRef, Component, NgZone } from '@angular/core';

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  selectedSection: string = '';

  constructor(private cdr: ChangeDetectorRef) {}

  showSection(section: string) {
    this.selectedSection = section;
    this.cdr.detectChanges(); // Manually trigger change detection
  }

}
