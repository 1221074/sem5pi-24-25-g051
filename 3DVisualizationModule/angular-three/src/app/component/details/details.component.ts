import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SpecializationService } from '../../service/specialization.service';
import { SpecializationSub } from '../../interface/specialization-sub';


@Component({
  selector: 'app-details',
  standalone: true,
  imports: [],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
  	route: ActivatedRoute = inject(ActivatedRoute)
    specilizationService = inject(SpecializationService);
    specializationSub: SpecializationSub | undefined;

    constructor() {
      const specializationName = String(this.route.snapshot.params['specializationName']);
      this.specilizationService.getSpecializationByName(specializationName).then(specializationList => {
          this.specializationSub = specializationList;
        });
    }
  }
