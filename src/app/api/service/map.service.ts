import {Injectable} from '@angular/core';
import * as  GeoJsonGeometriesLookup from 'geojson-geometries-lookup';
import * as turf from '@turf/turf';
import {Feature, Polygon} from '@turf/helpers';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private coastLineNzMapJson = null;
  private marineFarmsNzMapJson = null;
  private clGL = null;
  private mfGL = null;

  constructor() {
  }

  async getCoastLineNzMapJson(){
    if (!this.coastLineNzMapJson){
      return fetch('./assets/maps/nz_coast_line.geojson').then(res => res.json())
          .then(json => {
            this.coastLineNzMapJson = json;
            return json;
          });
    }else{
      return this.coastLineNzMapJson;
    }
  }

    async getMarineFarmsNzMapJson(){
        if (!this.marineFarmsNzMapJson){
            return fetch('./assets/maps/nz_marine_farms.geojson').then(res => res.json())
                .then(json => {
                    this.marineFarmsNzMapJson = json;
                    return json;
                });
        }else{
            return this.marineFarmsNzMapJson;
        }
    }

  private async loadGeoData(){
      if (this.coastLineNzMapJson) {
          if (!this.clGL) {
              this.clGL = new GeoJsonGeometriesLookup(this.coastLineNzMapJson);
          }
      } else{
          await this.getCoastLineNzMapJson();
          this.clGL = new GeoJsonGeometriesLookup(this.coastLineNzMapJson);
      }
      if (this.marineFarmsNzMapJson) {
          if (!this.mfGL) {
              this.mfGL = new GeoJsonGeometriesLookup(this.marineFarmsNzMapJson);
          }
      } else{
          await this.getMarineFarmsNzMapJson();
          this.mfGL = new GeoJsonGeometriesLookup(this.marineFarmsNzMapJson);
      }
  }
    /**
     * Function that turn a point into a polygon.
     * This polygon will be a 'circle' around the central point
     */
  pointToPolygon(x: number, y: number): Feature<Polygon>{
    const radius = 0.5;
    // I have to change the position of x and y because that is how turf works
    const circlePosition = turf.circle([y, x], radius, {steps: 10});
    return circlePosition;
  }

    /**
     * This function will validate that the position of the user is not close to the beach
     */
    async validatePosition(x: number, y: number){
        // Load the required daata
        await this.loadGeoData();
        const circlePosition = this.pointToPolygon(x, y);
        // I check every point of the 'circle' to check if is inside any of the polygons of the coast line
        for (const point of circlePosition.geometry.coordinates[0]){
            let touch;
            const point1 = {type: 'Point', coordinates: point};
            touch = this.clGL.countContainers(point1);
            if (touch > 0){
                console.log('Touch Coast line');
                return false;
            }
            touch = this.mfGL.countContainers(point1);
            if (touch > 0){
                console.log('Touch marine');
                return false;
            }
        }

        return true;
    }
}
