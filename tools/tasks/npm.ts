export = function npm(gulp:any, plugins:any) {
  return plugins.shell.task([
    'npm prune'
  ]);
};
