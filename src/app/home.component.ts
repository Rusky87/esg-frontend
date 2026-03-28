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
        <p>Seleziona una società dall’elenco per aprire la relativa scheda.</p>
      </header>

      <section class="filters">
        <label for="companySelect">Seleziona società</label>

        <p *ngIf="loading">Caricamento elenco società...</p>
        <p *ngIf="error">{{ error }}</p>

        <div class="select-row" *ngIf="!loading && !error">
          <select id="companySelect" [(ngModel)]="selectedCompanyId">
            <option [ngValue]="null">Scegli una società</option>
            <option *ngFor="let company of companies" [ngValue]="company.id">
              {{ company.displayName }}
            </option>
          </select>

          <button (click)="goToSelectedCompany()" [disabled]="selectedCompanyId === null">
            Apri scheda
          </button>
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

    button {
      border: none;
      border-radius: 12px;
      background: #0f766e;
      color: white;
      font-weight: 700;
      padding: 14px 16px;
      cursor: pointer;
    }

    button:disabled {
      background: #94a3b8;
      cursor: not-allowed;
    }

    @media (max-width: 700px) {
      .select-row {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class HomeComponent implements OnInit {
  private companiesService = inject(CompaniesService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  companies: Company[] = [];
  loading = true;
  error = '';
  selectedCompanyId: number | null = null;

  ngOnInit(): void {
    this.companiesService.getCompanies().subscribe({
      next: (data) => {
        this.companies = [...data].sort((a, b) =>
          (a.displayName || '').localeCompare(b.displayName || '', 'it', {
            sensitivity: 'base',
          })
        );

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
}