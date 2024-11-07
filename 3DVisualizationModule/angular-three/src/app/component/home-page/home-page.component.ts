import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
//import { HomePageService } from '../../service/home-page.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  //  homePageService: HomePageService = inject(HomePageService);


    constructor(private router: Router) {}

    onClickToLogin() {
      this.router.navigate(['/login']);
  }
  onClickToPolicyPrivacy() {
    //this.router.navigate(['/policy-privacy']);
  }


}
