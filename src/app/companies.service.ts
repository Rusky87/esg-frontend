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

type ApiCompany = Partial<Company> & {
  annoInizioConsulenzaEsg?: string;
  fasciaFatturatoTotaleItalia?: string;
  fatturatoEsgItalia?: string;
  progettoEsg2024?: string;
  particolarita?: string;
  fasciaDipendentiTotaliItalia?: string;
  fasciaDipendentiEsgItalia?: string;
};

@Injectable({
  providedIn: 'root',
})
export class CompaniesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/companies`;

  getCompanies(): Observable<Company[]> {
    return this.http.get<ApiCompany[]>(this.apiUrl).pipe(
      map((companies) => companies.map((company) => this.normalizeCompany(company)))
    );
  }

  getCompanyById(id: number): Observable<Company> {
    return this.http.get<ApiCompany>(`${this.apiUrl}/${id}`).pipe(
      map((company) => this.normalizeCompany(company))
    );
  }

  private normalizeCompany(company: ApiCompany): Company {
    const id = Number(company.id) || 0;
    const nomeSocieta = (company.nomeSocieta || '').trim();
    const brandConsulenzaEsg = (company.brandConsulenzaEsg || '').trim();
    const sitoWeb = (company.sitoWeb || '').trim();
    const annoFondazione = (company.annoFondazione || '').trim();

    const annoInizioAttivitaEsg =
      (company.annoInizioAttivitaEsg || '').trim() ||
      (company.annoInizioConsulenzaEsg || '').trim() ||
      annoFondazione;

    const fasciaFatturatoComplessivo =
      (company.fasciaFatturatoComplessivo || '').trim() ||
      (company.fasciaFatturatoTotaleItalia || '').trim();

    const fatturatoEsg =
      (company.fatturatoEsg || '').trim() ||
      (company.fatturatoEsgItalia || '').trim();

    const progettoEsgSignificativo =
      (company.progettoEsgSignificativo || '').trim() ||
      (company.progettoEsg2024 || '').trim();

    const particolaritaConsulenzaEsg =
      (company.particolaritaConsulenzaEsg || '').trim() ||
      (company.particolarita || '').trim();

    const fasciaNumeroDipendentiTotale =
      (company.fasciaNumeroDipendentiTotale || '').trim() ||
      (company.fasciaDipendentiTotaliItalia || '').trim();

    const fasciaNumeroDipendentiEsg =
      (company.fasciaNumeroDipendentiEsg || '').trim() ||
      (company.fasciaDipendentiEsgItalia || '').trim();

    return {
      id,
      nomeSocieta,
      brandConsulenzaEsg,
      displayName:
        (company.displayName || '').trim() ||
        brandConsulenzaEsg ||
        nomeSocieta ||
        sitoWeb ||
        `Società ${id}`,
      sitoWeb,
      email: (company.email || '').trim(),
      telefono: (company.telefono || '').trim(),
      annoFondazione,
      annoInizioAttivitaEsg,
      fasciaFatturatoComplessivo,
      fatturatoEsg,
      progettoEsgSignificativo,
      particolaritaConsulenzaEsg,
      fasciaNumeroDipendentiTotale,
      fasciaNumeroDipendentiEsg,
      purpose: (company.purpose || '').trim(),
      rendicontaFattoriEsg: (company.rendicontaFattoriEsg || '').trim(),
      sedi: Array.isArray(company.sedi) ? company.sedi.filter(Boolean) : [],
      clienti: Array.isArray(company.clienti) ? company.clienti.filter(Boolean) : [],
      servizi: Array.isArray(company.servizi) ? company.servizi.filter(Boolean) : [],
    };
  }
}