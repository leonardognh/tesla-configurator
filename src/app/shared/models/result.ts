import { Subject } from 'rxjs';
import { Color } from './color';
import { Config } from './config';
import { Model } from './model';

export class CarResult {
  model: Model;
  color: Color;
  config: Config;
  includeYoke: boolean;
  includeTow: boolean;
  totalCost: number;
  imageUrl$: Subject<string> = new Subject<string>();
}
