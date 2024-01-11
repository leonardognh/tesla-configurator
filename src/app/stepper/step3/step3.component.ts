import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CarResult } from '../../shared/models/result';
import { CarService } from '../../shared/services/car.service';

@Component({
  selector: 'app-step3',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step3.component.html',
  styleUrl: './step3.component.scss',
})
export class Step3Component implements OnInit {
  results: CarResult;
  constructor(private _carService: CarService) {}
  ngOnInit(): void {
    this._getResult();
  }
  private _getResult() {
    this._carService.getTotalCost();
    this.results = this._carService.carResult;
  }
}
