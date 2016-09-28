import {join} from 'path';
import {APP_SRC, APP_DEST} from '../config';
import {templateLocals, tsProjectFn} from '../utils';
import * as merge from 'merge-stream';

export = function buildJSDev(gulp:any, plugins:any) :any {
  let tsProject = tsProjectFn(plugins);

  return function() {
    let src = [
      'tools/manual_typings/manual.typings.d.ts',
      'typings/browser.d.ts',
      join(APP_SRC, '**/*.ts'),
      '!' + join(APP_SRC, '**/*.spec.ts')
    ];
    let result = gulp.src(src)
      .pipe(plugins.plumber())
      // Won't be required for non-production build after the change
      .pipe(plugins.inlineNg2Template({ base: APP_SRC + '/components' }))
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.typescript(tsProject));

    return merge(getJS(), getDefinitions());

    function getJS() {
     return  result.js
        .pipe(plugins.sourcemaps.write())
        .pipe(plugins.template(templateLocals()))
        .pipe(gulp.dest(APP_DEST));
    }

    function getDefinitions() {
      return result.dts
      .pipe(plugins.template(templateLocals()))
      .pipe(gulp.dest(APP_DEST));
    }

    // return result.js
    //   .pipe(plugins.sourcemaps.write())
    //   .pipe(plugins.template(templateLocals()))
    //   .pipe(gulp.dest(APP_DEST));
  };
};
