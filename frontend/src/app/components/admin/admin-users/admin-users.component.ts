import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@services/UserService';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];
  loading: boolean = true;
  searchTerm: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(
      (users: any) => {
        this.users = users || [];
        this.loading = false;
      },
      (error: any) => {
        this.errorMessage = 'Error carregant els usuaris';
        this.loading = false;
      }
    );
  }

  get filteredUsers(): any[] {
    if (!this.searchTerm) return this.users;
    const term = this.searchTerm.toLowerCase();
    return this.users.filter(user =>
      user.nom?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term)
    );
  }

  getRoleBadgeClass(rol: string): string {
    return rol === 'ADMIN' ? 'admin' : 'user';
  }

  goBack(): void {
    this.router.navigate(['/profile']);
  }
}
