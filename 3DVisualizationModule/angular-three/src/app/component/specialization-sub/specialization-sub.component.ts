import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SpecializationSub } from '../../interface/specialization-sub';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-specialization-sub',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './specialization-sub.component.html',
  styleUrl: './specialization-sub.component.scss'
})
export class SpecializationSubComponent {
  @Input() specializationSub!: SpecializationSub;
}
