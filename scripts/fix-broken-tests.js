const fs = require('fs');
const path = require('path');

const problematicFiles = [
  'o-app-sidenav-menu-group.component.spec.ts',
  'o-app-sidenav-menu-item.component.spec.ts',
  'o-card-menu-item.component.spec.ts',
  'o-column-collapsible.component.spec.ts',
  'o-row-collapsible.component.spec.ts',
  'o-filter-builder.component.spec.ts',
  'o-form-navigation.component.spec.ts',
  'o-form-toolbar.component.spec.ts',
  'o-grid.component.spec.ts'
];

function findFile(fileName) {
  const projectPath = path.join(__dirname, '..', 'projects', 'ontimize-web-ngx', 'src', 'lib');
  
  function searchDir(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        const result = searchDir(fullPath);
        if (result) return result;
      } else if (item === fileName) {
        return fullPath;
      }
    }
    return null;
  }
  
  return searchDir(projectPath);
}

function fixBrokenFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Fix: component = component; -> proper instantiation
  if (content.includes('component = component;')) {
    // Extract component name
    const componentMatch = content.match(/let\s+(\w+Component):\s*any;/);
    if (componentMatch) {
      const componentName = componentMatch[1];
      
      // Replace the broken line with proper instantiation
      content = content.replace(
        /fixture = TestBed\.createComponent\([^)]+\);[\s\n]*component = component;/g,
        `// Create component manually to avoid OWrapperContentMenuComponent issues\n    component = new ${componentName}(mockInjector, mockRouter, mockElementRef);`
      );
      
      modified = true;
    }
  }
  
  // Fix: Remove fixture references that shouldn't be there
  if (content.includes('fixture = TestBed.createComponent') && content.includes('// Import component dynamically')) {
    // This file was supposed to use manual creation, remove TestBed.createComponent
    content = content.replace(
      /fixture = TestBed\.createComponent\([^)]+\);[\s\n]*/g,
      ''
    );
    modified = true;
  }
  
  // Fix: Remove testBed references (should be TestBed)
  if (content.includes('testBed.')) {
    content = content.replace(/testBed\./g, 'TestBed.');
    modified = true;
  }
  
  // Fix: Remove fixture variable if file uses manual creation
  if (content.includes('// Import component dynamically') && content.includes('let fixture:')) {
    content = content.replace(/let fixture: ComponentFixture<[^>]+>;[\s\n]*/g, '');
    modified = true;
  }
  
  // Fix: Add missing variable declarations for manual creation files
  if (content.includes('// Import component dynamically') && content.includes('Cannot find name')) {
    // Make sure component is declared
    if (!content.match(/let component:\s*any;/)) {
      const describeMatch = content.match(/describe\([^{]+\{\s*let/);
      if (describeMatch) {
        content = content.replace(
          /describe\([^{]+\{\s*/,
          `$&\n  let component: any;\n`
        );
        modified = true;
      }
    }
  }
  
  if (modified) {
    console.log(`\n🔧 Fixing: ${path.basename(filePath)}`);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('  ✅ Fixed successfully');
  }
  
  return modified;
}

console.log('🔍 Fixing broken test files...\n');
console.log('═'.repeat(60));

let fixedCount = 0;

for (const fileName of problematicFiles) {
  const filePath = findFile(fileName);
  if (filePath) {
    try {
      if (fixBrokenFile(filePath)) {
        fixedCount++;
      }
    } catch (error) {
      console.log(`\n❌ Error fixing ${fileName}: ${error.message}`);
    }
  } else {
    console.log(`\n⚠️  File not found: ${fileName}`);
  }
}

console.log('\n' + '═'.repeat(60));
console.log(`\n📈 Summary:`);
console.log(`   ✅ Files fixed: ${fixedCount}`);
console.log(`   📁 Total attempted: ${problematicFiles.length}\n`);
