import { Component, OnInit, NgZone, ViewChild, Injectable, EventEmitter } from "@angular/core";
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFirestore } from 'angularfire2/firestore';
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
import { Chart } from 'chart.js';
import { MatSelectionListChange } from '@angular/material/list';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})




export class AppComponent implements OnInit {
  title = 'covid19web';
  @ViewChild('successSwal') 
  private successSwal: SwalComponent;
  
  @ViewChild('valueBarsCanvas') valueBarsCanvas;
  private valueBarsChart: any;
  
  data: Observable<any[]>;
  chartData = null;
  
   
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
  informazioni = [];
  
  dizionarioSintomi :KeyLabel[]= [
    {key: "febbre" ,label:"Febbre" },
    {key: "tosseSecca" ,label:"Tosse secca" },
    {key: "difficoltaRespirazione" ,label:"Difficolta respirazione" },
    {key: "caloVoce" ,label:"Calo della voce" },
    {key: "vomito" ,label:"Vomito" },
    {key: "diarrea" ,label:"Diarrea" },
  ];
  
  
  dizionarioInformazioni :KeyLabel[]= [
    {key: "fattoTampone" ,label:"Fatto Tampone" },
    {key: "tamponePositivo" ,label:"Tampone Positivo" },
    {key: "famigliareInfetto" ,label:"Famigliare infetto" },
    {key: "isolamentoDomiciliare" ,label:"Isolamento Domiciliare" },
    {key: "riceverato" ,label:"Riceverato" },
  ];

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
    this.getCoffeeOrders()
    this.getDataForChart()
    
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
        
        for (let item of this.dizionarioSintomi) {
          if(  this.sintomi.indexOf(item.key) > -1 ){
            data[item.key]=true;
          }else{
            data[item.key]=false;
          }
        }

        for (let item of this.dizionarioInformazioni) {
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
      
      //chart
      getDataForChart = () =>
      this.ordersService
      .valueChanges()
      .subscribe(result => { 
        this.createCharts( result );
      });
      addDatasetAge( key, reportByMonth ) {
        this.chartData[key] = "Fascia eta "+key
        reportByMonth[key]=0;
      }
      addDataset( key,label, reportByMonth ) {
        this.chartData[key] = label
        reportByMonth[key]=0;
      }
      getReportValues(data) {
        this.chartData={};
        let reportByMonth = {
        };
        
        this.addDataset( 'M',  'Maschio',reportByMonth);
        this.addDataset( 'F',  'Femmina',reportByMonth);
        this.addDataset( 'tamponePositivo', 'Tampone Positivo' ,reportByMonth);
        this.addDataset( 'isolamentoDomiciliare',  'Isolamento Domiciliare' ,reportByMonth);
        this.addDataset( 'famigliareInfetto',  'Famigliare Infetto' ,reportByMonth);
        this.addDataset( 'guarito',  'Guarito' ,reportByMonth);
        
        
        this.addDatasetAge('0-3',reportByMonth);
        this.addDatasetAge('4-9',reportByMonth);
        this.addDatasetAge('10-19',reportByMonth);
        this.addDatasetAge('20-39',reportByMonth);
        this.addDatasetAge('40-59',reportByMonth);
        this.addDatasetAge('60-79',reportByMonth);
        this.addDatasetAge('80+',reportByMonth);
        
        for (let trans of  data) {
          reportByMonth[trans.sesso] +=1;
          if(trans.tamponePositivo){
            reportByMonth['tamponePositivo']++;
          }
          if(trans.isolamentoDomiciliare){
            reportByMonth['isolamentoDomiciliare']++;
          }
          if(trans.famigliareInfetto){
            reportByMonth['famigliareInfetto']++;
          }
          if(trans.guarito){
            reportByMonth['guarito']++;
          }
          
          if( trans.eta >=0 && trans.eta <= 3 ){
            reportByMonth['0-3']++;
          }else  if( trans.eta >= 4 && trans.eta <= 9 ){
            reportByMonth['4-9']++;
          }else if( trans.eta >= 10 && trans.eta <= 19){
            reportByMonth['10-19']++;
          }else if( trans.eta >= 20 && trans.eta <= 39){
            reportByMonth['20-39']++;
          }else if( trans.eta >= 40 && trans.eta <= 59){
            reportByMonth['40-59']++;
          }else if( trans.eta >= 60 && trans.eta <= 79){
            reportByMonth['60-79']++;
          }else if( trans.eta >= 80 ) {
            reportByMonth['80+']++;
          }  
          
        }
        
        return Object.keys(reportByMonth).map(a => reportByMonth[a]);
      }
      
      
      createCharts(data) {
        console.log( 'createCharts');
        let chartData = this.getReportValues(data);
        
        // Create the chart
        this.valueBarsChart = new Chart(this.valueBarsCanvas.nativeElement, {
          type: 'bar',
          data: {
            labels: Object.keys(  this.chartData ).map(a =>  this.chartData[a] ),
            datasets: [{
              data: chartData 
            }]
          },
          options: {
            legend: {
              display: false
            },
            tooltips: {
              callbacks: {
                label: function (tooltipItems, data) {
                  return data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index]  ;
                }
              }
            },
            scales: {
              xAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }],
              yAxes: [{
                ticks: {
                  callback: function (value, index, values) {
                    return value  ;
                  },
                  suggestedMin: 0
                }
              }]
            },
          }
        });
      }
      
      //table
      coffeeOrders;
      getCoffeeOrders = () =>
      this.ordersService
      .snapshotChanges()
      .subscribe(result => { 
        this.coffeeOrders = result
      });
      deleteOrder = data => this.ordersService.deleteCoffeeOrder(data);
      markCompleted = data => this.ordersService.updateCoffeeOrder(data);
      
      
    }