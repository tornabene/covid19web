import { Component, OnInit, NgZone, ViewChild, Injectable, EventEmitter } from "@angular/core";
import { OrdersService } from "./orders.service";
import { NgForm, FormControl, Validators, FormGroup } from "@angular/forms";
import * as mapboxgl from 'mapbox-gl';
import { GeoJson, FeatureCollection, KeyLabel } from './map';
import { environment } from '../environments/environment';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { MatCheckboxModule, MatCheckboxChange } from '@angular/material/checkbox';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Observable } from 'rxjs/Observable';
import {map, startWith, debounceTime, switchMap, catchError} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSelectionListChange } from '@angular/material/list';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent   {
  title = 'covid19web';
}