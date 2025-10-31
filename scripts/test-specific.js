const { execSync } = require('child_process');

console.log('🧪 Probando componentes corregidos...');

// Intentar compilar el proyecto primero
try {
  console.log('📦 Compilando proyecto...');
  execSync('npx ng build --configuration development', { stdio: 'pipe' });
  console.log('✅ Compilación exitosa');
} catch (error) {
  console.log('⚠️ Error de compilación, pero continuando con tests...');
}

// Ejecutar tests específicos
const testComponents = [
  'o-app-sidenav-image.component.spec.ts',
  'o-app-sidenav.component.spec.ts',
  'o-app-sidenav-menu-group.component.spec.ts',
  'o-app-sidenav-menu-item.component.spec.ts'
];

for (const component of testComponents) {
  try {
    console.log(`\\n🧪 Probando ${component}...`);
    execSync(`npx ng test --no-watch --browsers ChromeHeadless --include="**/${component}"`, { 
      stdio: 'pipe',
      timeout: 30000 
    });
    console.log(`✅ ${component} - PASSED`);
  } catch (error) {
    console.log(`❌ ${component} - FAILED`);
    console.log('Error:', error.stdout?.toString() || error.message);
  }
}

console.log('\\n🎯 Pruebas específicas completadas');