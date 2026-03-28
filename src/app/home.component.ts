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

          <div class="actions">
            <button type="button" class="secondary" (click)="resetFilters()">
              Azzera filtri
            </button>
          </div>

          <label for="companySelect">Seleziona società</label>

          <div class="select-row">
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

          <p class="results-count">
            Società trovate: {{ filteredCompanies.length }}
          </p>
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
      background: #e2e8f0;
      color: #1f2937;
    }

    button:disabled {
      background: #94a3b8;
      cursor: not-allowed;
    }

    .results-count {
      margin: 14px 0 0;
      color: #475569;
      font-size: 0.95rem;
    }

    @media (max-width: 700px) {
      .filters-grid {
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

  fasceFatturatoTotale: string[] = [];
  fatturatiEsg: string[] = [];
  fasceDipendentiTotali: string[] = [];
  fasceDipendentiEsg: string[] = [];

  ngOnInit(): void {
    this.companiesService.getCompanies().subscribe({
      next: (data) => {
        this.companies = [...data].sort((a, b) =>
          (a.displayName || '').localeCompare(b.displayName || '', 'it', {
            sensitivity: 'base',
          })
        );

        this.fasceFatturatoTotale = this.getUniqueOptions(this.companies, 'fasciaFatturatoTotaleItalia');
        this.fatturatiEsg = this.getUniqueOptions(this.companies, 'fatturatoEsgItalia');
        this.fasceDipendentiTotali = this.getUniqueOptions(this.companies, 'fasciaDipendentiTotaliItalia');
        this.fasceDipendentiEsg = this.getUniqueOptions(this.companies, 'fasciaDipendentiEsgItalia');

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

  onFiltersChange(): void {
    this.applyFilters();
  }

  resetFilters(): void {
    this.selectedFasciaFatturatoTotale = '';
    this.selectedFatturatoEsg = '';
    this.selectedDipendentiTotali = '';
    this.selectedDipendentiEsg = '';
    this.selectedCompanyId = null;
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filteredCompanies = this.companies.filter((company) => {
      const matchesFasciaFatturatoTotale =
        !this.selectedFasciaFatturatoTotale ||
        (company as any).fasciaFatturatoTotaleItalia === this.selectedFasciaFatturatoTotale;

      const matchesFatturatoEsg =
        !this.selectedFatturatoEsg ||
        (company as any).fatturatoEsgItalia === this.selectedFatturatoEsg;

      const matchesDipendentiTotali =
        !this.selectedDipendentiTotali ||
        (company as any).fasciaDipendentiTotaliItalia === this.selectedDipendentiTotali;

      const matchesDipendentiEsg =
        !this.selectedDipendentiEsg ||
        (company as any).fasciaDipendentiEsgItalia === this.selectedDipendentiEsg;

      return (
        matchesFasciaFatturatoTotale &&
        matchesFatturatoEsg &&
        matchesDipendentiTotali &&
        matchesDipendentiEsg
      );
    });

    const selectedStillVisible = this.filteredCompanies.some(
      (company) => company.id === this.selectedCompanyId
    );

    if (!selectedStillVisible) {
      this.selectedCompanyId = null;
    }
  }

  private getUniqueOptions(companies: Company[], key: string): string[] {
    return [...new Set(
      companies
        .map((company) => ((company as any)[key] || '').trim())
        .filter((value) => value !== '')
    )].sort((a, b) => a.localeCompare(b, 'it', { sensitivity: 'base' }));
  }
}