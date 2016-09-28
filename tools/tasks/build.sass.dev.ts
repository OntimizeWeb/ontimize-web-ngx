import {join} from 'path';
// import {APP_SRC} from '../config';

export = function buildSassDev(gulp:any, plugins:any, option:any) {
  return function () {
    return gulp.src([
          join('./', '**/*.scss'),
          '!' + join('node_modules', '**/*.scss'),
          '!' + join('dist', '**/*.scss'),
          '!' + join('out', '**/*.scss'),
          '!' + join('tools', '**/*.scss'),
          '!' + join('typings', '**/*.scss')
        ])
      .pipe(plugins.sass().on('error', plugins.sass.logError))
      .pipe(gulp.dest('./'));
  };
};
