#!/bin/bash

# Script para generar tests automáticamente para componentes sin tests

echo "🚀 Generando tests automáticos para Ontimize Web NGX..."

# Directorio base
BASE_DIR="projects/ontimize-web-ngx/src/lib"

# Encontrar componentes sin tests
echo "📋 Buscando componentes sin tests..."

# Crear función para generar test básico
generate_basic_test() {
    local component_file=$1
    local component_name=$(basename "$component_file" .component.ts)
    local component_class=$(echo "$component_name" | sed 's/-//g' | sed 's/\b\w/\U&/g')
    local test_file="${component_file%.ts}.spec.ts"
    local component_dir=$(dirname "$component_file")
    
    if [ ! -f "$test_file" ]; then
        echo "📝 Generando test para: $component_name"
        
        cat > "$test_file" << EOF
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';

import { ${component_class}Component } from './${component_name}.component';
import { OTestingUtils } from '../../../shared/testing/o-testing-utils';

describe('${component_class}Component', () => {
  let component: ${component_class}Component;
  let fixture: ComponentFixture<${component_class}Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [${component_class}Component],
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot()
      ],
      providers: OTestingUtils.getCommonTestingModuleConfig().providers
    }).compileComponents();

    fixture = TestBed.createComponent(${component_class}Component);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default properties', () => {
    expect(component).toBeDefined();
    // TODO: Add specific property tests
  });

  it('should render correctly', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled).toBeTruthy();
    // TODO: Add DOM tests
  });

  // TODO: Add more specific tests for component functionality
});
EOF
    fi
}

# Generar tests para servicios
generate_service_test() {
    local service_file=$1
    local service_name=$(basename "$service_file" .service.ts)
    local service_class=$(echo "$service_name" | sed 's/-//g' | sed 's/\b\w/\U&/g')
    local test_file="${service_file%.ts}.spec.ts"
    
    if [ ! -f "$test_file" ]; then
        echo "📝 Generando test para servicio: $service_name"
        
        cat > "$test_file" << EOF
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ${service_class}Service } from './${service_name}.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('${service_class}Service', () => {
  let service: ${service_class}Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ${service_class}Service,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(${service_class}Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TODO: Add service-specific tests
  it('should have required methods', () => {
    expect(service).toBeDefined();
    // TODO: Test public methods
  });
});
EOF
    fi
}

# Buscar y generar tests para componentes
echo "🔍 Generando tests para componentes..."
find "$BASE_DIR" -name "*.component.ts" -not -path "*/test/*" | while read -r file; do
    generate_basic_test "$file"
done

# Buscar y generar tests para servicios
echo "🔍 Generando tests para servicios..."
find "$BASE_DIR/services" -name "*.service.ts" | while read -r file; do
    generate_service_test "$file"
done

echo "✅ Generación de tests completada!"
echo "📊 Para ejecutar todos los tests: npm test"
echo "📈 Para ver reporte de cobertura: npm run test-ci"