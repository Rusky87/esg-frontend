import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { CompanyDetailComponent } from './company-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'societa/:id', component: CompanyDetailComponent },
];