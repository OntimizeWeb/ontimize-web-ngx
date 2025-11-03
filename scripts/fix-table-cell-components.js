const fs = require('fs');
const path = require('path');

console.log('🔧 Aplicando corrección a Table Cell Renderers y Editors...\n');

// Archivos a corregir
const files = [
  // Cell Renderers restantes (ya corregimos integer, currency, boolean)
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-renderer/real/o-table-cell-renderer-real.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-renderer/percentage/o-table-cell-renderer-percentage.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-renderer/date/o-table-cell-renderer-date.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-renderer/time/o-table-cell-renderer-time.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-renderer/image/o-table-cell-renderer-image.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-renderer/translate/o-table-cell-renderer-translate.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-renderer/service/o-table-cell-renderer-service.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-renderer/action/o-table-cell-renderer-action.component.spec.ts',
  
  // Cell Editors (todos)
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-editor/text/o-table-cell-editor-text.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-editor/integer/o-table-cell-editor-integer.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-editor/real/o-table-cell-editor-real.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-editor/boolean/o-table-cell-editor-boolean.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-editor/date/o-table-cell-editor-date.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-editor/time/o-table-cell-editor-time.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-editor/email/o-table-cell-editor-email.component.spec.ts'
];

let fixedCount = 0;
let skippedCount = 0;

files.forEach(filePath => {
  const fullPath = path.resolve(filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Archivo no encontrado: ${filePath}`);
    skippedCount++;
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Verificar si ya tiene el mock (para evitar duplicados)
  if (content.includes('mockOTableColumnComponent')) {
    console.log(`⏭️  Ya corregido: ${path.basename(filePath)}`);
    skippedCount++;
    return;
  }
  
  // 1. Agregar import de OTableColumnComponent si no existe
  if (!content.includes('import { OTableColumnComponent }')) {
    const importPattern = /import { OTestingUtils } from ['"].*['"]; /;
    content = content.replace(
      importPattern,
      match => match + "\nimport { OTableColumnComponent } from '../../o-table-column.component';"
    );
  }
  
  // 2. Agregar variable mockOTableColumnComponent en el describe
  const describePattern = /(describe\(['"][^'"]+['"], \(\) => {\s+let component: any;)/;
  content = content.replace(
    describePattern,
    '$1\n  let mockOTableColumnComponent: any;'
  );
  
  // 3. Agregar creación del mock antes de TestBed.configureTestingModule
  const testBedPattern = /(beforeEach\(async \(\) => {[\s\S]*?Component = module\.[^;]+;\s*)/;
  content = content.replace(
    testBedPattern,
    `$1
    // Create mock for OTableColumnComponent (required by OBaseTableCellRenderer/Editor base class)
    mockOTableColumnComponent = jasmine.createSpyObj('OTableColumnComponent', [
      'registerRenderer',
      'registerEditor',
      'getTable'
    ]);
    `
  );
  
  // 4. Agregar provider en el TestBed
  const providersPattern = /(providers: \[\s*\.\.\.OTestingUtils\.getCommonTestingModuleConfig\(\)\.providers)/;
  content = content.replace(
    providersPattern,
    `$1,
        { provide: OTableColumnComponent, useValue: mockOTableColumnComponent }`
  );
  
  // Guardar archivo modificado
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✅ Corregido: ${path.basename(filePath)}`);
  fixedCount++;
});

console.log('\n═══════════════════════════════════════════════════════════');
console.log(`\n📊 Resumen:`);
console.log(`   ✅ Archivos corregidos: ${fixedCount}`);
console.log(`   ⏭️  Archivos omitidos: ${skippedCount}`);
console.log(`\n═══════════════════════════════════════════════════════════\n`);
