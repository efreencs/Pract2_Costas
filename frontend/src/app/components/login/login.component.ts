import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/AuthService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Tots els camps són obligatoris';
      return;
    }

    this.loading = true;
    this.authService.login(this.email, this.password).subscribe(
      (response: any) => {
        this.loading = false;
        // Guardar el token
        localStorage.setItem('token', response.token);
        // Redirigir a home
        this.router.navigate(['/home']);
      },
      (error: any) => {
        this.loading = false;
        this.errorMessage = error.error.message || 'Error en el login';
      }
    );
  }

  registerLink() {
    this.router.navigate(['/register']);
  }
}
