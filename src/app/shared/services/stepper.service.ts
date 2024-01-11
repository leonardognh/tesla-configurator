import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StepperService {
  private _stepValidations: BehaviorSubject<boolean[]> = new BehaviorSubject<
    boolean[]
  >([false, false]);
  private _isDisabled: boolean[] = [false, true, true];
  setStepValidation(step: number, isValid: boolean): void {
    const validations = this._stepValidations.value.slice();
    validations[step] = isValid;
    this._isDisabled[step + 1] = !isValid;
    this._stepValidations.next(validations);
  }
  isStepValid(step: number): boolean {
    const validations = this._stepValidations.value.slice();
    return validations[step];
  }
  isStepDisabled(): boolean[] {
    return this._isDisabled;
  }
}
