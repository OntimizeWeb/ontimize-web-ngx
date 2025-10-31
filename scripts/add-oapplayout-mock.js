const fs = require('fs');
const path = require('path');

// Archivos que necesitan el mock de OAppLayoutBase basados en el output del test
const filesToFix = [
  'projects/ontimize-web-ngx/src/lib/components/app-sidenav/o-app-sidenav.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/app-sidenav/image/o-app-sidenav-image.component.spec.ts'
];

let updatedCount = 0;
let skippedCount = 0;

console.log('🔧 Agregando mock de OAppLayoutBase a archivos de test...\n');

filesToFix.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Archivo no encontrado: ${filePath}`);
    skippedCount++;
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Verificar si ya tiene OAppLayoutBase importado
  if (content.includes('OAppLayoutBase')) {
    console.log(`⏭️  Omitido (ya tiene OAppLayoutBase): ${filePath}`);
    skippedCount++;
    return;
  }

  // Verificar si tiene OAppSidenavBase
  if (!content.includes('OAppSidenavBase')) {
    console.log(`⏭️  Omitido (no tiene OAppSidenavBase): ${filePath}`);
    skippedCount++;
    return;
  }

  // Determinar la ruta correcta basada en la profundidad del archivo
  let relPath = '../../../layouts/app-layout/o-app-layout-base.class';
  if (filePath.includes('app-sidenav/o-app-sidenav.component.spec.ts')) {
    relPath = '../../layouts/app-layout/o-app-layout-base.class';
  }

  // Agregar import de OAppLayoutBase después de OAppSidenavBase
  content = content.replace(
    /(import\s+{\s*OAppSidenavBase\s*}\s+from\s+['"][^'"]+['"];)/,
    `$1\nimport { OAppLayoutBase } from '${relPath}';`
  );

  // Agregar variable mockAppLayout después de mockSidenav
  content = content.replace(
    /(let\s+mockSidenav:\s*jasmine\.SpyObj<OAppSidenavBase>;)/,
    `$1\n  let mockAppLayout: jasmine.SpyObj<OAppLayoutBase>;`
  );

  // Agregar creación del mock después del mock de sidenav
  const mockCreationPattern = /(mockSidenav\s*=\s*jasmine\.createSpyObj\('OAppSidenavBase'[^}]+}\s*\);)/;
  if (mockCreationPattern.test(content)) {
    content = content.replace(
      mockCreationPattern,
      `$1\n\n    // Create mock for OAppLayoutBase\n    mockAppLayout = jasmine.createSpyObj('OAppLayoutBase', [], {\n      tooltipDisplayMode: 'only-collapsed'\n    });`
    );
  }

  // Agregar provider en el TestBed
  const providerPattern = /({ provide: OAppSidenavBase, useValue: mockSidenav })/;
  if (providerPattern.test(content)) {
    content = content.replace(
      providerPattern,
      `$1,\n        { provide: OAppLayoutBase, useValue: mockAppLayout }`
    );
  }

  // Guardar el archivo modificado
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✅ Actualizado: ${filePath}`);
  updatedCount++;
});

console.log(`\n📊 Resumen:`);
console.log(`   • ${updatedCount} archivos actualizados`);
console.log(`   • ${skippedCount} archivos omitidos`);

if (updatedCount > 0) {
  console.log('\n✨ ¡Proceso completado exitosamente!');
} else {
  console.log('\n⚠️  No se actualizó ningún archivo.');
}
