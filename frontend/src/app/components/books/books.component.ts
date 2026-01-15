import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '@services/BookService';
import { LoanService } from '@services/LoanService';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  books: any[] = [];
  filteredBooks: any[] = [];
  searchQuery: string = '';
  loading: boolean = true;
  isLoaning: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private bookService: BookService,
    private loanService: LoanService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.getAllBooks().subscribe(
      (response: any) => {
        this.books = response.books || response;
        this.filteredBooks = this.books;
        this.loading = false;
      },
      (error: any) => {
        console.log('Error carregant llibres', error);
        this.errorMessage = error.error.message || 'Error carregant els llibres';
        this.loading = false;
      }
    );
  }

  filterBooks(): void {
    if (!this.searchQuery.trim()) {
      this.filteredBooks = this.books;
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredBooks = this.books.filter(book =>
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query)
    );
  }

  borrowBook(bookId: string): void {
    this.isLoaning = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.loanService.createLoan(bookId).subscribe(
      (response: any) => {
        this.isLoaning = false;
        this.successMessage = 'Préstec solicitat correctament!';
        setTimeout(() => {
          this.loadBooks();
          this.successMessage = '';
        }, 2000);
      },
      (error: any) => {
        this.isLoaning = false;
        this.errorMessage = error.error.message || 'Error solicitant el préstec';
      }
    );
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }
}
