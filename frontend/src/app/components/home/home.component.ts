import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@services/UserService';
import { LoanService } from '@services/LoanService';
import { BookService } from '@services/BookService';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userName: string = '';
  activeLoans: number = 0;
  totalBooks: number = 0;
  userRating: string = '5.0';
  loading: boolean = true;

  constructor(
    private userService: UserService,
    private loanService: LoanService,
    private bookService: BookService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // Obtenir perfil de l'usuari
    this.userService.getProfile().subscribe(
      (user: any) => {
        this.userName = user.name || 'Usuari';
        this.userRating = user.rating || '5.0';
      },
      (error: any) => {
        console.log('Error carregant perfil', error);
      }
    );

    // Obtenir els meus préstecs
    this.loanService.getMyLoans().subscribe(
      (loans: any) => {
        this.activeLoans = loans.length || 0;
      },
      (error: any) => {
        console.log('Error carregant préstecs', error);
      }
    );

    // Obtenir tots els llibres
    this.bookService.getAllBooks().subscribe(
      (books: any) => {
        this.totalBooks = books.length || 0;
        this.loading = false;
      },
      (error: any) => {
        console.log('Error carregant llibres', error);
        this.loading = false;
      }
    );
  }

  goToBooks(): void {
    this.router.navigate(['/books']);
  }

  goToLoans(): void {
    this.router.navigate(['/my-loans']);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
