const fs = require('fs');
const path = require('path');

const BASE_DIR = 'projects/ontimize-web-ngx/src/lib';

/**
 * Corregir inconsistencias en la creación de fixtures en tests
 */
function fixFixtureCreation(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let correctedContent = content;
    let hasChanges = false;

    // Buscar el patrón de declaración para obtener el nombre correcto
    const declarationMatch = content.match(/declarations:\s*\[\s*(\w+)\s*\]/);
    if (!declarationMatch) {
      return false; // No hay declaraciones, probablemente es un servicio
    }

    const correctComponentName = declarationMatch[1];

    // Buscar patrones incorrectos en createComponent
    const incorrectPatterns = [
      new RegExp(`TestBed\\.createComponent\\(([^)]+\\.component)\\)`, 'g'),
      new RegExp(`TestBed\\.createComponent\\(([^)]+\\.service)\\)`, 'g')
    ];

    incorrectPatterns.forEach(pattern => {
      correctedContent = correctedContent.replace(pattern, (match, incorrectName) => {
        console.log(`  🔧 Corrigiendo: ${incorrectName} → ${correctComponentName}`);
        hasChanges = true;
        return match.replace(incorrectName, correctComponentName);
      });
    });

    // También corregir en toBeInstanceOf si existe el mismo error
    const instanceOfPattern = new RegExp(`toBeInstanceOf\\(([^)]+\\.(?:component|service))\\)`, 'g');
    correctedContent = correctedContent.replace(instanceOfPattern, (match, incorrectName) => {
      console.log(`  🔧 Corrigiendo toBeInstanceOf: ${incorrectName} → ${correctComponentName}`);
      hasChanges = true;
      return match.replace(incorrectName, correctComponentName);
    });

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
  console.log('🔧 Corrigiendo inconsistencias en createComponent...');
  
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
    console.log(`📝 Procesando: ${relativePath}`);
    
    const wasFixed = fixFixtureCreation(testFile);
    
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
    console.log('\n✅ Corrección de createComponent completada!');
  } else {
    console.log('\n ℹ️ No se encontraron inconsistencias para corregir.');
  }
  
  console.log('🧪 Ejecuta `npm run test-ci` para verificar las correcciones.');
}

// Ejecutar el script
main();