const fs = require('fs');
const path = require('path');
const glob = require('glob');

const projectRoot = path.join(__dirname, '..', 'projects', 'ontimize-web-ngx', 'src', 'lib');

// Buscar todos los archivos spec.ts
glob(projectRoot + '/**/*.spec.ts', (err, files) => {
  if (err) {
    console.error('Error buscando archivos:', err);
    return;
  }

  let fixed = 0;

  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Buscar patrón incorrecto: import después de "let ComponentName: any;"
    const badPattern = /(\/\/ Import component dynamically to avoid compilation\s+let \w+Component: any;\s+)(import .+? from .+?;)/;
    
    if (badPattern.test(content)) {
      // Mover el import antes del comentario
      content = content.replace(
        badPattern,
        (match, dynamicPart, importLine) => {
          return importLine + '\n\n' + dynamicPart;
        }
      );
      
      fs.writeFileSync(file, content, 'utf8');
      console.log(`✅ Arreglado: ${path.basename(file)}`);
      fixed++;
    }
  });

  console.log(`\n✨ Total arreglados: ${fixed}`);
});
