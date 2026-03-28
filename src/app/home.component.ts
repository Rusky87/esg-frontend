import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Company, CompaniesService } from './companies.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <header class="hero">
        <h1>Database consulenza ESG</h1>
        <p>Filtra l’elenco e seleziona una società per aprire la relativa scheda.</p>
      </header>

      <section class="filters">
        <p *ngIf="loading">Caricamento elenco società...</p>
        <p *ngIf="error">{{ error }}</p>

        <div *ngIf="!loading && !error">
          <label for="companySelect">Seleziona società</label>

          <div class="select-row top-select">
            <select id="companySelect" [(ngModel)]="selectedCompanyId">
              <option [ngValue]="null">Scegli una società</option>
              <option *ngFor="let company of filteredCompanies" [ngValue]="company.id">
                {{ company.displayName }}
              </option>
            </select>

            <button (click)="goToSelectedCompany()" [disabled]="selectedCompanyId === null">
              Apri scheda
            </button>
          </div>

          <div class="filters-grid">
            <div>
              <label for="fasciaFatturatoTotale">Fatturato totale</label>
              <select
                id="fasciaFatturatoTotale"
                [(ngModel)]="selectedFasciaFatturatoTotale"
                (ngModelChange)="onFiltersChange()"
              >
                <option value="">Tutte</option>
                <option *ngFor="let option of fasceFatturatoTotale" [value]="option">
                  {{ option }}
                </option>
              </select>
            </div>

            <div>
              <label for="fatturatoEsg">Fatturato ESG</label>
              <select
                id="fatturatoEsg"
                [(ngModel)]="selectedFatturatoEsg"
                (ngModelChange)="onFiltersChange()"
              >
                <option value="">Tutte</option>
                <option *ngFor="let option of fatturatiEsg" [value]="option">
                  {{ option }}
                </option>
              </select>
            </div>

            <div>
              <label for="dipendentiTotali">Dipendenti totali</label>
              <select
                id="dipendentiTotali"
                [(ngModel)]="selectedDipendentiTotali"
                (ngModelChange)="onFiltersChange()"
              >
                <option value="">Tutte</option>
                <option *ngFor="let option of fasceDipendentiTotali" [value]="option">
                  {{ option }}
                </option>
              </select>
            </div>

            <div>
              <label for="dipendentiEsg">Dipendenti ESG</label>
              <select
                id="dipendentiEsg"
                [(ngModel)]="selectedDipendentiEsg"
                (ngModelChange)="onFiltersChange()"
              >
                <option value="">Tutte</option>
                <option *ngFor="let option of fasceDipendentiEsg" [value]="option">
                  {{ option }}
                </option>
              </select>
            </div>
          </div>

          <div class="services-filter">
            <label>Servizi</label>

            <div class="services-grid">
              <label class="checkbox-item" *ngFor="let servizio of serviziOptions">
                <input
                  type="checkbox"
                  [checked]="selectedServizi.includes(servizio)"
                  (change)="onServiceToggle(servizio, $any($event.target).checked)"
                />
                <span>{{ servizio }}</span>
              </label>
            </div>
          </div>

          <div class="actions">
            <button type="button" class="secondary" (click)="resetFilters()">
              Azzera filtri
            </button>
          </div>

          <p class="results-count">
            Società trovate: {{ filteredCompanies.length }}
          </p>

          <div class="company-buttons" *ngIf="filteredCompanies.length > 0">
            <button
              type="button"
              class="company-chip"
              *ngFor="let company of filteredCompanies"
              (click)="openCompany(company.id)"
            >
              {{ company.displayName }}
            </button>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: #f4f7fb;
      color: #1f2937;
      font-family: Arial, Helvetica, sans-serif;
    }

    .page {
      max-width: 1100px;
      margin: 0 auto;
      padding: 32px 20px 48px;
    }

    .hero {
      background: linear-gradient(135deg, #0f766e, #2563eb);
      color: white;
      border-radius: 20px;
      padding: 32px;
      box-shadow: 0 12px 30px rgba(37, 99, 235, 0.18);
      margin-bottom: 24px;
    }

    .hero h1 {
      margin: 0 0 12px;
      font-size: 2rem;
    }

    .hero p {
      margin: 0;
      max-width: 720px;
      line-height: 1.5;
    }

    .filters {
      background: white;
      border-radius: 18px;
      padding: 24px;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
      margin-bottom: 24px;
    }

    .top-select {
      margin-bottom: 20px;
    }

    .filters-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
      margin-bottom: 16px;
    }

    label {
      display: block;
      font-weight: 700;
      margin-bottom: 12px;
    }

    select {
      width: 100%;
      padding: 14px 16px;
      border: 1px solid #d1d5db;
      border-radius: 12px;
      font-size: 1rem;
      background: #fff;
      box-sizing: border-box;
    }

    .services-filter {
      margin-bottom: 20px;
    }

    .services-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px 16px;
    }

    .checkbox-item {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-weight: 400;
      margin-bottom: 0;
    }

    .checkbox-item input {
      margin-top: 3px;
      width: auto;
      flex: 0 0 auto;
    }

    .checkbox-item span {
      line-height: 1.35;
    }

    .select-row {
      display: grid;
      grid-template-columns: 1fr 180px;
      gap: 12px;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 20px;
    }

    button {
      border: none;
      border-radius: 12px;
      background: #0f766e;
      color: white;
      font-weight: 700;
      padding: 14px 16px;
      cursor: pointer;
    }

    .secondary {
      background: #dc2626;
      color: white;
    }

    button:disabled {
      background: #94a3b8;
      cursor: not-allowed;
    }

    .results-count {
      margin: 14px 0 16px;
      color: #475569;
      font-size: 0.95rem;
    }

    .company-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .company-chip {
      background: #e0f2fe;
      color: #0f172a;
      border: 1px solid #bae6fd;
      padding: 10px 14px;
      border-radius: 999px;
    }

    @media (max-width: 700px) {
      .filters-grid {
        grid-template-columns: 1fr;
      }

      .services-grid {
        grid-template-columns: 1fr;
      }

      .select-row {
        grid-template-columns: 1fr;
      }

      .actions {
        justify-content: stretch;
      }

      .actions button {
        width: 100%;
      }
    }
  `],
})
export class HomeComponent implements OnInit {
  private companiesService = inject(CompaniesService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  companies: Company[] = [];
  filteredCompanies: Company[] = [];
  loading = true;
  error = '';
  selectedCompanyId: number | null = null;

  selectedFasciaFatturatoTotale = '';
  selectedFatturatoEsg = '';
  selectedDipendentiTotali = '';
  selectedDipendentiEsg = '';
  selectedServizi: string[] = [];

  fasceFatturatoTotale: string[] = [];
  fatturatiEsg: string[] = [];
  fasceDipendentiTotali: string[] = [];
  fasceDipendentiEsg: string[] = [];
  serviziOptions: string[] = [];

  private readonly allowedServizi = [
    'Asseverazione bilanci di sostenibilità',
    'Carbon footprint neutrality',
    'Certificazione/asseverazione',
    'Comunicazione',
    'Consulenza Finanziaria',
    'Consulenza su società benefit',
    'Compliance',
    'Diversity & Inclusion policy',
    'Esg Data Management',
    'Efficientamento energetico',
    'Governance Esg',
    'HR formazione',
    'Investor relation',
    'Life Cycle Assessment',
    'Procurement',
    'Rating di sostenibilità e Esg emissione',
    'Rating di sostenibilità e Esg supporto',
    'Rendicontazione/reporting',
    'Risk management',
    'Shareholder engagement',
    'Stakeholder engagement',
    'Strategia: piani, obiettivi, azioni',
    'Supply chain analysis/management',
    'Sviluppo di tool/applicativi/software per raccolta dati ESG',
    'Third Party Opinion',
    'Waste management',
    'Water management',
  ];

  ngOnInit(): void {
    this.companiesService.getCompanies().subscribe({
      next: (data) => {
        this.companies = [...data].sort((a, b) =>
          (a.displayName || '').localeCompare(b.displayName || '', 'it', {
            sensitivity: 'base',
          })
        );

        this.fasceFatturatoTotale = this.getUniqueOptions(
          this.companies.map((c) => c.fasciaFatturatoComplessivo)
        );

        this.fatturatiEsg = this.getUniqueOptions(
          this.companies.map((c) => c.fatturatoEsg)
        );

        this.fasceDipendentiTotali = this.getUniqueOptions(
          this.companies.map((c) => c.fasciaNumeroDipendentiTotale)
        );

        this.fasceDipendentiEsg = this.getUniqueOptions(
          this.companies.map((c) => c.fasciaNumeroDipendentiEsg)
        );

        this.serviziOptions = this.allowedServizi;

        this.applyFilters();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Errore companies:', err);
        this.error = 'Errore nel caricamento delle aziende';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  goToSelectedCompany(): void {
    if (this.selectedCompanyId !== null) {
      this.router.navigate(['/societa', this.selectedCompanyId]);
    }
  }

  openCompany(id: number): void {
    this.router.navigate(['/societa', id]);
  }

  onFiltersChange(): void {
    this.applyFilters();
  }

  onServiceToggle(servizio: string, checked: boolean): void {
    if (checked) {
      if (!this.selectedServizi.includes(servizio)) {
        this.selectedServizi = [...this.selectedServizi, servizio];
      }
    } else {
      this.selectedServizi = this.selectedServizi.filter((s) => s !== servizio);
    }

    this.applyFilters();
  }

  resetFilters(): void {
    this.selectedFasciaFatturatoTotale = '';
    this.selectedFatturatoEsg = '';
    this.selectedDipendentiTotali = '';
    this.selectedDipendentiEsg = '';
    this.selectedServizi = [];
    this.selectedCompanyId = null;
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filteredCompanies = this.companies.filter((company) => {
      const matchesFasciaFatturatoTotale =
        !this.selectedFasciaFatturatoTotale ||
        company.fasciaFatturatoComplessivo === this.selectedFasciaFatturatoTotale;

      const matchesFatturatoEsg =
        !this.selectedFatturatoEsg ||
        company.fatturatoEsg === this.selectedFatturatoEsg;

      const matchesDipendentiTotali =
        !this.selectedDipendentiTotali ||
        company.fasciaNumeroDipendentiTotale === this.selectedDipendentiTotali;

      const matchesDipendentiEsg =
        !this.selectedDipendentiEsg ||
        company.fasciaNumeroDipendentiEsg === this.selectedDipendentiEsg;

      const normalizedCompanyServizi = (company.servizi || [])
        .map((s) => this.normalizeServizio(s))
        .filter((s) => this.allowedServiziNormalized.includes(s));

      const matchesServizi =
        this.selectedServizi.length === 0 ||
        this.selectedServizi.some((servizio) =>
          normalizedCompanyServizi.includes(this.normalizeServizio(servizio))
        );

      return (
        matchesFasciaFatturatoTotale &&
        matchesFatturatoEsg &&
        matchesDipendentiTotali &&
        matchesDipendentiEsg &&
        matchesServizi
      );
    });

    const selectedStillVisible = this.filteredCompanies.some(
      (company) => company.id === this.selectedCompanyId
    );

    if (!selectedStillVisible) {
      this.selectedCompanyId = null;
    }
  }

  private get allowedServiziNormalized(): string[] {
    return this.allowedServizi.map((s) => this.normalizeServizio(s));
  }

  private normalizeServizio(value: string): string {
    return (value || '')
      .trim()
      .toLowerCase()
      .replace(/à/g, 'a')
      .replace(/è/g, 'e')
      .replace(/é/g, 'e')
      .replace(/ì/g, 'i')
      .replace(/ò/g, 'o')
      .replace(/ù/g, 'u')
      .replace(/\s+/g, ' ')
      .replace(/\//g, '/')
      .replace(/\s*,\s*/g, ', ');
  }

  private getUniqueOptions(values: string[]): string[] {
    return [...new Set(
      values
        .map((value) => (value || '').trim())
        .filter((value) => value !== '')
    )].sort((a, b) => a.localeCompare(b, 'it', { sensitivity: 'base' }));
  }
}