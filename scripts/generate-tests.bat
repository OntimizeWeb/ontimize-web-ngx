@echo off
REM Script para generar tests automáticamente para componentes sin tests (Windows)

echo 🚀 Generando tests automáticos para Ontimize Web NGX...

set BASE_DIR=projects\ontimize-web-ngx\src\lib

echo 📋 Buscando componentes sin tests...

REM PowerShell script para generar tests
powershell -Command "& {
    $baseDir = 'projects/ontimize-web-ngx/src/lib'
    $componentsWithoutTests = 0
    $servicesWithoutTests = 0
    
    # Función para convertir kebab-case a PascalCase
    function ConvertTo-PascalCase($text) {
        $parts = $text -split '-'
        $pascalCase = ''
        foreach ($part in $parts) {
            if ($part.Length -gt 0) {
                $pascalCase += $part.Substring(0,1).ToUpper() + $part.Substring(1).ToLower()
            }
        }
        return $pascalCase
    }
    
    # Generar tests para componentes
    Write-Host '🔍 Buscando componentes sin tests...'
    Get-ChildItem -Path $baseDir -Recurse -Filter '*.component.ts' | ForEach-Object {
        $componentFile = $_.FullName
        $testFile = $componentFile -replace '\.ts$', '.spec.ts'
        
        if (-not (Test-Path $testFile)) {
            $componentsWithoutTests++
            $componentName = $_.BaseName -replace '\.component$', ''
            $componentClass = ConvertTo-PascalCase $componentName
            $relativePath = $_.Directory.FullName.Replace((Get-Location).Path, '').Replace('\', '/')
            $testingUtilsPath = '../../../shared/testing/o-testing-utils'
            
            # Calcular la ruta relativa correcta para testing utils
            $depth = ($relativePath -split '/').Length - 4
            $testingUtilsPath = '../' * $depth + 'shared/testing/o-testing-utils'
            
            Write-Host \"📝 Generando test para: $componentName\"
            
            $testContent = @\"
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';

import { ${componentClass}Component } from './${componentName}.component';
import { OTestingUtils } from '$testingUtilsPath';

describe('${componentClass}Component', () => {
  let component: ${componentClass}Component;
  let fixture: ComponentFixture<${componentClass}Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [${componentClass}Component],
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot()
      ],
      providers: OTestingUtils.getCommonTestingModuleConfig().providers
    }).compileComponents();

    fixture = TestBed.createComponent(${componentClass}Component);
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
\"@
            
            Set-Content -Path $testFile -Value $testContent -Encoding UTF8
        }
    }
    
    # Generar tests para servicios
    Write-Host '🔍 Buscando servicios sin tests...'
    Get-ChildItem -Path \"$baseDir/services\" -Filter '*.service.ts' | ForEach-Object {
        $serviceFile = $_.FullName
        $testFile = $serviceFile -replace '\.ts$', '.spec.ts'
        
        if (-not (Test-Path $testFile)) {
            $servicesWithoutTests++
            $serviceName = $_.BaseName -replace '\.service$', ''
            $serviceClass = ConvertTo-PascalCase $serviceName
            
            Write-Host \"📝 Generando test para servicio: $serviceName\"
            
            $testContent = @\"
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ${serviceClass}Service } from './${serviceName}.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('${serviceClass}Service', () => {
  let service: ${serviceClass}Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ${serviceClass}Service,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(${serviceClass}Service);
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
\"@
            
            Set-Content -Path $testFile -Value $testContent -Encoding UTF8
        }
    }
    
    Write-Host \"✅ Generación de tests completada!\"
    Write-Host \"📊 Componentes sin tests encontrados: $componentsWithoutTests\"
    Write-Host \"📊 Servicios sin tests encontrados: $servicesWithoutTests\"
    Write-Host \"📊 Para ejecutar todos los tests: npm test\"
    Write-Host \"📈 Para ver reporte de cobertura: npm run test-ci\"
}"

pause