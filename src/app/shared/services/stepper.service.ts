import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StepperService {
  private stepValidations: BehaviorSubject<boolean[]> = new BehaviorSubject<
    boolean[]
  >([false, false]);
  setStepValidation(step: number, isValid: boolean): void {
    const validations = this.stepValidations.value.slice();
    validations[step] = isValid;
    this.stepValidations.next(validations);
  }
  isStepValid(step: number): boolean {
    const validations = this.stepValidations.value.slice();
    return validations[step];
  }
}
