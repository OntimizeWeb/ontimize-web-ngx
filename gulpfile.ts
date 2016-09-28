import * as gulp from 'gulp';
import {runSequence, task} from './tools/utils';

// --------------
// Clean (override).
gulp.task('clean',       task('clean', 'all'));
gulp.task('clean.dist',  task('clean', 'dist'));
gulp.task('clean.test',  task('clean', 'test'));
gulp.task('clean.tmp',   task('clean', 'tmp'));
gulp.task('clean.out',   task('clean', 'out'));
gulp.task('clean.css',   task('clean', 'css'));

gulp.task('check.versions', task('check.versions'));

// --------------
// Postinstall.
gulp.task('postinstall', (done:any) =>
  runSequence('clean',
              'npm',
              done));

// --------------
// Build dev.
gulp.task('build.dev', (done:any) =>
  runSequence('clean.dist',
              'tslint',
              'build.sass.dev',
              'build.assets.dev',
              'build.js.dev',
              done));

// --------------
// Build out.
gulp.task('build.out', (done:any) =>
  runSequence('clean.out',
              'tslint',
              'build.sass.dev',
              'build.assets.out',
              'build.js.out',
              'build.js.main.out',
              'clean.css',
              'bump',
              done));

// --------------
// Build prod.
gulp.task('build.prod', (done:any) =>
  runSequence('clean.dist',
              'clean.tmp',
              'tslint',
              'build.assets.prod',
              'build.js.prod',
              'build.bundles',
              done));

// --------------
// Watch.
gulp.task('build.dev.watch', (done:any) =>
  runSequence('build.dev',
              'watch.dev',
              done));

gulp.task('build.out.watch', (done:any) =>
  runSequence('build.out',
              'watch.out',
              done));

gulp.task('build.test.watch', (done:any) =>
  runSequence('build.test',
              'watch.test',
              done));

// --------------
// Test.
gulp.task('test', (done:any) =>
  runSequence('clean.test',
              'tslint',
              'build.test',
              'karma.start',
              done));


