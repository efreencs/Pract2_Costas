import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  private apiUrl = 'http://localhost:5000/api/libraries';

  constructor(private http: HttpClient) { }

  getAllLibraries(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getLibraryById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getLibraryBooks(libraryId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${libraryId}/books`);
  }
}
