import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SpecializationSubComponent } from '../specialization-sub/specialization-sub.component';
import { SpecializationSub } from '../../interface/specialization-sub';
import { SpecializationService } from '../../service/specialization.service';

@Component({
  selector: 'app-specialization',
  standalone: true,
  imports: [CommonModule,SpecializationSubComponent],
  templateUrl:  './specialization.component.html',
  styleUrl: './specialization.component.scss'
})
export class SpecializationComponent {
 specilizationService: SpecializationService = inject(SpecializationService);
 filteredSpecializationList: SpecializationSub[] = [];

  specializationList: SpecializationSub[] = []


  constructor() {
    this.specilizationService.getAllSpecilizations().then((specializationListA: SpecializationSub[]) => {
      this.specializationList = specializationListA;
      this.filteredSpecializationList = specializationListA;
    });}

  filterResults(text: string) {
    if (!text) this.filteredSpecializationList = this.specializationList;
    this.filteredSpecializationList = this.specializationList.filter((specialization => specialization.name.toLowerCase().includes(text.toLowerCase()))
  );
  }


  onSpecializationClick(specialization: SpecializationSub): void {
    console.log('Specialization clicked:', specialization);
    // Adicione aqui a lógica para lidar com o clique na especialização
  }
}
