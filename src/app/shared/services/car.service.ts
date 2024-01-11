import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Model } from '../models/model';
import { ConfigOption } from '../models/config-option';
import { CarResult } from '../models/result';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  carResult: CarResult = new CarResult();
  constructor(private _httpClient: HttpClient) {}
  getCarModels(): Observable<Model[]> {
    return this._httpClient.get<Model[]>(`/models`).pipe(
      catchError((error) => {
        console.error('Error fetching car models:', error);
        throw error;
      })
    );
  }
  getCarConfigs(modelCode: string): Observable<ConfigOption> {
    return this._httpClient.get<ConfigOption>(`/options/${modelCode}`).pipe(
      catchError((error) => {
        console.error('Error fetching car configurations:', error);
        throw error;
      })
    );
  }
  getTotalCost(): number {
    let total = 0;
    total += this.carResult.config?.price!;
    total += this.carResult.color.price;
    total += this.carResult.includeYoke ? 1000 : 0;
    total += this.carResult.includeTow ? 1000 : 0;

    return total;
  }
}
