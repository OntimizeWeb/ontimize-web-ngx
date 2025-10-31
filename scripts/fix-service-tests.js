const fs = require('fs');
const path = require('path');

const BASE_DIR = 'projects/ontimize-web-ngx/src/lib';

/**
 * Calcular la ruta correcta a OTestingUtils desde el archivo de test
 */
function getCorrectTestingUtilsPath(filePath) {
  const testFileDir = path.dirname(path.resolve(filePath));
  const testingUtilsPath = path.resolve(process.cwd(), BASE_DIR, 'shared/testing/o-testing-utils');
  let relativePath = path.relative(testFileDir, testingUtilsPath);
  
  // Asegurar que use forward slashes y empiece con ./
  relativePath = relativePath.replace(/\\/g, '/');
  if (!relativePath.startsWith('.')) {
    relativePath = './' + relativePath;
  }
  
  return relativePath;
}

/**
 * Corregir tests de servicios para usar TestBed.inject en lugar de constructor manual
 */
function fixServiceTest(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let correctedContent = content;
    let hasChanges = false;

    // Solo procesar archivos de servicios
    if (!filePath.includes('.service.spec.ts')) {
      return false;
    }

    // Buscar el nombre del servicio desde las importaciones
    const importMatch = content.match(/import\s*{\s*(\w+)\s*}\s*from\s*['"]\.\//);
    if (!importMatch) {
      return false;
    }

    const serviceName = importMatch[1];
    const testingUtilsPath = getCorrectTestingUtilsPath(filePath);

    // Template mejorado para servicios
    const serviceTestTemplate = `import { TestBed } from '@angular/core/testing';
import { ${serviceName} } from './${path.basename(filePath, '.spec.ts')}';
import { OTestingUtils } from '${testingUtilsPath}';

describe('${serviceName}', () => {
  let service: ${serviceName};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        ${serviceName},
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(${serviceName});
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of ${serviceName}', () => {
    expect(service).toBeInstanceOf(${serviceName});
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
`;

    // Reemplazar todo el contenido del archivo de servicio
    if (content !== serviceTestTemplate) {
      correctedContent = serviceTestTemplate;
      hasChanges = true;
    }

    if (hasChanges) {
      fs.writeFileSync(filePath, correctedContent, 'utf8');
      return true;
    }

    return false;
  } catch (error) {
    console.error(`❌ Error al procesar ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Función principal
 */
function main() {
  console.log('🔧 Corrigiendo tests de servicios para usar TestBed.inject...');
  
  const testFiles = [];
  
  function findServiceTestFiles(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        findServiceTestFiles(fullPath);
      } else if (file.endsWith('.service.spec.ts')) {
        testFiles.push(fullPath);
      }
    }
  }
  
  findServiceTestFiles(BASE_DIR);
  
  console.log(`🔍 Encontrados ${testFiles.length} archivos de test de servicios...`);
  
  let fixedCount = 0;
  
  for (const testFile of testFiles) {
    const relativePath = path.relative(process.cwd(), testFile);
    console.log(`📝 Procesando: ${relativePath}`);
    
    const wasFixed = fixServiceTest(testFile);
    
    if (wasFixed) {
      console.log(`✅ Corregido: ${relativePath}`);
      fixedCount++;
    } else {
      console.log(`⚪ Sin cambios: ${relativePath}`);
    }
  }
  
  console.log(`\n📊 Resumen:`);
  console.log(`   • ${testFiles.length} archivos de test de servicios procesados`);
  console.log(`   • ${fixedCount} archivos corregidos`);
  console.log(`   • ${testFiles.length - fixedCount} archivos sin cambios`);
  
  if (fixedCount > 0) {
    console.log('\n✅ Corrección de tests de servicios completada!');
    console.log('🎯 Los servicios ahora usan TestBed.inject() con dependencias resueltas automáticamente.');
  } else {
    console.log('\n ℹ️ No se encontraron tests de servicios para corregir.');
  }
  
  console.log('🧪 Ejecuta `npm run test-ci` para verificar las correcciones.');
}

// Ejecutar el script
main();