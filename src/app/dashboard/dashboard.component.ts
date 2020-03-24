import { OrdersService } from '../orders.service';
import { environment } from 'src/environments/environment';
import { Component, OnInit, NgZone, ViewChild, Injectable, EventEmitter } from "@angular/core";
import * as mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { map, startWith, debounceTime, switchMap, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Chart } from 'chart.js';
import { FeatureCollection, GeoJson } from '../map';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  title = 'covid19web dashboard';

  @ViewChild('valueBarsCanvas') valueBarsCanvas;
  private valueBarsChart: any;
  chartData = null;

  mapFull: mapboxgl.Map;
  geocoder: MapboxGeocoder;
  source: any;
  markers: any;


  constructor(public ordersService: OrdersService, private _ngZone: NgZone) {
    mapboxgl.accessToken = environment.mapbox.accessToken;
    this.getCoffeeOrders()
    this.getDataForChart()
  }

  ngOnInit() {
    this.initializeMap();
  }


  private initializeMap() {

    this.mapFull = new mapboxgl.Map({
      container: 'mapFull',
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: 4,
      center: [12.489827, 43.892668]
    });
    this.geocoder = new MapboxGeocoder({ // Initialize the geocoder
      accessToken: mapboxgl.accessToken, // Set the access token
      mapboxgl: mapboxgl, // Set the mapbox-gl instance
      marker: true, // Do not use the default marker style
      countries: 'it',
      language: 'it',
      limit: 10,
      types: 'address',
    });
    this.mapFull.addControl(this.geocoder, 'top-left');
    this.mapFull.addControl(new mapboxgl.NavigationControl());

    this.mapFull.on('load', (event) => {

      this.mapFull.addSource('firebase', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        },
        cluster: true,
        clusterMaxZoom: 6,
        clusterRadius: 50
      });
      this.source = this.mapFull.getSource('firebase')

      this.ordersService
        .valueChanges()
        .subscribe(result => {
          console.log('realtime map subscribe firebase...');
          let points: GeoJson[] = []
          for (let trans of result) {
            let point = new GeoJson([trans['viaLng'], trans['viaLat']], { "title": trans['via'] })
            points.push(point)
          }
          let data = new FeatureCollection(points)
          this.source.setData(data);
        });

      this.mapFull.addLayer({
        id: 'firebase',
        source: 'firebase',
        // type: 'symbol',
        // layout: {
        //   'text-field': ['get', 'title'],
        //   'text-size': 9,
        //   'text-transform': 'uppercase',
        //   'icon-image': 'rocket-15' 
        // },
        type: 'circle',
        // filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            100,
            '#f1f075',
            750,
            '#f28cb1'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            100,
            30,
            750,
            40
          ]
        },
        "interactive": true
      })

    })







  }

  //chart
  getDataForChart = () =>
    this.ordersService
      .valueChanges()
      .subscribe(result => {
        this.createCharts(result);
        // let points: GeoJson[] = [] 
        // for (let trans of  result) {
        //   points.push( new GeoJson( [trans['viaLat'],trans['viaLng'] ] ,trans['via'] ) )
        // }
        // let data = new FeatureCollection(points )
        // this.source.setData(data);
      });

  addDatasetAge(key, reportByMonth) {
    this.chartData[key] = "Fascia eta " + key
    reportByMonth[key] = 0;
  }
  addDataset(key, label, reportByMonth) {
    this.chartData[key] = label
    reportByMonth[key] = 0;
  }
  getReportValues(data) {
    this.chartData = {};
    let reportByMonth = {
    };

    this.addDataset('M', 'Maschio', reportByMonth);
    this.addDataset('F', 'Femmina', reportByMonth);
    this.addDataset('tamponePositivo', 'Tampone Positivo', reportByMonth);
    this.addDataset('isolamentoDomiciliare', 'Isolamento Domiciliare', reportByMonth);
    this.addDataset('famigliareInfetto', 'Famigliare Infetto', reportByMonth);
    this.addDataset('guarito', 'Guarito', reportByMonth);


    this.addDatasetAge('0-3', reportByMonth);
    this.addDatasetAge('4-9', reportByMonth);
    this.addDatasetAge('10-19', reportByMonth);
    this.addDatasetAge('20-39', reportByMonth);
    this.addDatasetAge('40-59', reportByMonth);
    this.addDatasetAge('60-79', reportByMonth);
    this.addDatasetAge('80+', reportByMonth);

    for (let trans of data) {
      reportByMonth[trans.sesso] += 1;
      if (trans.tamponePositivo) {
        reportByMonth['tamponePositivo']++;
      }
      if (trans.isolamentoDomiciliare) {
        reportByMonth['isolamentoDomiciliare']++;
      }
      if (trans.famigliareInfetto) {
        reportByMonth['famigliareInfetto']++;
      }
      if (trans.guarito) {
        reportByMonth['guarito']++;
      }

      if (trans.eta >= 0 && trans.eta <= 3) {
        reportByMonth['0-3']++;
      } else if (trans.eta >= 4 && trans.eta <= 9) {
        reportByMonth['4-9']++;
      } else if (trans.eta >= 10 && trans.eta <= 19) {
        reportByMonth['10-19']++;
      } else if (trans.eta >= 20 && trans.eta <= 39) {
        reportByMonth['20-39']++;
      } else if (trans.eta >= 40 && trans.eta <= 59) {
        reportByMonth['40-59']++;
      } else if (trans.eta >= 60 && trans.eta <= 79) {
        reportByMonth['60-79']++;
      } else if (trans.eta >= 80) {
        reportByMonth['80+']++;
      }

    }

    return Object.keys(reportByMonth).map(a => reportByMonth[a]);
  }


  createCharts(data) {
    console.log('createCharts');
    let chartData = this.getReportValues(data);

    // Create the chart
    this.valueBarsChart = new Chart(this.valueBarsCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: Object.keys(this.chartData).map(a => this.chartData[a]),
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
              return data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index];
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
                return value;
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