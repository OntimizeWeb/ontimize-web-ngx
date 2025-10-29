#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script para generar tests automáticamente para componentes y servicios sin tests
 */

const BASE_DIR = 'projects/ontimize-web-ngx/src/lib';

console.log('🚀 Generando tests automáticos para Ontimize Web NGX...');

/**
 * Convierte kebab-case a PascalCase
 */
function toPascalCase(text) {
  return text
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');
}

/**
 * Calcula la ruta relativa para testing utils
 */
function getTestingUtilsPath(componentPath) {
  const relativePath = path.relative(path.dirname(componentPath), BASE_DIR);
  const depth = relativePath.split(path.sep).length;
  return '../'.repeat(depth) + 'shared/testing/o-testing-utils';
}

/**
 * Genera test básico para un componente
 */
function generateComponentTest(componentFile) {
  const testFile = componentFile.replace('.ts', '.spec.ts');
  
  if (fs.existsSync(testFile)) {
    return false; // Ya existe el test
  }

  const componentName = path.basename(componentFile, '.component.ts');
  const componentClass = toPascalCase(componentName) + 'Component';
  const testingUtilsPath = getTestingUtilsPath(componentFile);

  const testContent = `import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';

import { ${componentClass} } from './${componentName}.component';
import { OTestingUtils } from '${testingUtilsPath}';

describe('${componentClass}', () => {
  let component: ${componentClass};
  let fixture: ComponentFixture<${componentClass}>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [${componentClass}],
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot()
      ],
      providers: OTestingUtils.getCommonTestingModuleConfig().providers
    }).compileComponents();

    fixture = TestBed.createComponent(${componentClass});
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
`;

  try {
    fs.writeFileSync(testFile, testContent, 'utf8');
    console.log(`📝 Generando test para: ${componentName}`);
    return true;
  } catch (error) {
    console.error(`❌ Error generando test para ${componentName}:`, error.message);
    return false;
  }
}

/**
 * Genera test básico para un servicio
 */
function generateServiceTest(serviceFile) {
  const testFile = serviceFile.replace('.ts', '.spec.ts');
  
  if (fs.existsSync(testFile)) {
    return false; // Ya existe el test
  }

  const serviceName = path.basename(serviceFile, '.service.ts');
  const serviceClass = toPascalCase(serviceName) + 'Service';

  const testContent = `import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ${serviceClass} } from './${serviceName}.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('${serviceClass}', () => {
  let service: ${serviceClass};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ${serviceClass},
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(${serviceClass});
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
`;

  try {
    fs.writeFileSync(testFile, testContent, 'utf8');
    console.log(`📝 Generando test para servicio: ${serviceName}`);
    return true;
  } catch (error) {
    console.error(`❌ Error generando test para ${serviceName}:`, error.message);
    return false;
  }
}

/**
 * Busca archivos recursivamente
 */
function findFiles(dir, pattern) {
  const files = [];
  
  function searchDir(currentDir) {
    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        
        if (entry.isDirectory()) {
          searchDir(fullPath);
        } else if (entry.isFile() && pattern.test(entry.name)) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.warn(`⚠️  No se pudo acceder al directorio: ${currentDir}`);
    }
  }
  
  if (fs.existsSync(dir)) {
    searchDir(dir);
  }
  
  return files;
}

// Ejecutar generación de tests
function main() {
  let componentsGenerated = 0;
  let servicesGenerated = 0;

  console.log('🔍 Buscando componentes sin tests...');
  
  // Generar tests para componentes
  const componentFiles = findFiles(BASE_DIR, /\.component\.ts$/);
  for (const file of componentFiles) {
    if (generateComponentTest(file)) {
      componentsGenerated++;
    }
  }

  console.log('🔍 Buscando servicios sin tests...');
  
  // Generar tests para servicios
  const serviceFiles = findFiles(path.join(BASE_DIR, 'services'), /\.service\.ts$/);
  for (const file of serviceFiles) {
    if (generateServiceTest(file)) {
      servicesGenerated++;
    }
  }

  console.log('✅ Generación de tests completada!');
  console.log(`📊 Componentes sin tests encontrados: ${componentsGenerated}`);
  console.log(`📊 Servicios sin tests encontrados: ${servicesGenerated}`);
  console.log('📊 Para ejecutar todos los tests: npm test');
  console.log('📈 Para ver reporte de cobertura: npm run test-ci');
}

// Ejecutar script
if (require.main === module) {
  main();
}

module.exports = {
  generateComponentTest,
  generateServiceTest,
  toPascalCase
};