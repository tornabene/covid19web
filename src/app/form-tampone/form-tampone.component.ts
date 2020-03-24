import { Component, OnInit, NgZone, ViewChild, Injectable, EventEmitter } from "@angular/core";
import { OrdersService } from "../orders.service";
import { NgForm, FormControl, Validators, FormGroup } from "@angular/forms";
import * as mapboxgl from 'mapbox-gl';
import { GeoJson, FeatureCollection, KeyLabel } from '../map';
import { environment } from '../../environments/environment';
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
  selector: 'app-form-tampone',
  templateUrl: './form-tampone.component.html',
  styleUrls: ['./form-tampone.component.css']
})
export class FormTamponeComponent  implements OnInit {
  
  @ViewChild('successSwal') 
  private successSwal: SwalComponent;
  
  
  
  inviata: boolean;
  map: mapboxgl.Map;
  geocoder: MapboxGeocoder;
  
  lat ;
  lng ;
  
  sintomi = [];
  informazioni = [];
  
  stateCtrl = new FormControl(Validators.required);
 
  public form = new FormGroup({
    nome: new FormControl("",Validators.required),
    email: new FormControl("",Validators.required),
    sesso: new FormControl("",Validators.required),
    eta: new FormControl("",Validators.required),
    via: this.stateCtrl,
  });
  
  filteredStates: Observable<GeoJson[]>;
  
  
  
  constructor(public ordersService: OrdersService, private _ngZone: NgZone,private http: HttpClient) {
    mapboxgl.accessToken = environment.mapbox.accessToken;
    this.filteredStates =     this.stateCtrl
    .valueChanges
    .pipe(
      debounceTime(300),
      switchMap(value => value? this.search(   value  ):[] )
      );
    }
    
    displayFn(data: GeoJson): string {
      return data ? data.place_name : '';
    }
    
    search(term: string): Observable<GeoJson[]> {
      console.log("search:"+term);
      let apiURL = "https://api.mapbox.com/geocoding/v5/mapbox.places/"+ term +".json?limit=10&country=it&proximity=15.000919000000067,38.14505&types=address&language=it&access_token=pk.eyJ1IjoidHRvcm5hYmVuZSIsImEiOiJjazd4Nm0zOTkwM3hwM2hzZnZlZ3RhemE3In0.BCYRvz2Pe1HC74gamBma8A";
      return this.http.get<FeatureCollection>(apiURL)
      .pipe(
        map( res => res.features )
        )
        
        // let apiURL = "https://maps.googleapis.com/maps/api/geocode/json?address="+ term +"&key="+ environment.googleapis.accessToken;
        // return this.http.get<any>(apiURL)
        // .pipe(
        //   map( res => res.results )
        //   )
        
      }
      
      onSelectionChanged(event: MatAutocompleteSelectedEvent) {
        console.log(event.option.value.geometry.coordinates );
        this.map.flyTo({
          center: event.option.value.geometry.coordinates
        })
      }
      
      ngOnInit() {
        this.inviata = false;
        this.initializeMap();
      }
  
      
      private initializeMap() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(position => {
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
            console.log(position.coords);
            // this.map.flyTo({
            //   center: [this.lng, this.lat]
            // })
          });
        }
        this.map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v11',
          zoom: 13,
        });
        // this.map.addControl(new mapboxgl.NavigationControl());
      }
      
      
      selectionChange1 = (event: MatSelectionListChange ) => {
        console.log(event.source._value   ) ;
        this.informazioni=event.source._value ;
      }
      selectionChange = (event: MatSelectionListChange ) => {
        console.log(event.source._value   ) ;
        this.sintomi=event.source._value ;
      }
      
      onSubmit() {
        let data = this.form.value;
        data.sintomi = this.sintomi;
        data.informazioni = this.informazioni;
        
        for (let item of this.ordersService.dizionarioSintomi) {
          if(  this.sintomi.indexOf(item.key) > -1 ){
            data[item.key]=true;
          }else{
            data[item.key]=false;
          }
        }
        
        for (let item of this.ordersService.dizionarioInformazioni) {
          if(  this.informazioni.indexOf(item.key) > -1 ){
            data[item.key]=true;
          }else{
            data[item.key]=false;
          }
        }
        
        
        if(this.lat){
          data.deviceLat = this.lat;
        }
        if(this.lng){
          data.deviceLng = this.lng;
        }
        if(this.stateCtrl.value!=null ){ 
          data.via = this.stateCtrl.value.place_name;
          if(this.stateCtrl.value.geometry!=null){
            data.viaLng = this.stateCtrl.value.geometry.coordinates[0];
            data.viaLat = this.stateCtrl.value.geometry.coordinates[1];
          }
        }
        data.dataCreazione = new Date();
        
        this.successSwal.fire();
        this.inviata =true;
        this.ordersService.createCoffeeOrder(data).then(res => {
        });
      }
      
      
    }