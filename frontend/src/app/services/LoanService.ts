import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private apiUrl = 'http://localhost:5000/api/loans';

  constructor(private http: HttpClient) { }

  getMyLoans(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getLoanById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createLoan(llibreId: string, dataRetornaPrevista: string): Observable<any> {
    return this.http.post(this.apiUrl, { llibreId, dataRetornaPrevista });
  }

  getMyLoansUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/me`);
  }

  returnLoan(loanId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${loanId}/return`, {});
  }

  renewLoan(loanId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${loanId}/renew`, {});
  }

  // Funció d'Admin - Obtenir tots els préstecs
  getAllLoans(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
