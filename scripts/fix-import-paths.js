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

// Calculate correct relative path to o-testing-utils
function getCorrectPath(specFilePath) {
  const sharedTestingPath = path.join(__dirname, '..', 'projects', 'ontimize-web-ngx', 'src', 'lib', 'shared', 'testing', 'o-testing-utils.ts');
  const relativePath = path.relative(path.dirname(specFilePath), sharedTestingPath);
  // Convert to forward slashes and remove .ts extension
  return relativePath.replace(/\\/g, '/').replace('.ts', '');
}

// Fix incorrect import paths
function fixImportPath(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  const correctPath = getCorrectPath(filePath);
  
  // Find all OTestingUtils imports with incorrect paths
  const incorrectPaths = [
    '../../../shared/testing/o-testing-utils',
    '../../testing/o-testing-utils',
    '../testing/o-testing-utils',
    '../../../../shared/testing/o-testing-utils',
    '../../../../../shared/testing/o-testing-utils'
  ];
  
  for (const incorrectPath of incorrectPaths) {
    if (incorrectPath !== correctPath) {
      const regex = new RegExp(`(import\\s*\\{[^}]*OTestingUtils[^}]*\\}\\s*from\\s*['"])${incorrectPath.replace(/\//g, '\\/')}(['"];?)`, 'g');
      if (regex.test(content)) {
        content = content.replace(regex, `$1${correctPath}$2`);
        modified = true;
      }
    }
  }
  
  if (modified) {
    console.log(`\n🔧 Fixing: ${path.basename(filePath)}`);
    console.log(`  ✅ Updated path to: ${correctPath}`);
    fs.writeFileSync(filePath, content, 'utf8');
  }
  
  return modified;
}

// Main execution
console.log('🔍 Fixing incorrect import paths...\n');
console.log('═'.repeat(60));

const specFiles = findSpecFiles();
let fixedCount = 0;

for (const file of specFiles) {
  try {
    if (fixImportPath(file)) {
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
  console.log('🎉 Import paths have been corrected!\n');
}
