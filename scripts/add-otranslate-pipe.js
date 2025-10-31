const fs = require('fs');
const path = require('path');

/**
 * Script para agregar OTranslatePipe usando OTestingUtils.getCommonDeclarations()
 * en todos los archivos spec.ts que lo necesiten
 */

const projectRoot = path.join(__dirname, '..');
const componentsDir = path.join(projectRoot, 'projects', 'ontimize-web-ngx', 'src', 'lib', 'components');

let filesUpdated = 0;
let filesSkipped = 0;

function updateSpecFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Verificar si ya usa OTestingUtils.getCommonDeclarations()
  if (content.includes('...OTestingUtils.getCommonDeclarations()')) {
    filesSkipped++;
    return false;
  }
  
  // Verificar si usa OTestingUtils
  if (!content.includes('OTestingUtils')) {
    filesSkipped++;
    return false;
  }
  
  // Buscar el patrón: declarations: [ComponentName],
  const declarationsPattern = /declarations:\s*\[([^\]]+)\],/;
  const match = content.match(declarationsPattern);
  
  if (!match) {
    filesSkipped++;
    return false;
  }
  
  const currentDeclarations = match[1].trim();
  
  // Si ya tiene OTranslatePipe explícitamente, no hacer nada
  if (currentDeclarations.includes('OTranslatePipe')) {
    filesSkipped++;
    return false;
  }
  
  // Actualizar las declaraciones para incluir ...OTestingUtils.getCommonDeclarations()
  const newDeclarations = `declarations: [${currentDeclarations}, ...OTestingUtils.getCommonDeclarations()],`;
  const updatedContent = content.replace(declarationsPattern, newDeclarations);
  
  fs.writeFileSync(filePath, updatedContent, 'utf8');
  console.log(`✅ Actualizado: ${path.relative(projectRoot, filePath)}`);
  filesUpdated++;
  return true;
}

function processDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.spec.ts')) {
      try {
        updateSpecFile(fullPath);
      } catch (error) {
        console.error(`❌ Error procesando ${fullPath}:`, error.message);
      }
    }
  }
}

console.log('🔧 Agregando OTranslatePipe a archivos de test...\n');
processDirectory(componentsDir);

console.log(`\n📊 Resumen:`);
console.log(`   • ${filesUpdated} archivos actualizados`);
console.log(`   • ${filesSkipped} archivos omitidos (ya actualizados o no aplica)`);

if (filesUpdated > 0) {
  console.log('\n✨ ¡Proceso completado exitosamente!');
}
