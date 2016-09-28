import {join} from 'path';
import {APP_SRC, TOOLS_DIR} from '../config';

export = function tslint(gulp:any, plugins:any) {
  return function () {
    let src = [
      join(APP_SRC, '**/*.ts'),
      join(TOOLS_DIR, '**/*.ts'),
    ];

    return gulp.src(src)
      .pipe(plugins.tslint())
      .pipe(plugins.tslint.report(plugins.tslintStylish, {
        emitError: true,
        sort: true,
        bell: true
      }));
  };
};
