import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompaniesService {
  private http = inject(HttpClient);
  private apiUrl = 'https://esg-backend-w1xt.onrender.com';

  getCompanies(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}