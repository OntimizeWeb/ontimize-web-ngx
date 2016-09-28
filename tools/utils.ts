export * from './utils/template_injectables';
export * from './utils/template_locals';
export * from './utils/server';
export * from './utils/tasks_tools';


export function tsProjectFn(plugins:any) {
  return plugins.typescript.createProject('tsconfig.json', {
    typescript: require('typescript')
  });
}
