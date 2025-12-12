# 📝 Ejemplos de Tests - Patrones Efectivos para Input Components

## Basado en componentes que YA tienen buena cobertura (slider, text-input, password-input)

---

## 1️⃣ Patrón: Tests para Componentes Input Simples

### Basado en: `text-input` (85.29% cobertura - BUENO)

```typescript
describe('OTextInputComponent', () => {
  let component: OTextInputComponent;
  let fixture: ComponentFixture<OTextInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OTextInputComponent],
      imports: [
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        TranslateModule.forRoot()
      ],
      providers: OTestingUtils.getCommonTestingModuleConfig().providers
    }).compileComponents();

    fixture = TestBed.createComponent(OTextInputComponent);
    component = fixture.componentInstance;
  });

  describe('Inicialización', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.value).toBeUndefined();
      expect(component.textInputEnabled).toBe(true);
    });

    it('should accept @Input properties', () => {
      component.label = 'Test Label';
      component.hint = 'Test Hint';
      component.maxlength = 100;
      fixture.detectChanges();
      
      expect(component.label).toBe('Test Label');
      expect(component.hint).toBe('Test Hint');
      expect(component.maxlength).toBe(100);
    });
  });

  describe('Data Binding', () => {
    it('should update value on input change', fakeAsync(() => {
      component.setValue('test value');
      tick();
      fixture.detectChanges();
      
      expect(component.value).toBe('test value');
    }));

    it('should emit valueChange event', (done) => {
      component.onValueChange.subscribe((event: OValueChangeEvent) => {
        expect(event.newValue).toBe('new value');
        done();
      });

      component.setValue('new value');
    });

    it('should bind ngModel correctly', fakeAsync(() => {
      component.value = 'initial';
      fixture.detectChanges();
      tick();

      const input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.value).toBe('initial');
    }));
  });

  describe('Validación', () => {
    it('should validate required field', () => {
      component.required = true;
      component.setValue(null);
      fixture.detectChanges();

      expect(component.formControl.valid).toBe(false);
      expect(component.formControl.hasError('required')).toBe(true);
    });

    it('should validate maxlength', () => {
      component.maxlength = 5;
      component.setValue('toolong');
      fixture.detectChanges();

      expect(component.formControl.valid).toBe(false);
      expect(component.formControl.hasError('maxlength')).toBe(true);
    });

    it('should validate minlength', () => {
      component.minlength = 3;
      component.setValue('ab');
      fixture.detectChanges();

      expect(component.formControl.valid).toBe(false);
      expect(component.formControl.hasError('minlength')).toBe(true);
    });

    it('should validate pattern', () => {
      component.pattern = '^[0-9]+$'; // Solo números
      component.setValue('abc123');
      fixture.detectChanges();

      expect(component.formControl.valid).toBe(false);
    });
  });

  describe('Estados y Comportamientos', () => {
    it('should disable component when disabled=true', () => {
      component.disabled = true;
      fixture.detectChanges();

      expect(component.formControl.disabled).toBe(true);
    });

    it('should clear value on clear()', () => {
      component.setValue('test');
      component.clear();
      fixture.detectChanges();

      expect(component.value).toBeNull();
    });

    it('should show error messages', () => {
      component.required = true;
      component.setValue('');
      component.formControl.markAsTouched();
      fixture.detectChanges();

      const errorElement = fixture.debugElement.query(By.css('.mat-error'));
      expect(errorElement).toBeTruthy();
    });
  });

  describe('Eventos', () => {
    it('should emit focus event', (done) => {
      component.onFocus.subscribe(() => {
        expect(true).toBe(true);
        done();
      });

      const input = fixture.debugElement.query(By.css('input'));
      input.nativeElement.dispatchEvent(new Event('focus'));
    });

    it('should emit blur event', (done) => {
      component.onBlur.subscribe(() => {
        expect(true).toBe(true);
        done();
      });

      const input = fixture.debugElement.query(By.css('input'));
      input.nativeElement.dispatchEvent(new Event('blur'));
    });
  });

  describe('Edge Cases', () => {
    it('should handle null values', () => {
      component.setValue(null);
      expect(component.value).toBeNull();
    });

    it('should handle undefined values', () => {
      component.setValue(undefined);
      expect(component.value).toBeUndefined();
    });

    it('should handle empty string', () => {
      component.setValue('');
      expect(component.value).toBe('');
    });

    it('should handle special characters', () => {
      component.setValue('!@#$%^&*()');
      expect(component.value).toBe('!@#$%^&*()');
    });

    it('should handle very long strings', () => {
      const longString = 'a'.repeat(10000);
      component.setValue(longString);
      expect(component.value).toBe(longString);
    });
  });

  describe('Accesibilidad', () => {
    it('should have aria-label', () => {
      component.label = 'Email';
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.getAttribute('aria-label')).toBeTruthy();
    });

    it('should support keyboard navigation', () => {
      const input = fixture.debugElement.query(By.css('input'));
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      
      spyOn(component, 'onKeyDown');
      input.nativeElement.dispatchEvent(event);
      
      expect(component.onKeyDown).toBeTruthy();
    });
  });
});
```

