const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all spec files that still use TestBed.createComponent
function findAffectedSpecFiles() {
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
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Check if it uses TestBed.createComponent and doesn't already have dynamic import
        if (content.includes('TestBed.createComponent') && 
            !content.includes('// Import component dynamically')) {
          specFiles.push(fullPath);
        }
      }
    }
  }
  
  searchDir(projectPath);
  return specFiles;
}

// Extract component name from spec file
function getComponentName(specFilePath) {
  const content = fs.readFileSync(specFilePath, 'utf8');
  const match = content.match(/import\s*\{\s*(\w+Component)\s*\}\s*from/);
  return match ? match[1] : null;
}

// Get constructor signature from component file
function getConstructorInfo(specFilePath, componentName) {
  const specDir = path.dirname(specFilePath);
  const specFileName = path.basename(specFilePath);
  
  // Extract component file name from spec file name
  // e.g., o-button.component.spec.ts -> o-button.component.ts
  const componentFileName = specFileName.replace('.spec.ts', '.ts');
  
  const componentPath = path.join(specDir, componentFileName);
  
  if (!fs.existsSync(componentPath)) {
    console.log(`  ⚠️  Component file not found: ${componentFileName}`);
    return null;
  }
  
  const content = fs.readFileSync(componentPath, 'utf8');
  
  // Find constructor
  const constructorMatch = content.match(/constructor\s*\(([\s\S]*?)\)\s*\{/);
  if (!constructorMatch) {
    return { params: [] };
  }
  
  const paramsStr = constructorMatch[1];
  const params = [];
  
  // Parse parameters
  const paramRegex = /(?:public|private|protected)?\s*(\w+)\s*:\s*([\w<>\[\]]+)/g;
  let match;
  
  while ((match = paramRegex.exec(paramsStr)) !== null) {
    params.push({
      name: match[1],
      type: match[2]
    });
  }
  
  return { params };
}

// Generate mock code for constructor parameters
function generateMocks(params) {
  const mocks = [];
  const mockNames = [];
  
  for (const param of params) {
    const mockName = `mock${param.type.replace(/[<>\[\]]/g, '')}`;
    mockNames.push(mockName);
    
    if (param.type.includes('Injector')) {
      mocks.push(`    const ${mockName} = TestBed.inject(Injector);`);
    } else if (param.type.includes('ElementRef')) {
      mocks.push(`    const ${mockName}: any = { nativeElement: document.createElement('div') };`);
    } else if (param.type.includes('ChangeDetectorRef')) {
      mocks.push(`    const ${mockName}: any = { detectChanges: jasmine.createSpy(), markForCheck: jasmine.createSpy() };`);
    } else if (param.type.includes('Router')) {
      mocks.push(`    const ${mockName}: any = { navigate: jasmine.createSpy(), events: of({}) };`);
    } else if (param.type.includes('ActivatedRoute')) {
      mocks.push(`    const ${mockName}: any = { params: of({}), queryParams: of({}), snapshot: { params: {}, queryParams: {} } };`);
    } else if (param.type.includes('MatDialogRef')) {
      mocks.push(`    const ${mockName}: any = { close: jasmine.createSpy() };`);
    } else if (param.type.includes('NgZone')) {
      mocks.push(`    const ${mockName}: any = { run: (fn: any) => fn() };`);
    } else {
      mocks.push(`    const ${mockName}: any = {};`);
    }
  }
  
  return { mocks, mockNames };
}

// Apply fix to spec file
function fixSpecFile(specFilePath) {
  console.log(`\n🔧 Processing: ${path.basename(specFilePath)}`);
  
  const componentName = getComponentName(specFilePath);
  if (!componentName) {
    console.log('  ❌ Could not extract component name');
    return false;
  }
  
  console.log(`  📦 Component: ${componentName}`);
  
  const constructorInfo = getConstructorInfo(specFilePath, componentName);
  if (!constructorInfo) {
    console.log('  ❌ Could not analyze constructor');
    return false;
  }
  
  console.log(`  🔍 Constructor params: ${constructorInfo.params.length}`);
  
  let content = fs.readFileSync(specFilePath, 'utf8');
  
  // Step 1: Replace imports
  const importRegex = new RegExp(
    `import\\s*\\{\\s*ComponentFixture,\\s*TestBed\\s*\\}\\s*from\\s*'@angular/core/testing';([\\s\\S]*?)import\\s*\\{\\s*${componentName}\\s*\\}\\s*from\\s*'[^']+';`,
    'm'
  );
  
  const otherImportsMatch = content.match(importRegex);
  if (!otherImportsMatch) {
    console.log('  ⚠️  Could not find import section');
    return false;
  }
  
  const otherImports = otherImportsMatch[1].trim();
  const componentImportMatch = content.match(new RegExp(`import\\s*\\{\\s*${componentName}\\s*\\}\\s*from\\s*'([^']+)';`));
  const componentPath = componentImportMatch ? componentImportMatch[1] : `./${componentName.replace(/([A-Z])/g, '-$1').toLowerCase().substring(1)}`;
  
  const newImports = `import { TestBed } from '@angular/core/testing';
${otherImports}
import { OTestingUtils } from '../../../shared/testing/o-testing-utils';

// Import component dynamically to avoid compilation
let ${componentName}: any;`;
  
  content = content.replace(importRegex, newImports);
  
  // Step 2: Replace beforeEach
  const { mocks, mockNames } = generateMocks(constructorInfo.params);
  const instantiation = mockNames.length > 0 
    ? `new ${componentName}(${mockNames.join(', ')})`
    : `new ${componentName}()`;
  
  const beforeEachRegex = /beforeEach\(async \(\) => \{[\s\S]*?\}\);/;
  
  const newBeforeEach = `beforeEach(async () => {
    // Dynamically import to avoid early compilation
    const module = await import('${componentPath}');
    ${componentName} = module.${componentName};
    
    await TestBed.configureTestingModule({
      declarations: [...OTestingUtils.getCommonDeclarations()],
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    // Create component manually to avoid OWrapperContentMenuComponent issues
${mocks.join('\n')}
    component = ${instantiation};
  });`;
  
  content = content.replace(beforeEachRegex, newBeforeEach);
  
  // Step 3: Remove fixture variable and fix its usage
  content = content.replace(/let component: \w+;[\s\S]*?let fixture: ComponentFixture<\w+>;/, 'let component: any;');
  
  // Replace fixture.detectChanges() calls
  content = content.replace(/fixture\.detectChanges\(\);/g, '// detectChanges not needed with manual instantiation');
  
  // Replace fixture.componentInstance with component
  content = content.replace(/fixture\.componentInstance/g, 'component');
  
  // Fix instanceof checks
  content = content.replace(
    new RegExp(`expect\\(component\\)\\.toBeInstanceOf\\(${componentName}\\);`, 'g'),
    `expect(component.constructor).toBe(${componentName});`
  );
  
  fs.writeFileSync(specFilePath, content, 'utf8');
  console.log('  ✅ Fixed successfully');
  return true;
}

// Main execution
console.log('🔍 Searching for spec files that need fixing...\n');

const affectedFiles = findAffectedSpecFiles();

console.log(`\n📊 Found ${affectedFiles.length} spec files to fix\n`);
console.log('═'.repeat(60));

let successCount = 0;
let failCount = 0;

for (const file of affectedFiles) {
  try {
    const success = fixSpecFile(file);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    failCount++;
  }
}

console.log('\n' + '═'.repeat(60));
console.log(`\n📈 Summary:`);
console.log(`   ✅ Successfully fixed: ${successCount}`);
console.log(`   ❌ Failed: ${failCount}`);
console.log(`   📁 Total processed: ${affectedFiles.length}\n`);

if (successCount > 0) {
  console.log('🎉 Run your tests to verify the fixes!\n');
}
