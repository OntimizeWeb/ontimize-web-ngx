const { execSync } = require('child_process');

/**
 * Script consolidado para ejecutar todas las correcciones de tests
 */
function runCommand(command, description) {
  console.log(`\n🔧 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completado!`);
  } catch (error) {
    console.error(`❌ Error en ${description}:`, error.message);
    return false;
  }
  return true;
}

function main() {
  console.log('🎯 Ejecutando todas las correcciones de tests...\n');
  
  const corrections = [
    {
      command: 'npm run fix-tests',
      description: 'Corrección general de errores'
    },
    {
      command: 'npm run improve-tests',
      description: 'Mejora de templates de tests'
    },
    {
      command: 'npm run final-fix-tests',
      description: 'Corrección avanzada de nombres'
    },
    {
      command: 'npm run fix-fixture-creation',
      description: 'Corrección de createComponent'
    },
    {
      command: 'npm run fix-service-tests',
      description: 'Corrección de tests de servicios'
    },
    {
      command: 'npm run fix-service-names',
      description: 'Corrección de nombres de servicios'
    },
    {
      command: 'npm run fix-circular-dependencies',
      description: 'Corrección de dependencias circulares'
    },
    {
      command: 'npm run fix-contentchildren-queries',
      description: 'Corrección de queries @ContentChildren/@ViewChild'
    }
  ];
  
  let successCount = 0;
  
  for (const correction of corrections) {
    const success = runCommand(correction.command, correction.description);
    if (success) {
      successCount++;
    }
  }
  
  console.log(`\n📊 Resumen Final:`);
  console.log(`   • ${successCount}/${corrections.length} correcciones exitosas`);
  
  if (successCount === corrections.length) {
    console.log('\n🎉 ¡Todas las correcciones aplicadas exitosamente!');
    console.log('\n🚀 Comandos disponibles:');
    console.log('   • npm run test-ci        - Ejecutar todos los tests');
    console.log('   • npm run test-coverage  - Tests con reporte de cobertura');
    console.log('   • npm run test           - Tests en modo desarrollo');
  } else {
    console.log('\n⚠️  Algunas correcciones fallaron. Revisar errores arriba.');
  }
}

// Ejecutar el script
main();