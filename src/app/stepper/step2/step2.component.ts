import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { Config } from '../../shared/models/config';
import { CommonModule } from '@angular/common';
import { CarService } from '../../shared/services/car.service';
import { StepperService } from '../../shared/services/stepper.service';
import { ConfigOption } from '../../shared/models/config-option';

@Component({
  selector: 'app-step2',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step2.component.html',
  styleUrl: './step2.component.scss',
})
export class Step2Component implements OnInit {
  carConfigOptionsForm: FormGroup = this._formBuilder.group({
    config: new FormControl(null, Validators.required),
    includeYoke: new FormControl(false),
    includeTow: new FormControl(false),
  });
  carConfigs: Config[] = [];
  selectedConfig: Config;
  showYoke: boolean = false;
  showTow: boolean = false;
  constructor(
    private _formBuilder: FormBuilder,
    private _carService: CarService,
    private _stepperService: StepperService
  ) {}
  ngOnInit(): void {
    this._getConfigs();
    this._validateForm();
    this._configValueChange();
  }
  private _validateForm() {
    this.carConfigOptionsForm.statusChanges.subscribe((status) => {
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
  private _getConfigs() {
    const model = this._carService.carResult.model;
    this._carService
      .getCarConfigs(model.code)
      .subscribe((result: ConfigOption) => {
        this.carConfigs = result.configs;
        this.showYoke = result.yoke;
        this.showTow = result.towHitch;
        this._checkExistingData();
      });
  }
  private _checkExistingData() {
    const { config, includeYoke, includeTow } = this._carService.carResult;
    if (config) {
      this.carConfigOptionsForm.controls['config'].setValue(config.id);
      this.carConfigOptionsForm.controls['includeYoke'].setValue(includeYoke);
      this.carConfigOptionsForm.controls['includeTow'].setValue(includeTow);
    }
  }
  private _configValueChange() {
    this.carConfigOptionsForm
      .get('config')!
      .valueChanges.subscribe((selectedConfig: string) => {
        const config = this.carConfigs.find(
          (x) => x.id === Number(selectedConfig)
        )!;
        this.selectedConfig = config;
      });
  }
}
