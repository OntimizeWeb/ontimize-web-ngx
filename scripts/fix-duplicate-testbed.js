const fs = require('fs');
const path = require('path');

// Find all spec files
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

// Check if file has duplicate TestBed.configureTestingModule calls
function hasDuplicateTestBed(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const matches = content.match(/await TestBed\.configureTestingModule\(/g);
  return matches && matches.length > 1;
}

// Try to fix duplicate TestBed blocks
function fixDuplicateTestBed(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Pattern: beforeEach with two TestBed.configureTestingModule blocks
  // Keep the first one (with manual creation) and remove the second
  const beforeEachRegex = /(beforeEach\(async \(\) => \{[\s\S]*?)(await TestBed\.configureTestingModule\(\{[\s\S]*?\}\)\.compileComponents\(\);[\s\S]*?component = new [^;]+;[\s\S]*?\}\);)([\s\S]*?)(await TestBed\.configureTestingModule\(\{[\s\S]*?\}\)(?:[\s\S]*?\.overrideComponent[\s\S]*?)?\).compileComponents\(\);[\s\S]*?component = [^;]+;[\s\S]*?\}\);)/;
  
  const match = content.match(beforeEachRegex);
  
  if (match) {
    // Keep the first beforeEach block, remove the duplicate
    const fixedContent = match[1] + match[2];
    content = content.replace(beforeEachRegex, fixedContent);
    
    console.log(`\n🔧 Fixing: ${path.basename(filePath)}`);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('  ✅ Removed duplicate TestBed configuration');
    return true;
  }
  
  return false;
}

console.log('🔍 Searching for files with duplicate TestBed configurations...\n');
console.log('═'.repeat(60));

const specFiles = findSpecFiles();
const filesWithDuplicates = [];

for (const file of specFiles) {
  if (hasDuplicateTestBed(file)) {
    filesWithDuplicates.push(file);
  }
}

console.log(`\nFound ${filesWithDuplicates.length} files with duplicate TestBed blocks\n`);

let fixedCount = 0;

for (const file of filesWithDuplicates) {
  try {
    if (fixDuplicateTestBed(file)) {
      fixedCount++;
    } else {
      console.log(`\n⚠️  Could not auto-fix: ${path.basename(file)}`);
    }
  } catch (error) {
    console.log(`\n❌ Error fixing ${path.basename(file)}: ${error.message}`);
  }
}

console.log('\n' + '═'.repeat(60));
console.log(`\n📈 Summary:`);
console.log(`   🔍 Files with duplicates: ${filesWithDuplicates.length}`);
console.log(`   ✅ Files fixed: ${fixedCount}`);
console.log(`   ⚠️  Files needing manual review: ${filesWithDuplicates.length - fixedCount}\n`);
