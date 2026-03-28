import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Company, CompaniesService } from './companies.service';

@Component({
  selector: 'app-company-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="detail-page" *ngIf="!loading && company; else stateBlock">
      <a routerLink="/" class="back-link">← Torna alla selezione</a>

      <div class="detail-card">
        <h1>{{ company.displayName }}</h1>

        <p class="brand" *ngIf="company.brandConsulenzaEsg && company.brandConsulenzaEsg !== company.nomeSocieta">
          Brand ESG: {{ company.brandConsulenzaEsg }}
        </p>

        <div class="info-grid">
          <div class="info-box" *ngIf="company.annoFondazione">
            <h3>Anno fondazione</h3>
            <p>{{ company.annoFondazione }}</p>
          </div>

          <div class="info-box" *ngIf="company.annoInizioAttivitaEsg">
            <h3>Inizio attività ESG</h3>
            <p>{{ company.annoInizioAttivitaEsg }}</p>
          </div>

          <div class="info-box" *ngIf="company.telefono">
            <h3>Telefono</h3>
            <p>{{ company.telefono }}</p>
          </div>

          <div class="info-box" *ngIf="company.email">
            <h3>Email</h3>
            <p>{{ company.email }}</p>
          </div>

          <div class="info-box" *ngIf="company.sitoWeb">
            <h3>Sito web</h3>
            <p>
              <a [href]="formattedWebsite(company.sitoWeb)" target="_blank" rel="noopener noreferrer">
                {{ company.sitoWeb }}
              </a>
            </p>
          </div>

          <div class="info-box" *ngIf="company.rendicontaFattoriEsg">
            <h3>Rendicontazione ESG</h3>
            <p>{{ company.rendicontaFattoriEsg }}</p>
          </div>
        </div>

        <section *ngIf="company.purpose">
          <h2>Purpose</h2>
          <p>{{ company.purpose }}</p>
        </section>

        <section *ngIf="company.particolaritaConsulenzaEsg">
          <h2>Particolarità nella consulenza ESG</h2>
          <p>{{ company.particolaritaConsulenzaEsg }}</p>
        </section>

        <section *ngIf="company.progettoEsgSignificativo">
          <h2>Progetto ESG significativo</h2>
          <p>{{ company.progettoEsgSignificativo }}</p>
        </section>

        <div class="info-grid" *ngIf="company.fasciaFatturatoComplessivo || company.fatturatoEsg || company.fasciaNumeroDipendentiTotale || company.fasciaNumeroDipendentiEsg">
          <div class="info-box" *ngIf="company.fasciaFatturatoComplessivo">
            <h3>Fascia fatturato complessivo</h3>
            <p>{{ company.fasciaFatturatoComplessivo }}</p>
          </div>

          <div class="info-box" *ngIf="company.fatturatoEsg">
            <h3>Fatturato attività ESG</h3>
            <p>{{ company.fatturatoEsg }}</p>
          </div>

          <div class="info-box" *ngIf="company.fasciaNumeroDipendentiTotale">
            <h3>Numero complessivo dipendenti</h3>
            <p>{{ company.fasciaNumeroDipendentiTotale }}</p>
          </div>

          <div class="info-box" *ngIf="company.fasciaNumeroDipendentiEsg">
            <h3>Dipendenti in ambito ESG</h3>
            <p>{{ company.fasciaNumeroDipendentiEsg }}</p>
          </div>
        </div>

        <section *ngIf="company.sedi?.length">
          <h2>Sedi</h2>
          <ul>
            <li *ngFor="let sede of company.sedi">{{ sede }}</li>
          </ul>
        </section>

        <section *ngIf="company.clienti?.length">
          <h2>Clienti</h2>
          <ul>
            <li *ngFor="let cliente of company.clienti">{{ cliente }}</li>
          </ul>
        </section>

        <section *ngIf="company.servizi?.length">
          <h2>Servizi</h2>
          <div class="services">
            <span class="service-tag" *ngFor="let servizio of company.servizi">
              {{ servizio }}
            </span>
          </div>
        </section>
      </div>
    </div>

    <ng-template #stateBlock>
      <div class="detail-page">
        <a routerLink="/" class="back-link">← Torna alla selezione</a>

        <div class="detail-card" *ngIf="loading">
          <h1>Caricamento...</h1>
        </div>

        <div class="detail-card" *ngIf="!loading && error">
          <h1>Errore</h1>
          <p>{{ error }}</p>
        </div>

        <div class="detail-card" *ngIf="!loading && !error && !company">
          <h1>Società non trovata</h1>
        </div>
      </div>
    </ng-template>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: #f4f7fb;
      font-family: Arial, Helvetica, sans-serif;
      color: #1f2937;
    }

    .detail-page {
      max-width: 1000px;
      margin: 0 auto;
      padding: 32px 20px 48px;
    }

    .back-link {
      display: inline-block;
      margin-bottom: 20px;
      color: #2563eb;
      text-decoration: none;
      font-weight: 700;
    }

    .detail-card {
      background: white;
      border-radius: 20px;
      padding: 28px;
      box-shadow: 0 10px 28px rgba(15, 23, 42, 0.08);
    }

    h1 {
      margin: 0 0 8px;
    }

    .brand {
      color: #475569;
      margin-bottom: 24px;
      font-size: 1.05rem;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin: 24px 0;
    }

    .info-box {
      background: #f8fafc;
      border-radius: 14px;
      padding: 16px;
      border: 1px solid #e2e8f0;
    }

    .info-box h3 {
      margin: 0 0 8px;
      font-size: 0.95rem;
      color: #334155;
    }

    .info-box p {
      margin: 0;
      word-break: break-word;
    }

    section {
      margin-top: 28px;
    }

    section h2 {
      margin-bottom: 10px;
    }

    section p {
      line-height: 1.6;
    }

    ul {
      padding-left: 20px;
      margin: 0;
    }

    li {
      margin-bottom: 6px;
    }

    .services {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .service-tag {
      background: #dbeafe;
      color: #1d4ed8;
      padding: 8px 12px;
      border-radius: 999px;
      font-size: 0.95rem;
    }
  `],
})
export class CompanyDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private companiesService = inject(CompaniesService);
  private cdr = inject(ChangeDetectorRef);

  company: Company | null = null;
  loading = true;
  error = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.error = 'ID società non valido';
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    this.companiesService.getCompanyById(id).subscribe({
      next: (company) => {
        this.company = company;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Errore dettaglio società:', err);
        this.error = 'Errore nel caricamento della società';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  formattedWebsite(url: string): string {
    if (!url) return '';
    return url.startsWith('http://') || url.startsWith('https://')
      ? url
      : `https://${url}`;
  }
}