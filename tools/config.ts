import { readFileSync } from 'fs';
import { argv } from 'yargs';
import { normalize, join } from 'path';

// --------------
// Configuration.

const ENVIRONMENTS = {
  DEVELOPMENT: 'dev',
  PRODUCTION: 'prod'
};

export const PROJECT_ROOT = normalize(join(__dirname, '..'));
export const ENV = getEnvironment();
export const DEBUG = argv['debug'] || false;
export const PORT = argv['port'] || 5555;
export const LIVE_RELOAD_PORT = argv['reload-port'] || 4002;
export const DOCS_PORT = argv['docs-port'] || 4003;
export const APP_BASE = argv['base'] || '/';

export const ENABLE_HOT_LOADING = !!argv['hot-loader'];
export const HOT_LOADER_PORT = 5578;

export const BOOTSTRAP_MODULE = 'ontimize'; //ENABLE_HOT_LOADING ? 'hot_loader_main' : 'ontimize-app';

export const APP_TITLE = 'Ontimize Web Ng2';

export const APP_SRC = 'ontimize';
export const ASSETS_SRC = `${APP_SRC}`;

export const TOOLS_DIR = 'tools';
export const TMP_DIR = 'tmp';
export const OUT_DIR = 'out';
export const TEST_DEST = 'test';
export const DOCS_DEST = 'docs';
export const APP_DEST = `dist`;
export const ASSETS_DEST = `${APP_DEST}/assets`;
export const CSS_DEST = `${APP_DEST}/css`;
export const JS_DEST = `${APP_DEST}/js`;
export const APP_ROOT = ENV === 'dev' ? `${APP_BASE}${APP_DEST}/` : '${APP_BASE}';
export const VERSION = appVersion();

export const CSS_PROD_BUNDLE = 'all.css';
export const JS_PROD_SHIMS_BUNDLE = 'shims.js';
export const JS_PROD_APP_BUNDLE = 'ontimize.js';

export const VERSION_NPM = '2.14.2';
export const VERSION_NODE = '4.0.0';

interface InjectableDependency {
  src: string;
  inject: string | boolean;
  dest?: string;
}

/*
// Declare NPM dependencies (Note that globs should not be injected).
export const DEV_NPM_DEPENDENCIES: InjectableDependency[] = normalizeDependencies([
  { src: 'systemjs/dist/system-polyfills.src.js', inject: 'shims', dest: JS_DEST },
  { src: 'reflect-metadata/Reflect.js', inject: 'shims', dest: JS_DEST },
  { src: 'es6-shim/es6-shim.js', inject: 'shims', dest: JS_DEST },
  { src: 'systemjs/dist/system.src.js', inject: 'shims', dest: JS_DEST },
  { src: '@angular/bundles/angular2-polyfills.js', inject: 'shims', dest: JS_DEST },
  { src: 'rxjs/bundles/Rx.js', inject: 'libs', dest: JS_DEST },
  { src: '@angular/bundles/angular2.js', inject: 'libs', dest: JS_DEST },
  { src: '@angular/bundles/router.js', inject: 'libs', dest: JS_DEST },
  { src: '@angular/bundles/http.js', inject: 'libs', dest: JS_DEST },

  { src: 'moment/moment.js', inject: 'libs', dest: JS_DEST },

  { src: 'ng2-material/dist/ng2-material.css', inject: true, dest: CSS_DEST },
  { src: 'ng2-material/dist/font.css', inject: true, dest: CSS_DEST }
]);

export const PROD_NPM_DEPENDENCIES: InjectableDependency[] = normalizeDependencies([
  { src: 'reflect-metadata/Reflect.js', inject: 'shims' },
  { src: 'es6-shim/es6-shim.min.js', inject: 'shims' },
  { src: '@angular/bundles/angular2-polyfills.min.js', inject: 'libs' },

  { src: 'ng2-material/dist/ng2-material.css', inject: true, dest: CSS_DEST },
  { src: 'ng2-material/dist/font.css', inject: true, dest: CSS_DEST }
]);

// Declare local files that needs to be injected
export const APP_ASSETS: InjectableDependency[] = [
  { src: `${ASSETS_SRC}/main.css`, inject: true, dest: CSS_DEST }
];


export const DEV_DEPENDENCIES = DEV_NPM_DEPENDENCIES.concat(APP_ASSETS);
export const PROD_DEPENDENCIES = PROD_NPM_DEPENDENCIES.concat(APP_ASSETS);
*/

// ----------------
// SystemsJS Configuration.
const SYSTEM_CONFIG_DEV = {
  defaultJSExtensions: true,
  paths: {
    [BOOTSTRAP_MODULE]: `${APP_ROOT}app/${BOOTSTRAP_MODULE}`,
    '@angular/*': `${APP_BASE}node_modules/@angular/*`,
    'rxjs/*': `${APP_BASE}node_modules/rxjs/*`,
    'moment/*': `${APP_BASE}node_modules/moment/*`,
    'ng2-material/*': `${APP_BASE}node_modules/ng2-material/*`,
    '@ngx-translate/core/*': `${APP_BASE}node_modules/ngx-translate/core/*`,
    '@ngx-translate/http-loader/*': `${APP_BASE}node_modules/ngx-translate/http-loader/*`,
    '*': `${APP_BASE}node_modules/*`
  }
};
/*
,
  packages: {
    angular2: { defaultExtension: false },
    rxjs: { defaultExtension: false }
  }
*/

export const SYSTEM_CONFIG = SYSTEM_CONFIG_DEV;

// --------------
// Private.


function appVersion(): number | string {
  var pkg = JSON.parse(readFileSync('package.json').toString());
  return pkg.version;
}

function getEnvironment() {
  let base: string[] = argv['_'];
  let prodKeyword = !!base.filter(o => o.indexOf(ENVIRONMENTS.PRODUCTION) >= 0).pop();
  if (base && prodKeyword || argv['env'] === ENVIRONMENTS.PRODUCTION) {
    return ENVIRONMENTS.PRODUCTION;
  } else {
    return ENVIRONMENTS.DEVELOPMENT;
  }
}
