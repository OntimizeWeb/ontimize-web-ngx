const fs = require('fs');
const path = require('path');

// Find all spec files in the project
function findSpecFiles() {
  const projectPath = path.join(__dirname, '..', 'projects', 'ontimize-web-ngx', 'src', 'lib');
  const specFiles = [];
  
  function searchDir(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        searchDir(fullPath);
      } else if (item.endsWith('.spec.ts')) {
        specFiles.push(fullPath);
      }
    }
  }
  
  searchDir(projectPath);
  return specFiles;
}

// Fix missing imports in a file
function fixMissingImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Check if file uses certain types but doesn't import them
  const imports = {
    'Injector': '@angular/core',
    'ElementRef': '@angular/core',
    'ChangeDetectorRef': '@angular/core',
    'NgZone': '@angular/core',
    'Router': '@angular/router',
    'ActivatedRoute': '@angular/router',
    'MatDialogRef': '@angular/material/dialog',
    'MAT_DIALOG_DATA': '@angular/material/dialog',
    'of': 'rxjs'
  };
  
  const missingImports = {};
  
  // Check which imports are needed
  for (const [type, module] of Object.entries(imports)) {
    // Check if type is used in the code
    const usageRegex = new RegExp(`\\b${type}\\b`);
    if (usageRegex.test(content)) {
      // Check if it's already imported
      const importRegex = new RegExp(`import\\s*\\{[^}]*\\b${type}\\b[^}]*\\}\\s*from\\s*['"]${module.replace(/\//g, '\\/')}['"]`);
      if (!importRegex.test(content)) {
        if (!missingImports[module]) {
          missingImports[module] = [];
        }
        missingImports[module].push(type);
      }
    }
  }
  
  if (Object.keys(missingImports).length === 0) {
    return false;
  }
  
  console.log(`\n🔧 Fixing: ${path.basename(filePath)}`);
  
  // Add missing imports
  for (const [module, types] of Object.entries(missingImports)) {
    console.log(`  📦 Adding imports: ${types.join(', ')} from ${module}`);
    
    // Check if there's already an import from this module
    const existingImportRegex = new RegExp(`import\\s*\\{([^}]*)\\}\\s*from\\s*['"]${module.replace(/\//g, '\\/')}['"];?`);
    const match = content.match(existingImportRegex);
    
    if (match) {
      // Add to existing import
      const existingImports = match[1];
      const newImports = existingImports + ', ' + types.join(', ');
      content = content.replace(
        existingImportRegex,
        `import { ${newImports} } from '${module}';`
      );
    } else {
      // Add new import after TestBed import or at the start
      const newImport = `import { ${types.join(', ')} } from '${module}';\n`;
      const testBedImportMatch = content.match(/import\s*\{[^}]*TestBed[^}]*\}\s*from\s*'@angular\/core\/testing';\n/);
      
      if (testBedImportMatch) {
        content = content.replace(testBedImportMatch[0], testBedImportMatch[0] + newImport);
      } else {
        // Add at the very beginning
        content = newImport + content;
      }
    }
    
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('  ✅ Fixed successfully');
  }
  
  return modified;
}

// Main execution
console.log('🔍 Searching for spec files with missing imports...\n');

const specFiles = findSpecFiles();
let fixedCount = 0;

console.log('═'.repeat(60));

for (const file of specFiles) {
  try {
    if (fixMissingImports(file)) {
      fixedCount++;
    }
  } catch (error) {
    console.log(`\n❌ Error processing ${path.basename(file)}: ${error.message}`);
  }
}

console.log('\n' + '═'.repeat(60));
console.log(`\n📈 Summary:`);
console.log(`   ✅ Files fixed: ${fixedCount}`);
console.log(`   📁 Total checked: ${specFiles.length}\n`);

if (fixedCount > 0) {
  console.log('🎉 Missing imports have been added!\n');
}
