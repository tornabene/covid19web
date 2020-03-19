import { Component, OnInit, NgZone, ViewChild, Injectable } from "@angular/core";
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFirestore } from 'angularfire2/firestore';
import { OrdersService } from "./orders.service";
import { NgForm, FormControl, Validators } from "@angular/forms";
import * as mapboxgl from 'mapbox-gl';
import { GeoJson, FeatureCollection } from './map';
import { environment } from '../environments/environment';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { MatCheckboxModule, MatCheckboxChange } from '@angular/material/checkbox';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Observable } from 'rxjs/Observable';
import {map, startWith, debounceTime, switchMap, catchError} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})




export class AppComponent implements OnInit {
  @ViewChild('successSwal') private successSwal: SwalComponent;
  title = 'covid19web';
  nome: string;
  via: string;
  inviata: boolean;
  map: mapboxgl.Map;
  geocoder: MapboxGeocoder;
  
  lat ;
  lng ;
  
  
  // data
  source: any;
  markers: any;
  
  point;
  sintomi = [];
  
  dizionarioSintomi :string[]= [
    "Febbre",
    "Tosse secca",
    "Difficolta respirazione",
    "Calo della voce",
    "Vomito",
    "Stanchezza",
    "Diarrea"
  ];
  
  stateCtrl = new FormControl(Validators.required);
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
      let apiURL = "https://api.mapbox.com/geocoding/v5/mapbox.places/"+ term +".json?limit=10&types=address&language=it&access_token=pk.eyJ1IjoidHRvcm5hYmVuZSIsImEiOiJjazd4Nm0zOTkwM3hwM2hzZnZlZ3RhemE3In0.BCYRvz2Pe1HC74gamBma8A";
      return this.http.get<FeatureCollection>(apiURL)
      .pipe(
        map( res => res.features )
        )
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
            this.map.flyTo({
              center: [this.lng, this.lat]
            })
          });
        }

        this.map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v11',
          zoom: 11,
        });
        // this.geocoder = new MapboxGeocoder({ // Initialize the geocoder
        //   accessToken: mapboxgl.accessToken, // Set the access token
        //   mapboxgl: mapboxgl, // Set the mapbox-gl instance
        //   marker: true, // Do not use the default marker style
        //   country:'it',
        //   language:'it',
        //   limit:10,
        //   types:'address',
        //   proximity: [this.lng, this.lat],
        //   getItemValue: e => {
        //     this._ngZone.run(() => {
        //       this.point = e;
        //       this.via = e.place_name
        //       console.log(e.place_name);
        //     });
        //     return e.place_name;
        //   }
        // });
        // document.getElementById('geocoder').appendChild(this.geocoder.onAdd(this.map));
        // this.map.addControl(this.geocoder, 'top-left');
        this.map.addControl(new mapboxgl.NavigationControl());
        // this.map.setView();
      }
      
      
      
      
      changeSintomo = (event: MatCheckboxChange, sintomo) => {
        if (event.checked) {
          this.sintomi.push(sintomo);
        } else {
          let index = this.sintomi.indexOf(sintomo);
          if (index > -1) this.sintomi.splice(index, 1);
        }
        
        
      }
      
      
      onSubmit() {
        let data = this.ordersService.form.value;

       data.sintomi = this.sintomi;
        if(this.lat){
          data.deviceLat = this.lat;
        }
        if(this.lng){
          data.deviceLng = this.lng;
        }
        if(this.stateCtrl.value!=null ){ 
          data.via = this.stateCtrl.value.place_name;
          data.viaLng = this.stateCtrl.value.geometry.coordinates[0];
          data.viaLat = this.stateCtrl.value.geometry.coordinates[1];
        }
        
        data.dataCreazione = new Date();
        
        this.successSwal.fire();
        this.inviata =true;
        this.ordersService.createCoffeeOrder(data).then(res => {
         
        });
      }
      
      
      
      
      // coffeeOrders;
      // getCoffeeOrders = () =>
      //   this.ordersService
      //     .getCoffeeOrders()
      //     .subscribe(res => (this.coffeeOrders = res));
      
      
      
      // deleteOrder = data => this.ordersService.deleteCoffeeOrder(data);
      
      // markCompleted = data => this.ordersService.updateCoffeeOrder(data);
      
    }