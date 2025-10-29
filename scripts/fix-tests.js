#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script mejorado para corregir errores en tests generados automáticamente
 */

const BASE_DIR = 'projects/ontimize-web-ngx/src/lib';

console.log('🔧 Corrigiendo errores en tests generados automáticamente...');

/**
 * Mapeo de nombres de clases incorrectos a correctos
 */
const CLASS_NAME_FIXES = {
  // Componentes
  'FullscreenDialogComponent': 'OFullScreenDialogComponent',
  'ODaterangeInputComponent': 'ODateRangeLegacyInputComponent', // legacy
  'ODaterangePickerComponent': 'DaterangepickerComponent',
  'ODaterangeInputComponent': 'ODateRangeInputComponent', // normal
  'OHtmlInputComponent': 'OHTMLInputComponent',
  'ONifInputComponent': 'ONIFInputComponent',
  'CkEditorComponent': 'CKEditorComponent',
  'OFormLayoutTabgroupComponent': 'OFormLayoutTabGroupComponent',
  'OError403Component': 'Error403Component',
  'OSnackbarComponent': 'OSnackBarComponent',
  
  // Servicios
  'JsonapiPreferencesService': 'JSONAPIPreferencesService',
  'JsonapiService': 'JSONAPIService',
  'BaseNameConventionService': 'BaseNameConvention',
  'NameConventionLowerService': 'NameConventionLower',
  'NameConventionUpperService': 'NameConventionUpper',
  'NameConventionService': 'NameConvention',
  'OAuthService': 'OntimizeAuthService',
  'OErrorDialogManagerService': 'OErrorDialogManager',
  'OntimizeExportDataProvider3xService': 'OntimizeExportDataProviderService3X',
  'OntimizeIconRegistryService': 'OntimizeMatIconRegistry',
  'OntimizeEeService': 'OntimizeEEService',
  'OntimizeExport3xxService': 'OntimizeExportService3X',
  'RemoteConfigService': 'ORemoteConfigurationService',
  'SnackbarService': 'SnackBarService',
  'OAppMenuComponentStateService': 'OAppSidenavComponentStateService',
  'OComponentStateService': 'DefaultComponentStateService',
  'OntimizeEePermissionsService': 'OntimizeEEPermissionsService'
};

/**
 * Casos especiales que necesitan manejo diferente
 */
const SPECIAL_CASES = [
  'o-repeatable-skeleton.component.spec.ts',
  'o-skeleton.component.spec.ts'
];

/**
 * Calcular la ruta correcta para OTestingUtils
 */
function getCorrectTestingUtilsPath(filePath) {
  // Ruta absoluta del archivo de test
  const testFileDir = path.dirname(path.resolve(filePath));
  
  // Ruta absoluta del archivo OTestingUtils
  const testingUtilsPath = path.resolve(process.cwd(), BASE_DIR, 'shared/testing/o-testing-utils');
  
  // Calcular ruta relativa
  let relativePath = path.relative(testFileDir, testingUtilsPath);
  
  // Normalizar separadores para compatibilidad cross-platform
  relativePath = relativePath.replace(/\\/g, '/');
  
  // Asegurar que la ruta comience con './' si no comienza con '../'
  if (!relativePath.startsWith('.')) {
    relativePath = './' + relativePath;
  }
  
  return relativePath;
}

/**
 * Corregir un archivo de test específico
 */
function fixTestFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;
  const fileName = path.basename(filePath);

  // Casos especiales para componentes abstractos
  if (SPECIAL_CASES.includes(fileName)) {
    console.log(`⚠️  Eliminando test para componente abstracto: ${fileName}`);
    fs.unlinkSync(filePath);
    return true;
  }

  // Corregir rutas de OTestingUtils
  const correctPath = getCorrectTestingUtilsPath(filePath);
  
  // Buscar todas las variaciones posibles de rutas incorrectas con regex más flexible
  const testingUtilsRegex = /import\s*{\s*OTestingUtils\s*}\s*from\s*['"]([^'"]+o-testing-utils)['"];?/g;
  
  if (testingUtilsRegex.test(content)) {
    // Reset regex para el replace
    testingUtilsRegex.lastIndex = 0;
    content = content.replace(testingUtilsRegex, `import { OTestingUtils } from '${correctPath}';`);
    hasChanges = true;
  }

  // Corregir nombres de clases
  for (const [wrongName, correctName] of Object.entries(CLASS_NAME_FIXES)) {
    const importRegex = new RegExp(`import\\s*{\\s*${wrongName}\\s*}\\s*from`, 'g');
    const componentRegex = new RegExp(`\\b${wrongName}\\b`, 'g');
    
    if (content.match(importRegex)) {
      content = content.replace(importRegex, `import { ${correctName} } from`);
      content = content.replace(componentRegex, correctName);
      hasChanges = true;
    }
  }

  // Casos especiales adicionales
  if (fileName.includes('o-daterange-input.component.spec.ts')) {
    if (filePath.includes('date-range-legacy')) {
      // Para legacy
      content = content.replace(/ODaterangeInputComponent/g, 'ODateRangeLegacyInputComponent');
    } else {
      // Para normal
      content = content.replace(/ODaterangeInputComponent/g, 'ODateRangeInputComponent');
    }
    hasChanges = true;
  }

  if (hasChanges) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Corregido: ${path.relative(process.cwd(), filePath)}`);
    return true;
  }

  return false;
}

/**
 * Buscar y corregir todos los archivos de test
 */
function fixAllTestFiles() {
  const testFiles = [];
  
  function findTestFiles(dir) {
    if (!fs.existsSync(dir)) return;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        findTestFiles(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.spec.ts')) {
        testFiles.push(fullPath);
      }
    }
  }
  
  findTestFiles(BASE_DIR);
  
  let fixedCount = 0;
  for (const testFile of testFiles) {
    if (fixTestFile(testFile)) {
      fixedCount++;
    }
  }
  
  console.log(`\n📊 Resumen:`);
  console.log(`   • ${testFiles.length} archivos de test encontrados`);
  console.log(`   • ${fixedCount} archivos corregidos`);
  console.log(`   • ${testFiles.length - fixedCount} archivos sin cambios\n`);
}

/**
 * Función principal
 */
function main() {
  console.log('🔍 Buscando archivos de test con errores...\n');
  fixAllTestFiles();
  console.log('✅ Corrección completada!');
  console.log('🧪 Ejecuta `npm run test-ci` para verificar las correcciones.');
}

// Ejecutar script
if (require.main === module) {
  main();
}

module.exports = {
  fixTestFile,
  CLASS_NAME_FIXES
};