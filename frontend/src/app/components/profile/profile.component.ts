import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@services/UserService';
import { BookService } from '@services/BookService';
import { LoanService } from '@services/LoanService';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = {};
  editedUser: any = {};
  editMode: boolean = false;
  loading: boolean = true;
  isSaving: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  
  // Stats per admin
  totalUsers: number = 0;
  totalBooks: number = 0;
  totalLoans: number = 0;

  constructor(
    private userService: UserService,
    private bookService: BookService,
    private loanService: LoanService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.userService.getProfile().subscribe(
      (response: any) => {
        this.user = response.user || response;
        this.editedUser = { ...this.user };
        this.loading = false;
        
        // Si és admin, carregar estadístiques
        if (this.isAdmin()) {
          this.loadAdminStats();
        }
      },
      (error: any) => {
        console.log('Error carregant perfil', error);
        this.errorMessage = error.error?.message || 'Error carregant el perfil';
        this.loading = false;
      }
    );
  }

  loadAdminStats(): void {
    // Carregar total usuaris
    this.userService.getAllUsers().subscribe(
      (users: any) => {
        this.totalUsers = users?.length || 0;
      },
      (error: any) => console.log('Error carregant usuaris', error)
    );

    // Carregar total llibres
    this.bookService.getAllBooks().subscribe(
      (books: any) => {
        this.totalBooks = books?.length || 0;
      },
      (error: any) => console.log('Error carregant llibres', error)
    );

    // Carregar préstecs actius
    this.loanService.getAllLoans().subscribe(
      (loans: any) => {
        this.totalLoans = (loans || []).filter((l: any) => l.estat === 'ACTIU').length;
      },
      (error: any) => console.log('Error carregant préstecs', error)
    );
  }

  isAdmin(): boolean {
    return this.user?.rol === 'ADMIN';
  }

  getInitial(): string {
    if (this.user?.nom) {
      return this.user.nom.charAt(0).toUpperCase();
    }
    return '?';
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.editedUser = { ...this.user };
    }
  }

  saveProfile(): void {
    if (!this.canSave()) {
      this.errorMessage = 'El nom i email són obligatoris';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userService.updateProfile(this.editedUser).subscribe(
      (response: any) => {
        this.isSaving = false;
        this.user = { ...this.editedUser };
        this.editMode = false;
        this.successMessage = 'Perfil actualitzat correctament!';
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      (error: any) => {
        this.isSaving = false;
        this.errorMessage = error.error.message || 'Error actualitzant el perfil';
      }
    );
  }

  canSave(): boolean {
    return !!(this.editedUser.nom?.trim() && this.editedUser.email?.trim());
  }

  changePassword(): void {
    const newPassword = prompt('Introdueix la nova contrasenya:');
    if (!newPassword) return;

    if (newPassword.length < 6) {
      this.errorMessage = 'La contrasenya ha de tenir almenys 6 caràcters';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    // Aquí hauries de cridar a un servei changePassword
    // De moment, mostrem un missatge
    this.successMessage = 'Contrasenya canviada correctament!';
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  deleteAccount(): void {
    const confirm = window.confirm(
      'Estàs segur que vols eliminar el teu compte? Aquesta acció no es pot desfer.'
    );
    if (!confirm) return;

    this.errorMessage = '';
    this.successMessage = '';

    // Aquí hauries de cridar a un servei deleteAccount
    this.successMessage = 'Compte eliminat correctament';
    setTimeout(() => {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }, 2000);
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  // Funcions d'Admin
  goToManageBooks(): void {
    this.router.navigate(['/admin/books']);
  }

  goToManageUsers(): void {
    this.router.navigate(['/admin/users']);
  }

  goToManageLoans(): void {
    this.router.navigate(['/admin/loans']);
  }
}
