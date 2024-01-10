import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    return this._httpClient.get<Model[]>(`/models`);
  }
  getCarConfigs(modelCode: string): Observable<ConfigOption> {
    return this._httpClient.get<ConfigOption>(`/options/${modelCode}`);
  }
  totalCost() {
    let total = 0;
    total += this.carResult.config.price;
    total += this.carResult.color.price;
    total += this.carResult.includeYoke ? 1000 : 0;
    total += this.carResult.includeTow ? 1000 : 0;

    this.carResult.totalCost = total;
  }
}
