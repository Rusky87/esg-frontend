import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment';

export interface Company {
  id: number;
  nomeSocieta: string;
  brandConsulenzaEsg: string;
  displayName: string;
  sitoWeb: string;
  email: string;
  telefono: string;
  annoFondazione: string;
  annoInizioAttivitaEsg: string;
  fasciaFatturatoComplessivo: string;
  fatturatoEsg: string;
  progettoEsgSignificativo: string;
  particolaritaConsulenzaEsg: string;
  fasciaNumeroDipendentiTotale: string;
  fasciaNumeroDipendentiEsg: string;
  purpose: string;
  rendicontaFattoriEsg: string;
  sedi: string[];
  clienti: string[];
  servizi: string[];
}

@Injectable({
  providedIn: 'root',
})
export class CompaniesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/companies`;

  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(this.apiUrl).pipe(
      map((companies) => companies.map((company) => this.normalizeCompany(company)))
    );
  }

  getCompanyById(id: number): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl}/${id}`).pipe(
      map((company) => this.normalizeCompany(company))
    );
  }

private normalizeCompany(company: Partial<Company>): Company {
  const id = Number(company.id) || 0;
  const nomeSocieta = (company.nomeSocieta || '').trim();
  const brandConsulenzaEsg = (company.brandConsulenzaEsg || '').trim();
  const sitoWeb = (company.sitoWeb || '').trim();
  const annoFondazione = (company.annoFondazione || '').trim();
  const annoInizioAttivitaEsg =
    (company.annoInizioAttivitaEsg || '').trim() || annoFondazione;

  return {
    id,
    nomeSocieta,
    brandConsulenzaEsg,
    displayName:
      (company.displayName || '').trim() ||
      nomeSocieta ||
      brandConsulenzaEsg ||
      sitoWeb ||
      `Società ${id}`,
    sitoWeb,
    email: (company.email || '').trim(),
    telefono: (company.telefono || '').trim(),
    annoFondazione,
    annoInizioAttivitaEsg,
    fasciaFatturatoComplessivo: (company.fasciaFatturatoComplessivo || '').trim(),
    fatturatoEsg: (company.fatturatoEsg || '').trim(),
    progettoEsgSignificativo: (company.progettoEsgSignificativo || '').trim(),
    particolaritaConsulenzaEsg: (company.particolaritaConsulenzaEsg || '').trim(),
    fasciaNumeroDipendentiTotale: (company.fasciaNumeroDipendentiTotale || '').trim(),
    fasciaNumeroDipendentiEsg: (company.fasciaNumeroDipendentiEsg || '').trim(),
    purpose: (company.purpose || '').trim(),
    rendicontaFattoriEsg: (company.rendicontaFattoriEsg || '').trim(),
    sedi: Array.isArray(company.sedi) ? company.sedi.filter(Boolean) : [],
    clienti: Array.isArray(company.clienti) ? company.clienti.filter(Boolean) : [],
    servizi: Array.isArray(company.servizi) ? company.servizi.filter(Boolean) : [],
  };
}
}