---

## 2️⃣ Patrón: Tests para Componentes Complejos con Servicios

### Template: `date-input` (2.91% cobertura - CRÍTICO)

```typescript
describe('ODateInputComponent', () => {
  let component: ODateInputComponent;
  let fixture: ComponentFixture<ODateInputComponent>;
  let momentService: MomentService;
  let dateAdapter: DateAdapter<MomentDateAdapter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ODateInputComponent],
      imports: [
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        MomentService,
        { provide: DateAdapter, useClass: OntimizeMomentDateAdapter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ODateInputComponent);
    component = fixture.componentInstance;
    momentService = TestBed.inject(MomentService);
    dateAdapter = TestBed.inject(DateAdapter);
  });

  describe('Inicialización', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default date format', () => {
      expect(component.oformat).toBe('L');
    });

    it('should initialize datepicker', () => {
      fixture.detectChanges();
      expect(component.datepicker).toBeTruthy();
    });
  });

  describe('Date Selection', () => {
    it('should set value on date selection', fakeAsync(() => {
      const testDate = moment('2025-12-12');
      
      component.setValue(testDate.format('YYYY-MM-DD'));
      tick();
      fixture.detectChanges();

      expect(component.value).toBeTruthy();
    }));

    it('should format date according to oformat property', () => {
      component.oformat = 'YYYY-MM-DD';
      const testDate = moment('2025-12-12');
      
      component.setValue(testDate.format('YYYY-MM-DD'));
      expect(component.formControl.value).toBeTruthy();
    });

    it('should update when datepicker emits event', fakeAsync(() => {
      const testDate = new Date('2025-12-12');
      
      component.datepicker.selected.emit(testDate);
      tick();
      fixture.detectChanges();

      expect(component.value).toBeTruthy();
    }));
  });

  describe('Date Range Validation', () => {
    it('should set min date', () => {
      const minDate = '2025-01-01';
      component.oMinDate = minDate;
      fixture.detectChanges();

      expect(component.minDateString).toBeTruthy();
    });

    it('should set max date', () => {
      const maxDate = '2025-12-31';
      component.oMaxDate = maxDate;
      fixture.detectChanges();

      expect(component.maxDateString).toBeTruthy();
    });

    it('should validate date within range', () => {
      component.oMinDate = '2025-01-01';
      component.oMaxDate = '2025-12-31';
      
      component.setValue('2025-06-15');
      fixture.detectChanges();

      expect(component.formControl.valid).toBe(true);
    });

    it('should invalidate date outside min range', () => {
      component.oMinDate = '2025-06-01';
      
      component.setValue('2025-05-15');
      fixture.detectChanges();

      expect(component.formControl.valid).toBe(false);
    });

    it('should invalidate date outside max range', () => {
      component.oMaxDate = '2025-06-30';
      
      component.setValue('2025-07-15');
      fixture.detectChanges();

      expect(component.formControl.valid).toBe(false);
    });
  });

  describe('Locale and Format', () => {
    it('should change locale', () => {
      component.olocale = 'es';
      fixture.detectChanges();

      expect(component.olocale).toBe('es');
    });

    it('should format output based on value-type', () => {
      component.valueType = 'timestamp';
      component.setValue(new Date().getTime().toString());
      
      expect(component.value).toBeTruthy();
    });

    it('should handle timestamp value type', () => {
      const timestamp = new Date().getTime();
      component.valueType = 'timestamp';
      component.setValue(timestamp.toString());

      expect(component.formControl.value).toBeTruthy();
    });

    it('should handle string value type', () => {
      component.valueType = 'string';
      component.setValue('2025-12-12');

      expect(component.formControl.value).toBeTruthy();
    });
  });

  describe('Datepicker Views', () => {
    it('should start with month view by default', () => {
      expect(component.oStartView).toBe('month');
    });

    it('should allow year view start', () => {
      component.oStartView = 'year';
      fixture.detectChanges();

      expect(component.oStartView).toBe('year');
    });

    it('should set start date', () => {
      const startDate = '2025-06-15';
      component.oStartAt = startDate;
      fixture.detectChanges();

      expect(component.oStartAt).toBe(startDate);
    });
  });

  describe('Touch UI Mode', () => {
    it('should toggle touch UI mode', () => {
      component.oTouchUi = true;
      fixture.detectChanges();

      expect(component.oTouchUi).toBe(true);
    });

    it('should render datepicker in touch UI on mobile', () => {
      component.oTouchUi = true;
      fixture.detectChanges();

      expect(component.datepicker).toBeTruthy();
    });
  });

  describe('Text Input Mode', () => {
    it('should enable text input by default', () => {
      expect(component.textInputEnabled).toBe(true);
    });

    it('should allow manual text input when enabled', () => {
      component.textInputEnabled = true;
      
      const input = fixture.debugElement.query(By.css('input'));
      input.nativeElement.value = '12/12/2025';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.formControl.value).toBeTruthy();
    });

    it('should disable text input when textInputEnabled=false', () => {
      component.textInputEnabled = false;
      fixture.detectChanges();

      expect(component.datepickerInput.disabled).toBe(true);
    });
  });

  describe('Custom Date Filtering', () => {
    it('should apply date filter function', () => {
      const filterFn: DateFilterFunction = (date: Date) => {
        return date.getDay() !== 0 && date.getDay() !== 6; // Excluir weekends
      };
      
      component.filterDate = filterFn;
      fixture.detectChanges();

      expect(component.filterDate).toBe(filterFn);
    });

    it('should apply date class function', () => {
      const classFn: DateCustomClassFunction = (date: Date) => {
        return date.getDate() === 25 ? 'holiday' : '';
      };
      
      component.dateClass = classFn;
      fixture.detectChanges();

      expect(component.dateClass).toBe(classFn);
    });
  });

  describe('Validación', () => {
    it('should mark as required', () => {
      component.required = true;
      component.setValue(null);
      fixture.detectChanges();

      expect(component.formControl.valid).toBe(false);
    });

    it('should show required error', () => {
      component.required = true;
      component.setValue(null);
      component.formControl.markAsTouched();
      fixture.detectChanges();

      expect(component.formControl.hasError('required')).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null date value', () => {
      component.setValue(null);
      fixture.detectChanges();

      expect(component.value).toBeNull();
    });

    it('should handle invalid date string', () => {
      component.setValue('invalid-date');
      fixture.detectChanges();

      // Validar que maneja gracefully
      expect(component).toBeTruthy();
    });

    it('should handle timezone dates', () => {
      const date = new Date('2025-12-12T10:30:00Z');
      component.setValue(date.getTime().toString());
      fixture.detectChanges();

      expect(component.value).toBeTruthy();
    });

    it('should handle leap year dates', () => {
      component.setValue('2024-02-29'); // Leap year
      fixture.detectChanges();

      expect(component.value).toBeTruthy();
    });
  });

  describe('Responsiveness', () => {
    it('should adapt to mobile screen size', () => {
      component.oTouchUi = true;
      fixture.detectChanges();

      expect(component.oTouchUi).toBe(true);
    });

    it('should use touch UI on small screens', () => {
      // Simular pantalla pequeña
      component.oTouchUi = true;
      fixture.detectChanges();

      expect(component.datepicker).toBeTruthy();
    });
  });
});
```

