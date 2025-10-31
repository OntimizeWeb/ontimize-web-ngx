const fs = require('fs');
const path = require('path');

console.log('🔧 Corrigiendo dependencias circulares en tests...');

// Configuración de casos conocidos que requieren mocks específicos
const circularDependencyFixes = {
  'OAppSidenavBase': {
    mockName: 'mockSidenav',
    mockType: 'jasmine.SpyObj<OAppSidenavBase>',
    mockConfig: `{
      onSidenavClosedStart: new Subject(),
      onSidenavOpenedStart: new Subject(),
      sidenav: {
        opened: false
      }
    }`,
    imports: ['Subject'],
    importFrom: 'rxjs'
  },
  'OBarMenuBase': {
    mockName: 'mockBarMenu',
    mockType: 'jasmine.SpyObj<OBarMenuBase>',
    mockConfig: `['getPermissionsService', 'collapseAll', 'ngOnInit', 'setDOMTitle'], {
      menuTitle: 'Test Menu',
      tooltip: 'Test Tooltip',
      id: 'test-menu',
      menuItems: []
    }`,
    imports: [],
    importFrom: null
  }
};

function findTestFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.includes('node_modules')) {
      findTestFiles(fullPath, files);
    } else if (item.endsWith('.spec.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function fixCircularDependency(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Buscar patrones de dependencias circulares
  const circularPattern = /\{\s*provide:\s*(\w+),\s*useExisting:\s*forwardRef\(\(\)\s*=>\s*(\w+)\)\s*\}/g;
  const matches = [...content.matchAll(circularPattern)];
  
  if (matches.length === 0) {
    return false; // No hay dependencias circulares
  }
  
  let newContent = content;
  let hasChanges = false;
  
  for (const match of matches) {
    const [fullMatch, providedService, componentName] = match;
    
    if (circularDependencyFixes[providedService]) {
      const config = circularDependencyFixes[providedService];
      hasChanges = true;
      
      console.log(`    🔧 Corrigiendo dependencia circular: ${providedService} en ${path.basename(filePath)}`);
      
      // 1. Actualizar imports
      const importPattern = /import\s*\{([^}]+)\}\s*from\s*'@angular\/core';/;
      const currentImports = newContent.match(importPattern);
      if (currentImports) {
        let imports = currentImports[1].split(',').map(i => i.trim());
        imports = imports.filter(i => i !== 'forwardRef'); // Remover forwardRef
        const newImports = imports.join(', ');
        newContent = newContent.replace(importPattern, `import { ${newImports} } from '@angular/core';`);
      }
      
      // 2. Añadir import de Subject si es necesario
      if (config.imports && config.importFrom) {
        const rxjsImportPattern = /import\s*\{([^}]+)\}\s*from\s*'rxjs';/;
        const rxjsImports = newContent.match(rxjsImportPattern);
        if (rxjsImports) {
          let imports = rxjsImports[1].split(',').map(i => i.trim());
          for (const imp of config.imports) {
            if (!imports.includes(imp)) {
              imports.push(imp);
            }
          }
          const newImports = imports.join(', ');
          newContent = newContent.replace(rxjsImportPattern, `import { ${newImports} } from 'rxjs';`);
        } else {
          // Añadir import completo si no existe después del primer import
          const firstImportEnd = newContent.indexOf('\n', newContent.indexOf('import')) + 1;
          newContent = newContent.slice(0, firstImportEnd) + 
                      `import { ${config.imports.join(', ')} } from '${config.importFrom}';\n` + 
                      newContent.slice(firstImportEnd);
        }
      }
      
      // 3. Añadir variable mock en describe
      const describePattern = /(describe\s*\(\s*['"`][^'"`]+['"`]\s*,\s*\(\)\s*=>\s*\{[^}]*let\s+fixture:\s*ComponentFixture<[^>]+>;)/;
      const describeMatch = newContent.match(describePattern);
      if (describeMatch) {
        const replacement = `${describeMatch[1]}\\n  let ${config.mockName}: ${config.mockType};`;
        newContent = newContent.replace(describePattern, replacement);
      }
      
      // 4. Añadir creación del mock en beforeEach
      const beforeEachStart = /beforeEach\s*\(\s*async\s*\(\)\s*=>\s*\{/;
      const beforeEachMatch = newContent.match(beforeEachStart);
      if (beforeEachMatch) {
        const mockCreation = `
    // Create mock for ${providedService}
    ${config.mockName} = jasmine.createSpyObj('${providedService}', [], ${config.mockConfig});
`;
        newContent = newContent.replace(beforeEachStart, `${beforeEachMatch[0]}${mockCreation}`);
      }
      
      // 5. Reemplazar el provider circular
      const newProvider = `{ provide: ${providedService}, useValue: ${config.mockName} }`;
      newContent = newContent.replace(fullMatch, newProvider);
    }
  }
  
  if (hasChanges) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ Corregido: ${path.relative(process.cwd(), filePath)}`);
    return true;
  }
  
  return false;
}

// Buscar todos los archivos de test
const testFiles = findTestFiles('projects');
console.log(`🔍 Encontrados ${testFiles.length} archivos de test...`);

let correctedFiles = 0;

for (const filePath of testFiles) {
  if (fixCircularDependency(filePath)) {
    correctedFiles++;
  }
}

console.log(`\\n📊 Resumen:`);
console.log(`   • ${testFiles.length} archivos de test procesados`);
console.log(`   • ${correctedFiles} archivos corregidos`);
console.log(`   • ${testFiles.length - correctedFiles} archivos sin cambios`);

if (correctedFiles > 0) {
  console.log(`\\n✅ Corrección de dependencias circulares completada!`);
  console.log(`🎯 Las dependencias circulares han sido reemplazadas por mocks apropiados.`);
  console.log(`🧪 Ejecuta \`npm run test-ci\` para verificar las correcciones.`);
} else {
  console.log(`\\n ℹ️ No se encontraron dependencias circulares para corregir.`);
  console.log(`🧪 Ejecuta \`npm run test-ci\` para verificar las correcciones.`);
}