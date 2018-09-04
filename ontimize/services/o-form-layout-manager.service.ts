import { Injectable, Injector } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { OFormLayoutManagerComponent } from '../layouts/form-layout/o-form-layout-manager.component';

@Injectable()
export class OFormLayoutManagerService {
  private subject: BehaviorSubject<OFormLayoutManagerComponent>;

  constructor(protected injector: Injector) {
  }

  setFormLayoutManager(comp: OFormLayoutManagerComponent) {
    if (!this.subject) {
      this.subject = new BehaviorSubject<OFormLayoutManagerComponent>(comp);
    }
    this.subject.next(comp);
  }

  getOFormLayoutManagerObservable(): Observable<OFormLayoutManagerComponent> {
    return this.subject.asObservable();
  }

}
