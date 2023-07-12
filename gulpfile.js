const gulp = require('gulp');
const copyfiles = require('copyfiles');
const cssimport = require("gulp-cssimport");
const replace = require('gulp-replace');

const THEMES_STYLES_CONF = {
  STYLES_SRC: './projects/ontimize-web-ngx/src/lib/theming/styles/**/*.scss',
  STYLES_TMP: './tmp/theming/styles',
  TMP_SRC: './tmp/theming/themes/*.scss',
  DIST: './dist/theming/themes',
  OPTIONS: {
    matchPattern: "!node_modules/@angular/material/theming*"
  },
  MATERIAL_IMPORT: '@import \'node_modules/@angular/material/theming\';'
};

gulp.task('copy.themes.files', (callback) => {
  copyfiles(['projects/ontimize-web-ngx/src/lib/theming/themes/*.scss', 'tmp/theming'],5, callback);
});

gulp.task('delete.angular.imports', () => {
  return gulp.src([THEMES_STYLES_CONF.STYLES_SRC])
    .pipe(replace(THEMES_STYLES_CONF.MATERIAL_IMPORT, ''))
    .pipe(gulp.dest(THEMES_STYLES_CONF.STYLES_TMP));
});

gulp.task('copy.styles.files', (callback) => {
  copyfiles(['projects/ontimize-web-ngx/src/lib/theming/styles/**/*.scss', 'dist/theming'], 5, callback);
});

gulp.task('concat.themes', (callback) => {
  return gulp.src(THEMES_STYLES_CONF.TMP_SRC)
    .pipe(cssimport(THEMES_STYLES_CONF.OPTIONS))
    .pipe(gulp.dest(THEMES_STYLES_CONF.DIST));
});

gulp.task('concat.themes.scss', gulp.series('copy.themes.files', 'delete.angular.imports', 'copy.styles.files', 'concat.themes'));
const FILES = [
  'projects/ontimize-web-ngx/src/lib/theming/ontimize-theme.scss',
  'projects/ontimize-web-ngx/src/lib/theming/ontimize-theme-lite.scss',
  'projects/ontimize-web-ngx/src/lib/theming/ontimize-theme-flat.scss',
  'projects/ontimize-web-ngx/src/lib/theming/implatform-fashion-theme.scss',
  'projects/ontimize-web-ngx/src/lib/theming/ontimize.scss',
  'dist/theming/'
];

gulp.task('copy-files-internal', (callback) => {
  copyfiles(FILES, true, callback);
});

gulp.task('copy-files', gulp.series('copy-files-internal', 'concat.themes.scss'));