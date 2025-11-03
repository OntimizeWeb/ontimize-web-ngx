const fs = require('fs');
const path = require('path');

console.log('🔧 Corrigiendo imports faltantes de OTableColumnComponent...\n');

const files = [
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-editor/boolean/o-table-cell-editor-boolean.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-editor/date/o-table-cell-editor-date.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-editor/email/o-table-cell-editor-email.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-editor/integer/o-table-cell-editor-integer.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-editor/real/o-table-cell-editor-real.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-editor/text/o-table-cell-editor-text.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-editor/time/o-table-cell-editor-time.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-renderer/action/o-table-cell-renderer-action.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-renderer/date/o-table-cell-renderer-date.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-renderer/image/o-table-cell-renderer-image.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-renderer/percentage/o-table-cell-renderer-percentage.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-renderer/real/o-table-cell-renderer-real.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-renderer/service/o-table-cell-renderer-service.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-renderer/time/o-table-cell-renderer-time.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/table/column/cell-renderer/translate/o-table-cell-renderer-translate.component.spec.ts'
];

let fixedCount = 0;

files.forEach(filePath => {
  const fullPath = path.resolve(filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Archivo no encontrado: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Verificar si ya tiene el import
  if (content.includes('import { OTableColumnComponent }')) {
    console.log(`⏭️  Ya tiene import: ${path.basename(filePath)}`);
    return;
  }
  
  // Agregar el import después de la última línea de imports
  const lines = content.split('\n');
  let lastImportIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('import ')) {
      lastImportIndex = i;
    }
  }
  
  if (lastImportIndex !== -1) {
    lines.splice(lastImportIndex + 1, 0, "import { OTableColumnComponent } from '../../o-table-column.component';");
    content = lines.join('\n');
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Agregado import: ${path.basename(filePath)}`);
    fixedCount++;
  } else {
    console.log(`❌ No se encontró línea de import en: ${path.basename(filePath)}`);
  }
});

console.log('\n═══════════════════════════════════════════════════════════');
console.log(`\n📊 Resumen:`);
console.log(`   ✅ Imports agregados: ${fixedCount}`);
console.log(`\n═══════════════════════════════════════════════════════════\n`);
