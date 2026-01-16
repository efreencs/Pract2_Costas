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
  loaningBookId: string = '';
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
        this.errorMessage = error.error?.message || 'Error carregant els llibres';
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
      book.titol.toLowerCase().includes(query) ||
      book.autor.toLowerCase().includes(query)
    );
  }

  borrowBook(bookId: string): void {
    if (this.isLoaning) return; // Evitar doble click

    this.isLoaning = true;
    this.loaningBookId = bookId;
    this.errorMessage = '';
    this.successMessage = '';

    // Data de retorn: 14 dies des d'ara
    const dataRetorn = new Date();
    dataRetorn.setDate(dataRetorn.getDate() + 14);
    const dataRetornStr = dataRetorn.toISOString();

    console.log('Enviant préstec amb:', { llibreId: bookId, dataRetornaPrevista: dataRetornStr });

    this.loanService.createLoan(bookId, dataRetornStr).subscribe({
      next: (response: any) => {
        this.isLoaning = false;
        this.loaningBookId = '';
        this.successMessage = 'Préstec solicitat correctament!';
        // Actualitzar localment sense recarregar
        const book = this.books.find(b => b._id === bookId);
        if (book && book.quantitatDisponible > 0) {
          book.quantitatDisponible -= 1;
        }
        setTimeout(() => {
          this.successMessage = '';
        }, 4000);
      },
      error: (error: any) => {
        this.isLoaning = false;
        this.loaningBookId = '';
        this.errorMessage = error.error?.message || 'Error solicitant el préstec';
        // L'error desapareix després de 4 segons
        setTimeout(() => {
          this.errorMessage = '';
        }, 4000);
      }
    });
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }
}
