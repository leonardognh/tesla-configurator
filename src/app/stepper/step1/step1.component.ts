import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { Color } from '../../shared/models/color';
import { Model } from '../../shared/models/model';
import { CarService } from '../../shared/services/car.service';
import { CommonModule } from '@angular/common';
import { StepperService } from '../../shared/services/stepper.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-step1',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step1.component.html',
  styleUrl: './step1.component.scss',
})
export class Step1Component implements OnInit, OnDestroy {
  carModelColorForm: FormGroup;
  carModels: Model[] = [];
  carColors: Color[] = [];
  private _unsubscribeAll = new Subject();
  constructor(
    private _formBuilder: FormBuilder,
    private _carService: CarService,
    private _stepperService: StepperService
  ) {
    this.carModelColorForm = this._formBuilder.group({
      model: [null, Validators.required],
      color: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this._getModels();
    this._subscribeToModelValueChanges();
    this._subscribeToColorValueChanges();
    this._validateForm();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  private _validateForm(): void {
    this.carModelColorForm.statusChanges
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((status) => {
        this._stepperService.setStepValidation(0, status === 'VALID');

        if (status === 'VALID') {
          const { model, color } = this.carModelColorForm.value;
          this._carService.carResult.model = this.carModels.find(
            (x) => x.code === model
          )!;
          this._carService.carResult.color = this.carColors.find(
            (x) => x.code === color
          )!;
        }
      });
  }

  private _getModels(): void {
    this._carService
      .getCarModels()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((models: Model[]) => {
        this.carModels = models;
        this._checkExistingData();
      });
  }

  private _subscribeToModelValueChanges(): void {
    this.carModelColorForm
      .get('model')!
      .valueChanges.pipe(takeUntil(this._unsubscribeAll))
      .subscribe((selectedModel: string) => {
        const model = this.carModels.find((x) => x.code === selectedModel)!;
        this.carColors = model.colors;
        this.carModelColorForm.controls['color']!.setValue(
          model.colors[0].code
        );

        this._carService.carResult.imageUrl$.next(
          `https://interstate21.com/tesla-app/images/${selectedModel}/${model.colors[0].code}.jpg`
        );

        if (this.carModelColorForm.controls['model']?.dirty) {
          this._cleanStep2();
        }
      });
  }

  private _subscribeToColorValueChanges(): void {
    this.carModelColorForm
      .get('color')!
      .valueChanges.pipe(takeUntil(this._unsubscribeAll))
      .subscribe((selectedColor: string) => {
        const color = this.carColors.find((x) => x.code === selectedColor)!;
        const model = this.carModelColorForm.controls['model']!.value;

        this._carService.carResult.imageUrl$.next(
          `https://interstate21.com/tesla-app/images/${model}/${color.code}.jpg`
        );
      });
  }

  private _checkExistingData(): void {
    const { model, color } = this._carService.carResult;

    if (model && color) {
      this.carModelColorForm.controls['model']!.setValue(model.code);
      this.carModelColorForm.controls['color']!.setValue(color.code);
    }
  }

  private _cleanStep2(): void {
    this._carService.carResult.includeTow = false;
    this._carService.carResult.includeYoke = false;
    this._carService.carResult.config = null;
    this._stepperService.setStepValidation(1, false);
  }
}
