import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoanService } from '@services/LoanService';

@Component({
  selector: 'app-my-loans',
  templateUrl: './my-loans.component.html',
  styleUrls: ['./my-loans.component.css']
})
export class MyLoansComponent implements OnInit {
  loans: any[] = [];
  loading: boolean = true;
  isReturning: boolean = false;
  returningLoanId: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private loanService: LoanService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLoans();
  }

  loadLoans(): void {
    this.loanService.getMyLoansUser().subscribe(
      (response: any) => {
        // Filtrar només préstecs actius
        this.loans = (response || []).filter((loan: any) => loan.estat === 'ACTIU');
        this.loading = false;
      },
      (error: any) => {
        console.log('Error carregant préstecs', error);
        this.errorMessage = error.error?.message || 'Error carregant els préstecs';
        this.loading = false;
      }
    );
  }

  returnLoan(loanId: string): void {
    if (this.isReturning) return; // Evitar doble click
    
    this.isReturning = true;
    this.returningLoanId = loanId;
    this.errorMessage = '';
    this.loanService.returnLoan(loanId).subscribe({
      next: (response: any) => {
        this.isReturning = false;
        this.returningLoanId = '';
        this.successMessage = 'Llibre retornat correctament!';
        // Treure el préstec de la llista
        this.loans = this.loans.filter(l => l._id !== loanId);
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error: any) => {
        this.isReturning = false;
        this.returningLoanId = '';
        this.errorMessage = error.error?.message || 'Error retornant el llibre';
      }
    });
  }

  isOverdue(loan: any): boolean {
    const returnDate = new Date(loan.dataRetornaPrevista);
    const today = new Date();
    return returnDate < today && loan.estat !== 'RETORNAT';
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }
}
