const fs = require('fs');
const path = require('path');

const BASE_DIR = 'projects/ontimize-web-ngx/src/lib';

/**
 * Buscar el nombre real de la clase en el archivo fuente
 */
function findActualClassName(specFilePath) {
  // Intentar encontrar el archivo fuente correspondiente
  const specDir = path.dirname(specFilePath);
  const specBaseName = path.basename(specFilePath, '.spec.ts');
  
  // Buscar archivos .ts en el mismo directorio
  const sourceFiles = [
    path.join(specDir, `${specBaseName}.ts`),
    path.join(specDir, `${specBaseName}.component.ts`),
    path.join(specDir, `${specBaseName}.service.ts`)
  ];
  
  for (const sourceFile of sourceFiles) {
    if (fs.existsSync(sourceFile)) {
      try {
        const content = fs.readFileSync(sourceFile, 'utf8');
        const classMatch = content.match(/export\s+class\s+(\w+)/);
        if (classMatch && classMatch[1]) {
          return classMatch[1];
        }
      } catch (error) {
        // Continuar con el siguiente archivo
      }
    }
  }
  
  // Si no encuentra archivo fuente, intentar leer el import del spec
  try {
    const specContent = fs.readFileSync(specFilePath, 'utf8');
    const importMatch = specContent.match(/import\s*{\s*(\w+)\s*}\s*from\s*['"]\.\//);
    if (importMatch && importMatch[1]) {
      return importMatch[1];
    }
  } catch (error) {
    // Usar conversión por defecto
  }
  
  // Fallback: convertir nombre de archivo
  const parts = specBaseName.split('-').map(part => 
    part.charAt(0).toUpperCase() + part.slice(1)
  );
  return parts.join('');
}

/**
 * Corregir el nombre de clase en un archivo de test
 */
function fixClassName(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const actualClassName = findActualClassName(filePath);
    
    if (!actualClassName) {
      return false;
    }
    
    // Buscar patrones incorrectos como "OButton.component" 
    const incorrectPatterns = [
      /(\w+)\.component/g,
      /(\w+)\.service/g
    ];
    
    let correctedContent = content;
    let hasChanges = false;
    
    // Corregir imports incorrectos
    correctedContent = correctedContent.replace(
      /import\s*{\s*(\w+\.\w+)\s*}\s*from/g,
      (match, incorrectName) => {
        hasChanges = true;
        return match.replace(incorrectName, actualClassName);
      }
    );
    
    // Corregir declaraciones de componente/servicio
    correctedContent = correctedContent.replace(
      /describe\s*\(\s*['"]([^'"]*\.(?:component|service))['"],/g,
      (match, incorrectName) => {
        hasChanges = true;
        return match.replace(incorrectName, actualClassName);
      }
    );
    
    // Corregir variables y tipos
    correctedContent = correctedContent.replace(
      /(let\s+(?:component|service):\s*)(\w+\.\w+)/g,
      (match, prefix, incorrectType) => {
        hasChanges = true;
        return prefix + actualClassName;
      }
    );
    
    correctedContent = correctedContent.replace(
      /(ComponentFixture<)(\w+\.\w+)>/g,
      (match, prefix, incorrectType) => {
        hasChanges = true;
        return prefix + actualClassName + '>';
      }
    );
    
    // Corregir declaraciones en TestBed
    correctedContent = correctedContent.replace(
      /(declarations:\s*\[\s*)(\w+\.\w+)(\s*\])/g,
      (match, prefix, incorrectName, suffix) => {
        hasChanges = true;
        return prefix + actualClassName + suffix;
      }
    );
    
    // Corregir instanciaciones
    correctedContent = correctedContent.replace(
      /(new\s+)(\w+\.\w+)/g,
      (match, prefix, incorrectName) => {
        hasChanges = true;
        return prefix + actualClassName;
      }
    );
    
    // Corregir toBeInstanceOf
    correctedContent = correctedContent.replace(
      /(toBeInstanceOf\()(\w+\.\w+)\)/g,
      (match, prefix, incorrectName) => {
        hasChanges = true;
        return prefix + actualClassName + ')';
      }
    );
    
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
  console.log('🔧 Corrigiendo nombres de clases incorrectos en tests...');
  
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
    const wasFixed = fixClassName(testFile);
    
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
    console.log('\n✅ Corrección de nombres completada!');
  } else {
    console.log('\n ℹ️ No se encontraron nombres incorrectos para corregir.');
  }
  
  console.log('🧪 Ejecuta `npm run test-ci` para verificar las correcciones.');
}

// Ejecutar el script
main();