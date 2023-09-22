
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppearanceService {
  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  isDarkMode$: Observable<boolean> = this.isDarkModeSubject.asObservable();

  constructor() {
    // Retrieve the dark mode setting from local storage
    const isDarkMode = localStorage.getItem('isDarkMode');
    // Initialize the BehaviorSubject with the retrieved setting (default to false if not found)
    this.isDarkModeSubject.next(isDarkMode === 'true');
  }

  // Method to set the dark mode and update the local storage
  setDarkMode(isDarkMode: boolean) {
    this.isDarkModeSubject.next(isDarkMode);
    localStorage.setItem('isDarkMode', isDarkMode.toString());
  }
}
