import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { Config } from '../../shared/models/config';
import { CommonModule } from '@angular/common';
import { CarService } from '../../shared/services/car.service';
import { StepperService } from '../../shared/services/stepper.service';
import { ConfigOption } from '../../shared/models/config-option';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-step2',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step2.component.html',
  styleUrl: './step2.component.scss',
})
export class Step2Component implements OnInit, OnDestroy {
  carConfigOptionsForm: FormGroup;
  carConfigs: Config[] = [];
  selectedConfig: Config;
  showYoke: boolean = false;
  showTow: boolean = false;
  private _unsubscribeAll = new Subject();
  constructor(
    private _formBuilder: FormBuilder,
    private _carService: CarService,
    private _stepperService: StepperService
  ) {
    this.carConfigOptionsForm = this._formBuilder.group({
      config: [null, Validators.required],
      includeYoke: [false],
      includeTow: [false],
    });
  }

  ngOnInit(): void {
    this._getConfigs();
    this._validateForm();
    this._subscribeToConfigValueChanges();
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  private _validateForm(): void {
    this.carConfigOptionsForm.statusChanges
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((status) => {
        this._stepperService.setStepValidation(1, status === 'VALID');

        if (status === 'VALID') {
          const { config, includeYoke, includeTow } =
            this.carConfigOptionsForm.value;
          this._carService.carResult.config = this.carConfigs.find(
            (x) => x.id === Number(config)
          )!;
          this._carService.carResult.includeYoke = includeYoke;
          this._carService.carResult.includeTow = includeTow;
        }
      });
  }

  private _getConfigs(): void {
    const model = this._carService.carResult.model;
    this._carService
      .getCarConfigs(model.code)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((result: ConfigOption) => {
        this.carConfigs = result.configs;
        this.showYoke = result.yoke;
        this.showTow = result.towHitch;
        this._checkExistingData();
      });
  }

  private _checkExistingData(): void {
    const { config, includeYoke, includeTow } = this._carService.carResult;

    if (config) {
      this.carConfigOptionsForm.controls['config'].setValue(config.id);
      this.carConfigOptionsForm.controls['includeYoke'].setValue(includeYoke);
      this.carConfigOptionsForm.controls['includeTow'].setValue(includeTow);
    }
  }

  private _subscribeToConfigValueChanges(): void {
    this.carConfigOptionsForm
      .get('config')!
      .valueChanges.pipe(takeUntil(this._unsubscribeAll))
      .subscribe((selectedConfig: string) => {
        const config = this.carConfigs.find(
          (x) => x.id === Number(selectedConfig)
        )!;
        this.selectedConfig = config;
      });
  }
}
