const fs = require('fs');
const path = require('path');

// Lista de componentes que ya tienen creación manual y necesitan import dinámico
const componentsToFix = [
  'o-context-menu.component.spec.ts',
  'o-app-header.component.spec.ts',
  'o-checkbox.component.spec.ts',
  'o-column.component.spec.ts',
  'o-row.component.spec.ts',
  'o-context-menu-content.component.spec.ts',
  'o-context-menu-group.component.spec.ts',
  'o-bar-menu-group.component.spec.ts',
  'o-locale-bar-menu-item.component.spec.ts',
  'o-app-sidenav.component.spec.ts',
  'o-button.component.spec.ts',
  'o-dual-list-selector.component.spec.ts',
  'o-grid-item.component.spec.ts',
  'o-bar-menu-nested.component.spec.ts',
  'o-app-sidenav-image.component.spec.ts',
  'o-form-container.component.spec.ts',
  'o-filter-builder-menu.component.spec.ts',
  'o-breadcrumb.component.spec.ts'
];

function findFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      findFiles(fullPath, files);
    } else if (componentsToFix.includes(item)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function applyDynamicImport(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Extraer el nombre del componente del import
  const importMatch = content.match(/import\s*{\s*(\w+Component)\s*}\s*from\s*['"](.+?)['"]/);
  
  if (!importMatch) {
    console.log(`❌ No se encontró import en: ${filePath}`);
    return false;
  }
  
  const componentName = importMatch[1];
  const importPath = importMatch[2];
  
  // Verificar si ya usa import dinámico
  if (content.includes('// Import component dynamically') || content.includes('await import(')) {
    console.log(`⏭️  Ya tiene import dinámico: ${path.basename(filePath)}`);
    return false;
  }
  
  // Verificar si el componente se crea manualmente (tiene "new ComponentName")
  if (!content.includes(`new ${componentName}`)) {
    console.log(`⏭️  No usa creación manual: ${path.basename(filePath)}`);
    return false;
  }
  
  // Reemplazar el import estático por comentario y variable
  const newImport = `// Import component dynamically to avoid compilation
let ${componentName}: any;`;
  
  content = content.replace(
    /import\s*{\s*\w+Component\s*}\s*from\s*['"].+?['"];/,
    newImport
  );
  
  // Agregar el import dinámico al inicio del beforeEach
  content = content.replace(
    /(beforeEach\(async \(\) => {)/,
    `$1
    // Dynamically import to avoid early compilation
    const module = await import('${importPath}');
    ${componentName} = module.${componentName};
    `
  );
  
  // Cambiar el tipo del componente a 'any' en la declaración
  content = content.replace(
    new RegExp(`let component: ${componentName};`),
    `let component: any;`
  );
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Arreglado: ${path.basename(filePath)}`);
  return true;
}

console.log('🔍 Buscando archivos de test...\n');

const projectRoot = path.join(__dirname, '..', 'projects', 'ontimize-web-ngx', 'src', 'lib');
const files = findFiles(projectRoot);

console.log(`📝 Encontrados ${files.length} archivos para procesar\n`);

let fixed = 0;
let skipped = 0;

for (const file of files) {
  if (applyDynamicImport(file)) {
    fixed++;
  } else {
    skipped++;
  }
}

console.log(`\n✨ Proceso completado:`);
console.log(`   ✅ Arreglados: ${fixed}`);
console.log(`   ⏭️  Omitidos: ${skipped}`);
console.log(`   📊 Total: ${files.length}`);