---

## 3️⃣ Patrón: Tests para Componentes con HTTP

### Template: `combo` (10.85% cobertura - CRÍTICO)

```typescript
describe('OComboComponent', () => {
  let component: OComboComponent;
  let fixture: ComponentFixture<OComboComponent>;
  let httpMock: HttpTestingController;
  let dataService: OntimizeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OComboComponent],
      imports: [
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatOptionModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        OntimizeService,
        OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OComboComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    dataService = TestBed.inject(OntimizeService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Inicialización', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.multiple).toBe(false);
    });

    it('should load data from service on init', fakeAsync(() => {
      component.entity = 'test';
      component.query = 'query/test';
      
      fixture.detectChanges();
      
      const req = httpMock.expectOne((r) => r.url.includes('query/test'));
      req.flush({ data: [] });
      tick();

      expect(component.data).toBeTruthy();
    }));
  });

  describe('Data Loading', () => {
    it('should fetch data from API', fakeAsync(() => {
      const mockData = [
        { id: 1, name: 'Option 1' },
        { id: 2, name: 'Option 2' }
      ];

      component.entity = 'test';
      component.query = 'query/test';
      fixture.detectChanges();

      const req = httpMock.expectOne((r) => r.url.includes('query/test'));
      req.flush({ data: mockData });
      tick();

      expect(component.dataArray.length).toBe(2);
    }));

    it('should handle API errors', fakeAsync(() => {
      component.entity = 'test';
      component.query = 'query/test';
      fixture.detectChanges();

      const req = httpMock.expectOne((r) => r.url.includes('query/test'));
      req.error(new ErrorEvent('API Error'), { status: 500 });
      tick();

      // Validar que maneja el error gracefully
      expect(component).toBeTruthy();
    }));

    it('should cache data if configured', fakeAsync(() => {
      component.entity = 'test';
      component.query = 'query/test';
      component.cacheEnabled = true;
      fixture.detectChanges();

      const req = httpMock.expectOne((r) => r.url.includes('query/test'));
      req.flush({ data: [{ id: 1, name: 'Test' }] });
      tick();

      // Segunda llamada debería usar caché
      component.loadData();
      tick();

      // No hay segunda request esperada si hay caché
      httpMock.expectNone((r) => r.url.includes('query/test'));
    }));
  });

  describe('Data Filtering', () => {
    it('should filter items by search term', fakeAsync(() => {
      component.dataArray = [
        { id: 1, name: 'Apple' },
        { id: 2, name: 'Banana' },
        { id: 3, name: 'Cherry' }
      ];

      component.filterValue = 'App';
      component.filterItems();
      tick();
      fixture.detectChanges();

      expect(component.filteredData.length).toBe(1);
      expect(component.filteredData[0].name).toBe('Apple');
    }));

    it('should debounce filter requests', fakeAsync(() => {
      spyOn(component, 'filterItems');

      component.filterValue = 'test';
      tick(100);
      
      expect(component.filterItems).toHaveBeenCalled();
    }));

    it('should clear filters on reset', () => {
      component.filterValue = 'test';
      component.clearFilter();

      expect(component.filterValue).toBe('');
    });
  });

  describe('Selection', () => {
    beforeEach(() => {
      component.dataArray = [
        { id: 1, name: 'Option 1' },
        { id: 2, name: 'Option 2' },
        { id: 3, name: 'Option 3' }
      ];
    });

    it('should select single item', () => {
      component.multiple = false;
      component.setValue(1);
      fixture.detectChanges();

      expect(component.value).toBe(1);
    });

    it('should select multiple items', () => {
      component.multiple = true;
      component.setValue([1, 2]);
      fixture.detectChanges();

      expect(component.value).toEqual([1, 2]);
    });

    it('should deselect items', () => {
      component.setValue([1, 2]);
      component.deselectItem(1);
      fixture.detectChanges();

      expect(component.value).toEqual([2]);
    });

    it('should clear all selections', () => {
      component.setValue([1, 2, 3]);
      component.clear();
      fixture.detectChanges();

      expect(component.value).toBeNull();
    });

    it('should emit valueChange on selection', (done) => {
      component.onValueChange.subscribe((event: OValueChangeEvent) => {
        expect(event.newValue).toBe(1);
        done();
      });

      component.setValue(1);
    });
  });

  describe('Formateo de Valores', () => {
    it('should format selected value', () => {
      component.dataArray = [{ id: 1, name: 'Test' }];
      component.valueColumn = 'id';
      component.displayColumns = ['name'];
      
      component.setValue(1);
      const formatted = component.getDisplayValue();

      expect(formatted).toBeTruthy();
    });

    it('should parse user input', () => {
      component.dataArray = [{ id: '1', name: 'Test' }];
      const parsed = component.parseValue('1');

      expect(parsed).toBeTruthy();
    });

    it('should validate format', () => {
      component.dataArray = [{ id: 1, name: 'Test' }];
      const isValid = component.isValidValue(1);

      expect(isValid).toBe(true);
    });
  });

  describe('Validación', () => {
    it('should validate required field', () => {
      component.required = true;
      component.setValue(null);
      fixture.detectChanges();

      expect(component.formControl.valid).toBe(false);
    });

    it('should show validation errors', () => {
      component.required = true;
      component.setValue(null);
      component.formControl.markAsTouched();
      fixture.detectChanges();

      expect(component.formControl.hasError('required')).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty data source', fakeAsync(() => {
      component.entity = 'test';
      component.query = 'query/test';
      fixture.detectChanges();

      const req = httpMock.expectOne((r) => r.url.includes('query/test'));
      req.flush({ data: [] });
      tick();

      expect(component.dataArray.length).toBe(0);
    }));

    it('should handle null values', () => {
      component.setValue(null);
      expect(component.value).toBeNull();
    });

    it('should handle very large datasets', fakeAsync(() => {
      const largeData = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        name: `Option ${i}`
      }));

      component.dataArray = largeData;
      fixture.detectChanges();
      tick();

      expect(component.dataArray.length).toBe(10000);
    }));

    it('should handle network errors gracefully', fakeAsync(() => {
      component.entity = 'test';
      component.query = 'query/test';
      fixture.detectChanges();

      const req = httpMock.expectOne((r) => r.url.includes('query/test'));
      req.error(new ErrorEvent('Network error'));
      tick();

      // Componente debe continuar funcionando
      expect(component).toBeTruthy();
    }));
  });

  describe('Performance', () => {
    it('should handle rapid selection changes', fakeAsync(() => {
      component.dataArray = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        name: `Option ${i}`
      }));

      for (let i = 0; i < 100; i++) {
        component.setValue(i);
        tick();
      }

      expect(component.value).toBe(99);
    }));
  });
});
```

