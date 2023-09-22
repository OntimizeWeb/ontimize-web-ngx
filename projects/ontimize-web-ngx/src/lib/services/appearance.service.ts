
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppearanceService {
  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  isDarkMode$: Observable<boolean> = this.isDarkModeSubject.asObservable();

  constructor() {
    const isDarkMode = localStorage.getItem('isDarkMode');
    this.isDarkModeSubject.next(isDarkMode === 'true');
  }

  setDarkMode(isDarkMode: boolean) {
    this.isDarkModeSubject.next(isDarkMode);
    localStorage.setItem('isDarkMode', isDarkMode.toString());
  }
}
