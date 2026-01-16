import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoanService } from '@services/LoanService';

@Component({
  selector: 'app-admin-loans',
  templateUrl: './admin-loans.component.html',
  styleUrl: './admin-loans.component.css'
})
export class AdminLoansComponent implements OnInit {
  loans: any[] = [];
  loading: boolean = true;
  searchTerm: string = '';
  filterStatus: string = 'all';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private loanService: LoanService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLoans();
  }

  loadLoans(): void {
    this.loanService.getAllLoans().subscribe(
      (loans: any) => {
        this.loans = loans || [];
        this.loading = false;
      },
      (error: any) => {
        this.errorMessage = 'Error carregant els préstecs';
        this.loading = false;
      }
    );
  }

  get filteredLoans(): any[] {
    let result = this.loans;
    
    // Filter by status
    if (this.filterStatus !== 'all') {
      result = result.filter(loan => loan.estat === this.filterStatus);
    }
    
    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(loan =>
        loan.usuari?.nom?.toLowerCase().includes(term) ||
        loan.llibre?.titol?.toLowerCase().includes(term) ||
        loan.usuari?.email?.toLowerCase().includes(term)
      );
    }
    
    return result;
  }

  get activeCount(): number {
    return this.loans.filter(l => l.estat === 'ACTIU').length;
  }

  get returnedCount(): number {
    return this.loans.filter(l => l.estat === 'RETORNAT').length;
  }

  isOverdue(loan: any): boolean {
    const returnDate = new Date(loan.dataRetornaPrevista);
    const today = new Date();
    return returnDate < today && loan.estat === 'ACTIU';
  }

  getStatusClass(loan: any): string {
    if (this.isOverdue(loan)) return 'overdue';
    return loan.estat === 'ACTIU' ? 'active' : 'returned';
  }

  goBack(): void {
    this.router.navigate(['/profile']);
  }
}
