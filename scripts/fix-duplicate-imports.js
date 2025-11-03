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

// Remove duplicate imports from a file
function removeDuplicateImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Split content into lines
  const lines = content.split('\n');
  const seenImports = new Map();
  const newLines = [];
  const duplicateLines = [];
  
  // Track what we're importing (e.g., OTestingUtils)
  const importsByName = new Map();
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if it's an import line
    const importMatch = line.match(/^import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]/);
    
    if (importMatch) {
      const importedItems = importMatch[1].split(',').map(s => s.trim()).filter(s => s);
      const fromPath = importMatch[2];
      
      // Check if we're importing the same items from different paths (e.g., OTestingUtils)
      let isDuplicate = false;
      for (const item of importedItems) {
        if (importsByName.has(item)) {
          // This item was already imported
          isDuplicate = true;
          duplicateLines.push(i + 1);
          modified = true;
          break;
        }
      }
      
      if (isDuplicate) {
        // Skip this duplicate import line
        continue;
      }
      
      // Also check for exact path match
      const key = fromPath;
      if (seenImports.has(key)) {
        // Duplicate import from same module
        const existingIndex = seenImports.get(key);
        const existingLine = newLines[existingIndex];
        const existingMatch = existingLine.match(/^import\s*\{([^}]+)\}\s*from/);
        
        if (existingMatch) {
          const existingItems = existingMatch[1].split(',').map(s => s.trim()).filter(s => s);
          
          // Merge imports, removing duplicates
          const allItems = [...new Set([...existingItems, ...importedItems])];
          
          // Update the existing import line
          newLines[existingIndex] = `import { ${allItems.join(', ')} } from '${fromPath}';`;
          
          duplicateLines.push(i + 1);
          modified = true;
          continue;
        }
      }
      
      // Track this import
      seenImports.set(key, newLines.length);
      for (const item of importedItems) {
        importsByName.set(item, fromPath);
      }
    }
    
    newLines.push(line);
  }
  
  if (modified) {
    console.log(`\n🔧 Fixing: ${path.basename(filePath)}`);
    console.log(`  🔄 Removed duplicate imports from lines: ${duplicateLines.join(', ')}`);
    
    content = newLines.join('\n');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('  ✅ Fixed successfully');
  }
  
  return modified;
}

// Main execution
console.log('🔍 Searching for spec files with duplicate imports...\n');

const specFiles = findSpecFiles();
let fixedCount = 0;

console.log('═'.repeat(60));

for (const file of specFiles) {
  try {
    if (removeDuplicateImports(file)) {
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
  console.log('🎉 Duplicate imports have been removed!\n');
}
