import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/AuthService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Bookio.net - Gestió de Préstecs';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  isJocRoute(): boolean {
    return this.router.url === '/joc';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
