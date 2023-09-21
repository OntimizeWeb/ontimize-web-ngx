
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppearanceService {
  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  isDarkMode$: Observable<boolean> = this.isDarkModeSubject.asObservable();

  constructor() {
    // Puedes inicializar el valor del modo oscuro aquí desde el almacenamiento local u otra fuente.
    // Por ejemplo, puedes verificar localStorage para ver si el usuario ya eligió el modo oscuro.
    const isDarkMode = localStorage.getItem('isDarkMode');
    this.isDarkModeSubject.next(isDarkMode === 'true');
  }

  // Agrega un método para cambiar el modo oscuro desde la aplicación final
  setDarkMode(isDarkMode: boolean) {
    this.isDarkModeSubject.next(isDarkMode);
    localStorage.setItem('isDarkMode', isDarkMode.toString());
  }
}
