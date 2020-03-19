import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OrdersService } from "./orders.service";

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { HttpClientModule } from "@angular/common/http";
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ServiceWorkerModule } from '@angular/service-worker';
import {MatRadioModule} from '@angular/material/radio';
 
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule, 
    MatAutocompleteModule,
    MatRadioModule,
    HttpClientModule,
    SweetAlert2Module.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }) 
  ],
  providers: [OrdersService],
  bootstrap: [AppComponent]
})
export class AppModule { }
