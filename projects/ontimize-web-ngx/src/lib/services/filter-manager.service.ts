import { inject, Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { FilterEntry, FilterState, IFilterManagerService } from '../interfaces/filter-manager.interface';
import { LocalStorageService } from './local-storage.service';
import { ColumnValueFilterOperator } from '../types/table/o-column-value-filter.type';


@Injectable({
  providedIn: 'root'
})

export class OFilterManagerService implements IFilterManagerService {
  localStorageService: LocalStorageService;

  constructor() {
    this.localStorageService = inject(LocalStorageService);
  }

  private filterSubjects = new Map<string, BehaviorSubject<FilterState>>();

  public getFilters$(id: string): Observable<FilterState> {
    return this.getOrCreateSubject(id).asObservable();
  }

  // ✅ Obtiene el estado actual de filtros
  public getFilters(id: string): FilterState {
    return this.getOrCreateSubject(id).getValue();
  }

  // ✅ Establece filtros completos
  public setFilters(id: string, filters: FilterEntry[], quickFilter?: string): void {

    const state: FilterState = { filters: {}, quickFilter };

    for (const { attr, values, operator } of filters) {
      state.filters[attr] = {
        attr: attr,
        values,
        operator: operator ?? ColumnValueFilterOperator.EQUAL,
      };
    }

    this.getOrCreateSubject(id).next(state);
    this.saveFiltersToLocalStorage(id, state);

  }



  // ✅ Actualiza solo un filtro
  public updateFilter(id: string, key: string, value: any): void {
    const subject = this.getOrCreateSubject(id);
    const current = { ...subject.getValue() };

    //current.filters = { ...current.filters, [key]: { attr: key, values: value, operator: ColumnValueFilterOperator.EQUAL } };
    current.filters = { ...current.filters, [key]: { attr: key, values: value, operator: ColumnValueFilterOperator.EQUAL } };

    subject.next(current);
  }

  // ✅ Elimina un filtro específico
  public removeFilter(id: string, key: string): void {
    const subject = this.getOrCreateSubject(id);
    const current = { ...subject.getValue() };
    delete current.filters[key];
    subject.next(current);
  }

  // ✅ Establece o actualiza quickFilter
  public updateQuickFilter(id: string, quickFilter: string): void {
    const subject = this.getOrCreateSubject(id);
    const current = { ...subject.getValue(), quickFilter };
    subject.next(current);
  }

  // ✅ Limpia todos los filtros
  public resetFilters(id: string): void {
    this.getOrCreateSubject(id).next({ filters: {} });
  }

  // ✅ Cierra y limpia recursos
  public close(id: string): void {
    const subject = this.filterSubjects.get(id);
    if (subject) {
      this.filterSubjects.delete(id);
      subject.complete();
    }
  }

  // Utilidad interna
  private getOrCreateSubject(id: string): BehaviorSubject<FilterState> {
    if (!this.filterSubjects.has(id)) {
      const initialState = this.loadFiltersFromLocalStorage(id);  // Cargamos el estado inicial de los filtros desde localStorage
      this.filterSubjects.set(id, new BehaviorSubject<FilterState>(initialState));
    }
    return this.filterSubjects.get(id)!;
  }


  // Método para recuperar los filtros desde localStorage
  private getFiltersFromLocalStorage(tableId: string): FilterState | null {

    const state = this.localStorageService.getAppComponentData(tableId);
    return state['stored-filters'] ? JSON.parse(state['stored-filters']) : null;
  }

  private loadFiltersFromLocalStorage(id: string): FilterState {
    const stored = this.localStorageService.getAppComponentDataByPrefix(id)[0];
    const filters = stored?.data?.['column-value-filters'] ?? {};
    const quickFilter = stored?.data?.['filter'] ?? undefined;

    return {
      filters: filters,
      quickFilter: quickFilter
    };
  }

  private saveFiltersToLocalStorage(tableId: string, filters: FilterState): void {
    let componentsStored = this.localStorageService.getAppComponentDataByPrefix(tableId);
    if (componentsStored.length === 0) {
      const component = { 'column-value-filters': filters.filters, 'filter': filters.quickFilter };
      this.localStorageService.updateAppComponentStorageByPrefix(tableId, component);
      return
    }
    componentsStored.forEach((component) => {
      component.data['column-value-filters'] = filters.filters;
      if (filters.quickFilter !== undefined) {
        component.data['filter'] = filters.quickFilter;
      } else {
        delete component.data['filter'];
      }
      this.localStorageService.updateAppComponentStorage(component.id, component.data);
    })

  }

}
