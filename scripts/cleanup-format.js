const fs = require('fs');
const path = require('path');

console.log('🔧 Limpiando problemas de formato en archivos corregidos...');

const filesToFix = [
  'projects/ontimize-web-ngx/src/lib/components/app-sidenav/menu-group/o-app-sidenav-menu-group.component.spec.ts',
  'projects/ontimize-web-ngx/src/lib/components/app-sidenav/menu-item/o-app-sidenav-menu-item.component.spec.ts'
];

for (const filePath of filesToFix) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Corregir import de Subject mal formateado
    content = content.replace(/import \{ Subject \} from 'rxjs';\\nimport/g, 'import { Subject } from \'rxjs\';\nimport');
    
    // Corregir declaración de variable mal formateada
    content = content.replace(/ComponentFixture<[^>]+>;\\n  let mockSidenav/g, (match) => {
      return match.replace('\\n  let', '\n  let');
    });
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Limpiado: ${filePath}`);
  }
}

console.log('🎯 Limpieza de formato completada!');