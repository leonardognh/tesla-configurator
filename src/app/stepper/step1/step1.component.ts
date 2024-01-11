import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { Color } from '../../shared/models/color';
import { Model } from '../../shared/models/model';
import { CarService } from '../../shared/services/car.service';
import { CommonModule } from '@angular/common';
import { StepperService } from '../../shared/services/stepper.service';

@Component({
  selector: 'app-step1',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step1.component.html',
  styleUrl: './step1.component.scss',
})
export class Step1Component implements OnInit {
  carModelColorForm: FormGroup = this._formBuilder.group({
    model: new FormControl(null, Validators.required),
    color: new FormControl(null, Validators.required),
  });
  carModels: Model[] = [];
  carColors: Color[] = [];
  constructor(
    private _formBuilder: FormBuilder,
    private _carService: CarService,
    private _stepperService: StepperService
  ) {}
  ngOnInit() {
    this._getModels();
    this._modelValueChange();
    this._colorValueChange();
    this._validateForm();
  }
  private _validateForm() {
    this.carModelColorForm.statusChanges.subscribe((status) => {
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
  private _getModels() {
    this._carService.getCarModels().subscribe((models: Model[]) => {
      this.carModels = models;
      this._checkExistingData();
    });
  }
  private _modelValueChange() {
    this.carModelColorForm
      .get('model')!
      .valueChanges.subscribe((selectedModel: string) => {
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
  private _colorValueChange() {
    this.carModelColorForm
      .get('color')!
      .valueChanges.subscribe((selectedColor: string) => {
        const color = this.carColors.find((x) => x.code === selectedColor)!;
        const model = this.carModelColorForm.controls['model']!.value;
        this._carService.carResult.imageUrl$.next(
          `https://interstate21.com/tesla-app/images/${model}/${color.code}.jpg`
        );
      });
  }
  private _checkExistingData() {
    const { model, color } = this._carService.carResult;
    if (model && color) {
      this.carModelColorForm.controls['model']!.setValue(model.code);
      this.carModelColorForm.controls['color']!.setValue(color.code);
    }
  }
  private _cleanStep2() {
    this._carService.carResult.includeTow = false;
    this._carService.carResult.includeYoke = false;
    this._carService.carResult.config = null;
    this._stepperService.setStepValidation(1, false);
  }
}