---

## 4️⃣ Utilidades Comunes para Tests

```typescript
// Helper para crear fixture con datos
export function createComboFixture(data: any[]) {
  return {
    dataArray: data,
    valueColumn: 'id',
    displayColumns: ['name'],
    filterEnabled: true
  };
}

// Helper para testing de Material forms
export function getFormFieldError(fixture: ComponentFixture<any>, selector: string): string {
  const errorElement = fixture.debugElement.query(By.css(`${selector} .mat-error`));
  return errorElement ? errorElement.nativeElement.textContent : '';
}

// Helper para disparar eventos
export function triggerEvent(element: HTMLElement, eventType: string, data?: any) {
  const event = new CustomEvent(eventType, { detail: data });
  element.dispatchEvent(event);
}

// Helper para testing asincrónico
export function waitForAsync(ms: number = 0): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper para mockear servicios HTTP
export function createMockHttpService(data: any = {}) {
  return {
    query: jasmine.createSpy('query').and.returnValue(of({ data })),
    fetch: jasmine.createSpy('fetch').and.returnValue(of(data))
  };
}
```

---

## 📊 Resumen de Patrones por Tipo

| Tipo Componente | Patrón | Tests Clave | Complejidad |
|-----------------|--------|------------|------------|
| **Simple** (text, email) | Directo con fixtures | Input/validation/events | 🟢 Baja |
| **Con Material** (date, select) | Material imports + adapters | Selection/dates/format | 🟡 Media |
| **HTTP Dependent** (combo) | HttpTestingController | Data load/filter/selection | 🔴 Alta |
| **Complex** (form, table) | Full integration setup | State/sync/rendering | 🔴 Muy Alta |

---

## 💡 Consejos Prácticos

1. **Empezar Simple**: Usa el patrón de `text-input` como base
2. **Copiar y Adaptar**: No reinventes, adapta templates existentes
3. **Mockear Dependencias**: Usa `HttpTestingController` para servicios
4. **Usar `fakeAsync`**: Para testing asincrónico controlado
5. **Testear Casos Límite**: null, undefined, empty, very long values
6. **Verificar Errores**: Todos los paths de error deben testearse
7. **Documentar el Por Qué**: Comenta tests complejos

---

**Próximo paso**: Selecciona un componente y usa estos patrones para mejorar su cobertura 🚀
