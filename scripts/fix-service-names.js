const fs = require('fs');
const path = require('path');

const BASE_DIR = 'projects/ontimize-web-ngx/src/lib';

/**
 * Corregir nombres de servicios con formato incorrecto (ej: Ontimize.service)
 */
function fixIncorrectServiceNames(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let correctedContent = content;
    let hasChanges = false;

    // Solo procesar archivos de test
    if (!filePath.endsWith('.spec.ts')) {
      return false;
    }

    // Patrones a corregir:
    // 1. import { Ontimize.service } from './ontimize.service';
    // 2. describe('Ontimize.service', ...)
    // 3. let service: Ontimize.service;
    // 4. TestBed.inject(Ontimize.service)
    // 5. new Ontimize.service()
    // 6. toBeInstanceOf(Ontimize.service)

    const corrections = [
      // Imports incorrectos
      {
        pattern: /import\s*{\s*([A-Za-z]+)\.service\s*}\s*from\s*['"]\.\//g,
        replacement: (match, serviceName) => {
          const correctName = serviceName.charAt(0).toUpperCase() + serviceName.slice(1) + 'Service';
          return match.replace(`${serviceName}.service`, correctName);
        }
      },
      
      // Describe incorrectos
      {
        pattern: /describe\s*\(\s*['"]([A-Za-z]+)\.service['"],/g,
        replacement: (match, serviceName) => {
          const correctName = serviceName.charAt(0).toUpperCase() + serviceName.slice(1) + 'Service';
          return match.replace(`${serviceName}.service`, correctName);
        }
      },
      
      // Declaraciones de variables
      {
        pattern: /let\s+service:\s*([A-Za-z]+)\.service;/g,
        replacement: (match, serviceName) => {
          const correctName = serviceName.charAt(0).toUpperCase() + serviceName.slice(1) + 'Service';
          return match.replace(`${serviceName}.service`, correctName);
        }
      },
      
      // ComponentFixture (si aplica)
      {
        pattern: /ComponentFixture<([A-Za-z]+)\.service>/g,
        replacement: (match, serviceName) => {
          const correctName = serviceName.charAt(0).toUpperCase() + serviceName.slice(1) + 'Service';
          return match.replace(`${serviceName}.service`, correctName);
        }
      },
      
      // TestBed.inject
      {
        pattern: /TestBed\.inject\(([A-Za-z]+)\.service\)/g,
        replacement: (match, serviceName) => {
          const correctName = serviceName.charAt(0).toUpperCase() + serviceName.slice(1) + 'Service';
          return match.replace(`${serviceName}.service`, correctName);
        }
      },
      
      // new Constructor
      {
        pattern: /new\s+([A-Za-z]+)\.service\(\)/g,
        replacement: (match, serviceName) => {
          const correctName = serviceName.charAt(0).toUpperCase() + serviceName.slice(1) + 'Service';
          return match.replace(`${serviceName}.service`, correctName);
        }
      },
      
      // toBeInstanceOf
      {
        pattern: /toBeInstanceOf\(([A-Za-z]+)\.service\)/g,
        replacement: (match, serviceName) => {
          const correctName = serviceName.charAt(0).toUpperCase() + serviceName.slice(1) + 'Service';
          return match.replace(`${serviceName}.service`, correctName);
        }
      },
      
      // Providers array
      {
        pattern: /([A-Za-z]+)\.service,/g,
        replacement: (match, serviceName) => {
          const correctName = serviceName.charAt(0).toUpperCase() + serviceName.slice(1) + 'Service';
          return match.replace(`${serviceName}.service`, correctName);
        }
      }
    ];

    // Aplicar todas las correcciones
    corrections.forEach(correction => {
      if (correction.replacement) {
        correctedContent = correctedContent.replace(correction.pattern, correction.replacement);
      }
    });

    // Verificar si hubo cambios
    if (correctedContent !== content) {
      hasChanges = true;
    }

    if (hasChanges) {
      fs.writeFileSync(filePath, correctedContent, 'utf8');
      
      // Mostrar los cambios realizados
      const originalLines = content.split('\n');
      const correctedLines = correctedContent.split('\n');
      
      for (let i = 0; i < Math.max(originalLines.length, correctedLines.length); i++) {
        if (originalLines[i] !== correctedLines[i]) {
          console.log(`    🔧 Línea ${i + 1}: ${originalLines[i]?.trim() || ''} → ${correctedLines[i]?.trim() || ''}`);
        }
      }
      
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
  console.log('🔧 Corrigiendo nombres incorrectos de servicios (ej: Ontimize.service → OntimizeService)...');
  
  const testFiles = [];
  
  function findTestFiles(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        findTestFiles(fullPath);
      } else if (file.endsWith('.spec.ts')) {
        testFiles.push(fullPath);
      }
    }
  }
  
  findTestFiles(BASE_DIR);
  
  console.log(`🔍 Encontrados ${testFiles.length} archivos de test...`);
  
  let fixedCount = 0;
  
  for (const testFile of testFiles) {
    const relativePath = path.relative(process.cwd(), testFile);
    
    const wasFixed = fixIncorrectServiceNames(testFile);
    
    if (wasFixed) {
      console.log(`✅ Corregido: ${relativePath}`);
      fixedCount++;
    }
  }
  
  console.log(`\n📊 Resumen:`);
  console.log(`   • ${testFiles.length} archivos de test procesados`);
  console.log(`   • ${fixedCount} archivos corregidos`);
  console.log(`   • ${testFiles.length - fixedCount} archivos sin cambios`);
  
  if (fixedCount > 0) {
    console.log('\n✅ Corrección de nombres de servicios completada!');
    console.log('🎯 Los nombres de servicios ahora siguen la convención correcta.');
  } else {
    console.log('\n ℹ️ No se encontraron nombres incorrectos para corregir.');
  }
  
  console.log('🧪 Ejecuta `npm run test-ci` para verificar las correcciones.');
}

// Ejecutar el script
main();