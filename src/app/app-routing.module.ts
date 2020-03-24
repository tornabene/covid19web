import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormTamponeComponent } from './form-tampone/form-tampone.component';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { LiveDataComponent } from './live-data/live-data.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: '', component: FormTamponeComponent },
  { path: 'live', component: LiveDataComponent }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
