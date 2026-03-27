import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CompaniesService } from './companies.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  companies: any[] = [];
  loading = true;
  error = '';

  constructor(
    private companiesService: CompaniesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.companiesService.getCompanies().subscribe({
      next: (data) => {
        console.log('DATA ARRIVATA:', data);
        this.companies = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('ERRORE API:', err);
        this.error = 'Errore nel caricamento delle aziende';
        this.loading = false;
        this.cdr.detectChanges();
      },
      complete: () => {
        console.log('CHIAMATA COMPLETATA');
      },
    });
  }
}