import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StockDataService, HistoricalData } from '../stock-data.service';

@Component({
  selector: 'app-live-data',
  templateUrl: './live-data.component.html',
  styleUrls: ['./live-data.component.css']
})
export class LiveDataComponent implements OnInit {


  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };


  historicalData: Observable<HistoricalData[]> = this.stockDataService.historicalData;

  seriesConfirmed: any[];
  seriesDeaths: any[];
 
  view: any[] = [    ];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Data';
  showYAxisLabel = true;
  yAxisLabel = 'Popolazione';


  constructor(private stockDataService: StockDataService) { }

  ngOnInit(): void {


    this.stockDataService.seriesConfirmed(4500)
      .subscribe(seriesConfirmed => {
        console.log(seriesConfirmed);
        this.seriesConfirmed = seriesConfirmed;
      });


    this.stockDataService.seriesDeaths(100)
      .subscribe(seriesDeaths => {
        console.log(seriesDeaths);
        this.seriesDeaths = seriesDeaths;
      });

  }



  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {

  }

}
