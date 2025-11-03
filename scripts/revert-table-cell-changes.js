const fs = require('fs');
const path = require('path');

console.log('🔄 Revirtiendo cambios en Table Cell Renderers/Editors...\n');

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

let revertedCount = 0;

files.forEach(filePath => {
  const fullPath = path.resolve(filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Archivo no encontrado: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Eliminar import de OTableColumnComponent
  content = content.replace(
    /import { OTableColumnComponent } from ['"].*o-table-column\.component['"];\n?/g,
    ''
  );
  
  // Eliminar variable mockOTableColumnComponent
  content = content.replace(
    /\s*let mockOTableColumnComponent: any;\n?/g,
    ''
  );
  
  // Eliminar creación del mock
  content = content.replace(
    /\s*\/\/ Create mock for OTableColumnComponent[\s\S]*?mockOTableColumnComponent = jasmine\.createSpyObj[\s\S]*?\]\);\s*\n/g,
    ''
  );
  
  // Eliminar provider del mock
  content = content.replace(
    /,?\s*{ provide: (?:OTableColumnComponent|OTableColumnComponentToken), useValue: mockOTableColumnComponent }\s*/g,
    ''
  );
  
  // Eliminar asignación de tableColumn si existe
  content = content.replace(
    /\s*\/\/ Mock the tableColumn property[\s\S]*?component\.tableColumn = mockOTableColumn;\s*\n/g,
    ''
  );
  
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✅ Revertido: ${path.basename(filePath)}`);
  revertedCount++;
});

console.log('\n═══════════════════════════════════════════════════════════');
console.log(`\n📊 Resumen:`);
console.log(`   ✅ Archivos revertidos: ${revertedCount}`);
console.log(`\n═══════════════════════════════════════════════════════════\n`);
