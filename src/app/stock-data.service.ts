import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { series } from './dashboard/datachart'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface NameValPair {
  'name': string,
  'value': number
};

export interface HistoricalData {
  'name': string,
  'series': NameValPair[]
}

@Injectable({
  providedIn: 'root'
})

export class StockDataService {
  public historicalData: Subject<HistoricalData[]> = new Subject();
  constructor(private httpClient: HttpClient) {
  }

  // return dummy data
  getStaticData() {
    return series;
  }



  


  seriesDeaths(limit:number) {
    let apiURL = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";
    var httpOptions = {
      headers: new HttpHeaders(),
      'responseType': 'text' as 'json'
    }
    return this.httpClient.get<any>(apiURL, httpOptions)
      .pipe(
        map(csvData => {
          let series = this.csvToSeries(csvData,limit);
          return series;
        })
      );
  }


  seriesConfirmed(limit:number) {
    let apiURL = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
    var httpOptions = {
      headers: new HttpHeaders(),
      'responseType': 'text' as 'json'
    }
    return this.httpClient.get<any>(apiURL, httpOptions)
      .pipe(
        map(csvData => {
          let series = this.csvToSeries(csvData,limit);
          return series;
        })
      );
  }






  public csvToSeries(csv: string,limit:number) {
    var lines = csv.split("\n");
    var result = [];
    var mappa = {};

    var headers = lines[0].split(",");


    for (var i = 1; i < lines.length; i++) {
      var currentline = lines[i].split(",");
      var obj = {};
      var state = currentline[1];
      obj["name"] = state;
      
      if (mappa[state] == null) {
        mappa[state] = {};
      }
      for (var j = 4; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
        let name = headers[j];
        let value = new Number(currentline[j]);
        if (mappa[state][name] == null) {
          mappa[state][name] = value;
        } else {
          mappa[state][name] = mappa[state][name] + value;
        }
      }
    }

    
    let keys: string[] = Object.keys(mappa);
    keys.forEach(key => {
      var obj = {};
      obj["name"] = key;
      obj["series"] = [];

      var lastValue;
      let keys2: string[] = Object.keys(mappa[key]);
      keys2.forEach(key2 => {
        var obj2 = {};
        lastValue = mappa[key][key2];
        obj2["name"] = new Date(key2);
        obj2["value"] = lastValue;
       
        obj["series"].push(obj2);
      })

      if (lastValue > limit) {
        result.push(obj);
      }

    });

    
    return result;
  }



  public csvJSON(csv: string) {
    var lines = csv.split("\n");
    var result = [];

    var headers = lines[0].split(",");
    for (var i = 1; i < lines.length; i++) {

      var obj = {};
      var currentline = lines[i].split(",");
      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }
      result.push(obj);
    }
    return result;

  }



}