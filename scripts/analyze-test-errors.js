const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Analizando errores de tests...\n');

try {
  // Ejecutar tests y capturar salida
  const output = execSync('npm run test:lib -- --browsers=ChromeHeadless --watch=false', {
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024, // 10MB buffer
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  analyzeOutput(output);
} catch (error) {
  // Los tests fallan, pero obtenemos la salida de todos modos
  if (error.stdout) {
    analyzeOutput(error.stdout);
  }
  if (error.stderr) {
    analyzeOutput(error.stderr);
  }
}

function analyzeOutput(output) {
  const lines = output.split('\n');
  
  const errorPatterns = {
    'Cannot read properties of undefined': [],
    'is not a function': [],
    'undefined is not an object': [],
    'Cannot set properties of undefined': [],
    'Expected undefined to be truthy': [],
    'TypeError': [],
    'ReferenceError': [],
    'Other': []
  };
  
  let currentTest = '';
  let currentError = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detectar nombre del test
    if (line.includes('FAILED') || line.includes('✗')) {
      const match = line.match(/(.+component\.spec\.ts|.+\.spec\.ts)/i);
      if (match) {
        currentTest = match[1].trim();
      }
    }
    
    // Detectar errores
    for (const pattern in errorPatterns) {
      if (line.includes(pattern)) {
        if (!errorPatterns[pattern].includes(currentTest) && currentTest) {
          errorPatterns[pattern].push({
            test: currentTest,
            error: line.trim()
          });
        }
      }
    }
  }
  
  // Mostrar resumen
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log('📊 RESUMEN DE ERRORES POR CATEGORÍA:\n');
  
  let totalErrors = 0;
  for (const pattern in errorPatterns) {
    const count = errorPatterns[pattern].length;
    if (count > 0) {
      totalErrors += count;
      console.log(`${pattern}: ${count} errores`);
      
      // Mostrar algunos ejemplos
      if (count <= 5) {
        errorPatterns[pattern].forEach(item => {
          console.log(`   - ${item.test}`);
          console.log(`     ${item.error.substring(0, 100)}...`);
        });
      } else {
        console.log(`   (Mostrando primeros 5 de ${count})`);
        errorPatterns[pattern].slice(0, 5).forEach(item => {
          console.log(`   - ${item.test}`);
        });
      }
      console.log('');
    }
  }
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`\n📈 Total de categorías con errores: ${totalErrors}`);
}
