import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/AuthService';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register() {
    // Validar camps buits
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Tots els camps són obligatoris';
      return;
    }

    // Validar que les contrasenyes coincideixen
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Les contrasenyes no coincideixen';
      return;
    }

    // Validar longitud de contrasenya
    if (this.password.length < 6) {
      this.errorMessage = 'La contrasenya ha de tenir almenys 6 caràcters';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const newUser = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    this.authService.register(newUser).subscribe(
      (response: any) => {
        this.loading = false;
        this.successMessage = 'Registre exitós! Redirigint al login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      (error: any) => {
        this.loading = false;
        this.errorMessage = error.error.message || 'Error en el registre';
      }
    );
  }

  loginLink() {
    this.router.navigate(['/login']);
  }
}
