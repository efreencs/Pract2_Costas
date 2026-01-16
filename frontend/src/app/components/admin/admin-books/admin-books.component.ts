import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '@services/BookService';

@Component({
  selector: 'app-admin-books',
  templateUrl: './admin-books.component.html',
  styleUrl: './admin-books.component.css'
})
export class AdminBooksComponent implements OnInit {
  books: any[] = [];
  loading: boolean = true;
  showModal: boolean = false;
  editingBook: any = null;
  bookForm: any = {
    titol: '',
    autor: '',
    isbn: '',
    categoria: '',
    any: new Date().getFullYear(),
    quantitatTotal: 1,
    quantitatDisponible: 1,
    descripcio: ''
  };
  successMessage: string = '';
  errorMessage: string = '';
  isSaving: boolean = false;
  searchTerm: string = '';

  categories: string[] = [
    'Ficció', 'No Ficció', 'Ciència', 'Història', 'Tecnologia',
    'Art', 'Filosofia', 'Poesia', 'Teatre', 'Novel·la', 'Infantil'
  ];

  constructor(
    private bookService: BookService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.getAllBooks().subscribe(
      (books: any) => {
        this.books = books || [];
        this.loading = false;
      },
      (error: any) => {
        this.errorMessage = 'Error carregant els llibres';
        this.loading = false;
      }
    );
  }

  get filteredBooks(): any[] {
    if (!this.searchTerm) return this.books;
    const term = this.searchTerm.toLowerCase();
    return this.books.filter(book =>
      book.titol?.toLowerCase().includes(term) ||
      book.autor?.toLowerCase().includes(term) ||
      book.isbn?.toLowerCase().includes(term)
    );
  }

  openCreateModal(): void {
    this.editingBook = null;
    this.bookForm = {
      titol: '',
      autor: '',
      isbn: '',
      categoria: '',
      any: new Date().getFullYear(),
      quantitatTotal: 1,
      quantitatDisponible: 1,
      descripcio: ''
    };
    this.showModal = true;
  }

  openEditModal(book: any): void {
    this.editingBook = book;
    this.bookForm = { ...book };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingBook = null;
    this.errorMessage = '';
  }

  saveBook(): void {
    if (!this.bookForm.titol || !this.bookForm.autor) {
      this.errorMessage = 'El títol i autor són obligatoris';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    if (this.editingBook) {
      this.bookService.updateBook(this.editingBook._id, this.bookForm).subscribe(
        (response: any) => {
          this.isSaving = false;
          this.successMessage = 'Llibre actualitzat correctament!';
          this.closeModal();
          this.loadBooks();
          setTimeout(() => this.successMessage = '', 3000);
        },
        (error: any) => {
          this.isSaving = false;
          this.errorMessage = error.error?.message || 'Error actualitzant el llibre';
        }
      );
    } else {
      this.bookService.createBook(this.bookForm).subscribe(
        (response: any) => {
          this.isSaving = false;
          this.successMessage = 'Llibre creat correctament!';
          this.closeModal();
          this.loadBooks();
          setTimeout(() => this.successMessage = '', 3000);
        },
        (error: any) => {
          this.isSaving = false;
          this.errorMessage = error.error?.message || 'Error creant el llibre';
        }
      );
    }
  }

  deleteBook(book: any): void {
    if (!confirm(`Estàs segur que vols eliminar "${book.titol}"?`)) return;

    this.bookService.deleteBook(book._id).subscribe(
      (response: any) => {
        this.successMessage = 'Llibre eliminat correctament!';
        this.loadBooks();
        setTimeout(() => this.successMessage = '', 3000);
      },
      (error: any) => {
        this.errorMessage = error.error?.message || 'Error eliminant el llibre';
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/profile']);
  }
}
