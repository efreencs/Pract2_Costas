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
  errorMessage: string = '';

  constructor(
    private loanService: LoanService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLoans();
  }

  loadLoans(): void {
    this.loanService.getMyLoans().subscribe(
      (response: any) => {
        this.loans = response.loans || [];
        this.loading = false;
      },
      (error: any) => {
        console.log('Error carregant préstecs', error);
        this.errorMessage = error.error.message || 'Error carregant els préstecs';
        this.loading = false;
      }
    );
  }

  returnLoan(loanId: string): void {
    this.isReturning = true;
    this.loanService.returnLoan(loanId).subscribe(
      (response: any) => {
        this.isReturning = false;
        this.loadLoans();
      },
      (error: any) => {
        this.isReturning = false;
        this.errorMessage = error.error.message || 'Error retornant el llibre';
      }
    );
  }

  isOverdue(loan: any): boolean {
    const returnDate = new Date(loan.returnDate);
    const today = new Date();
    return returnDate < today && loan.status !== 'Retornat';
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }
}
