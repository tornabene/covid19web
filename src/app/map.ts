export interface IGeometry {
    type: string;
    coordinates: number[];
}

export interface IGeoJson {
    type: string;
    geometry: IGeometry;
    properties?: any;
    $key?: string;
}

export class GeoJson implements IGeoJson {
  type = 'Feature';
  geometry: IGeometry;
  place_name: string;
  

  constructor(coordinates, public properties?) {
    this.geometry = {
      type: 'Point',
      coordinates: coordinates
    }
    
  }
}

export class FeatureCollection {
  type = 'FeatureCollection'
  constructor(public features: Array<GeoJson>) {}
}

 
export class GGeoJson  {
  long_name:string;
  short_name:string;
  types: string;
}
 


export class KeyLabel {
  key :string;
  label: string;
  constructor( key :string, label: string ) {}
}


