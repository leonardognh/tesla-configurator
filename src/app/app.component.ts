import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { StepperService } from './shared/services/stepper.service';
import { CarService } from './shared/services/car.service';
import { Subject, takeUntil } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe, JsonPipe, RouterOutlet, RouterModule],
  providers: [StepperService, CarService],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  currentStep: number = 1;
  imageUrl: string = '';
  private _unsubscribeAll = new Subject();
  isDisabled: boolean[];
  constructor(
    private _router: Router,
    private _stepperService: StepperService,
    private _carService: CarService
  ) {}

  ngOnInit(): void {
    this.getImageChange();
    this.isDisabled = this._stepperService.isStepDisabled();
  }

  goToStep(step: number): void {
    const isStepValid =
      this._stepperService.isStepValid(step - 1) ||
      step === 0 ||
      this.currentStep > step;

    if (isStepValid) {
      this.currentStep = step + 1;
      this._router.navigate([`/step${this.currentStep}`]);
    }
  }

  private getImageChange(): void {
    this._carService.carResult.imageUrl$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((url) => {
        this.imageUrl = url;
      });
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
