import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../service/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [],
  templateUrl: './unauthorized.component.html',
})
export class UnauthorizedComponent implements AfterViewInit {

  message: string = "You've accessed a page that you don't have access to. Please log in again into the system.";

  constructor(private authService: AuthenticationService) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
  this.authService.logout();
  }, 5000);
}

}
