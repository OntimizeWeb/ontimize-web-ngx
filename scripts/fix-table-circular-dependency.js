const fs = require('fs');
const path = require('path');

console.log('🔧 Eliminando imports de OTableColumnComponent (evitar dependencias circulares)...\n');

const files = [
  // Cell Renderers
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-renderer/integer/o-table-cell-renderer-integer.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-renderer/currency/o-table-cell-renderer-currency.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-renderer/boolean/o-table-cell-renderer-boolean.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-renderer/real/o-table-cell-renderer-real.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-renderer/percentage/o-table-cell-renderer-percentage.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-renderer/date/o-table-cell-renderer-date.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-renderer/time/o-table-cell-renderer-time.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-renderer/image/o-table-cell-renderer-image.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-renderer/translate/o-table-cell-renderer-translate.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-renderer/service/o-table-cell-renderer-service.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-renderer/action/o-table-cell-renderer-action.component.spec.ts',
  
  // Cell Editors
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-editor/text/o-table-cell-editor-text.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-editor/integer/o-table-cell-editor-integer.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-editor/real/o-table-cell-editor-real.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-editor/boolean/o-table-cell-editor-boolean.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-editor/date/o-table-cell-editor-date.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-editor/time/o-table-cell-editor-time.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-editor/email/o-table-cell-editor-email.component.spec.ts'
];

let fixedCount = 0;

files.forEach(filePath => {
  const fullPath = path.resolve(filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Archivo no encontrado: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // 1. Eliminar el import de OTableColumnComponent
  content = content.replace(
    /import { OTableColumnComponent } from ['"].*o-table-column\.component['"];\n?/g,
    ''
  );
  
  // 2. Crear un token mock para OTableColumnComponent sin importar la clase real
  // Buscar donde se crea el mock y agregar el token antes
  const mockCreationPattern = /(beforeEach\(async \(\) => {[\s\S]*?Component = module\.[^;]+;\s*\n\s*\/\/ Create mock for OTableColumnComponent)/;
  
  if (content.match(mockCreationPattern)) {
    content = content.replace(
      mockCreationPattern,
      `$1\n    // Use a mock token to avoid circular dependency with OTableComponent\n    const OTableColumnComponentToken = 'OTableColumnComponent';`
    );
    
    // 3. Reemplazar { provide: OTableColumnComponent, ... } con el token
    content = content.replace(
      /{ provide: OTableColumnComponent, useValue: mockOTableColumnComponent }/g,
      '{ provide: OTableColumnComponentToken, useValue: mockOTableColumnComponent }'
    );
    
    // 4. Actualizar la inyección en el componente para usar el token
    // El componente intentará obtener OTableColumnComponent del injector, pero necesitamos usar el token
    // Dado que usamos TestBed.inject(Injector), el mock ya está en el injector con el token correcto
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Corregido: ${path.basename(filePath)}`);
    fixedCount++;
  } else {
    console.log(`⚠️  No se encontró patrón en: ${path.basename(filePath)}`);
  }
});

console.log('\n═══════════════════════════════════════════════════════════');
console.log(`\n📊 Resumen:`);
console.log(`   ✅ Archivos corregidos: ${fixedCount}`);
console.log(`\n═══════════════════════════════════════════════════════════\n`);
