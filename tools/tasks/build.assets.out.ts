import {join} from 'path';
import * as merge from 'merge-stream';
import {APP_SRC, OUT_DIR} from '../config';

export = function buildAssetsOut(gulp:any, plugins:any) {
  return function () {

    return merge(getMainFile(), getSources());

    function getSources() {
      return gulp.src([
          join(APP_SRC, '**'),
          '!' + join(APP_SRC, '**', '*.ts'),
          '!' + join(APP_SRC, '**', '*.scss')
        ])
        .pipe(gulp.dest(`${OUT_DIR}/${APP_SRC}`));
    }

    function getMainFile() {
      return gulp.src([
        './ontimize.css',
        './CHANGELOG.md',
        './LICENSE',
        './README.md'
      ])
      .pipe(gulp.dest(OUT_DIR));
    }

  };
};
