import { Component, OnInit } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { StepperService } from './shared/services/stepper.service';
import { CarService } from './shared/services/car.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe, JsonPipe, RouterOutlet, RouterModule],
  providers: [StepperService, CarService],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  currentStep: number = 1;
  imageUrl = '';
  stepOneValid: boolean = false;
  stepTwoValid: boolean = false;
  constructor(
    private _router: Router,
    private _stepperService: StepperService,
    private _carService: CarService
  ) {}
  ngOnInit(): void {
    this._getImageChange();
  }
  goToStep(step: number) {
    if (
      this._stepperService.isStepValid(step - 1) ||
      step === 0 ||
      this.currentStep > step
    ) {
      this.currentStep = step + 1;
      this._router.navigate([`/step${this.currentStep}`]);
    }
  }
  private _getImageChange() {
    this._carService.carResult.imageUrl$.subscribe((url) => {
      this.imageUrl = url;
    });
  }
}
