import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SuccessService {
  msg = new BehaviorSubject(null);
  constructor() {}
}
