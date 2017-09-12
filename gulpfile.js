const gulp = require('gulp');
const sass = require('node-sass');
const inlineTemplates = require('gulp-inline-ng2-template');
const exec = require('child_process').exec;
const htmlMinifier = require("html-minifier");/*!!!!*/
const copyfiles = require('copyfiles');
const cssimport = require("gulp-cssimport");
const replace = require('gulp-replace');



const ONTIMIZE_SCSS_CONF = {
  SRC: './ontimize.scss',
  DIST: './dist'
};

gulp.task('ontimize.styles', ['themes.styles'], (callback) => {
  return gulp.src(ONTIMIZE_SCSS_CONF.SRC)
    .pipe(cssimport(THEMES_STYLES_CONF.OPTIONS))
    .pipe(gulp.dest(ONTIMIZE_SCSS_CONF.DIST));
});


const THEMES_STYLES_CONF = {
  SRC: './ontimize/components/theming/all-theme.scss',
  DIST_TMP: './tmp',
  DIST_TMP_FILENAME: './tmp/all-theme.scss',
  DIST: './dist/ontimize/components/theming',
  OPTIONS: {
    matchPattern: "!node_modules/@angular/material/theming*"
  },
  MATERIAL_IMPORT: '@import \'node_modules/@angular/material/theming\';'
};

gulp.task('themes.styles', ['concat.themes.scss'], function () {
  gulp.src([THEMES_STYLES_CONF.DIST_TMP_FILENAME])
    .pipe(replace(THEMES_STYLES_CONF.MATERIAL_IMPORT, ''))
    .pipe(gulp.dest(THEMES_STYLES_CONF.DIST));
});

gulp.task('concat.themes.scss', (callback) => {
  return gulp.src(THEMES_STYLES_CONF.SRC)
    .pipe(cssimport(THEMES_STYLES_CONF.OPTIONS))
    .pipe(gulp.dest(THEMES_STYLES_CONF.DIST_TMP));
});


const FILES = [
  'CHANGELOG.md',
  'LICENSE',
  'README.md',
  'package.json',
  'ontimize.scss',
  '.npmignore',
  'dist'
];

const DIST_ONTIMIZE_COMPS = 'dist/ontimize/components/';

gulp.task('copy-files', ['copy-table-files', 'copy-themes-files'], (callback) => {
  copyfiles(FILES, true, callback);
});

gulp.task('copy-table-files', (callback) => {
  copyfiles(['ontimize/components/table/vendor/**/*', DIST_ONTIMIZE_COMPS], 2, callback);
});

gulp.task('copy-themes-files', (callback) => {
  copyfiles([
    'ontimize/components/theming/deeppurple-amber.scss',
    'ontimize/components/theming/indigo-pink.scss',
    'ontimize/components/theming/pink-bluegrey.scss',
    'ontimize/components/theming/purple-green.scss',
    'dist/ontimize'
  ], 1, callback);
});

/**
 * Inline templates configuration.
 * @see  https://github.com/ludohenin/gulp-inline-ng2-template
 */
const INLINE_TEMPLATES_CONF = {
  SRC: ['./**/*.ts', '!./tmp/**/*', '!./node_modules/**/*', '!./custom-typings.d.ts'],
  DIST: './tmp',
  CONFIG: {
    base: '.',
    target: 'es6',
    useRelativePaths: true,
    styleProcessor: compileSass
  }
};

/**
 * Inline external HTML and SCSS templates into Angular component files.
 * @see: https://github.com/ludohenin/gulp-inline-ng2-template
 */
gulp.task('inline-templates', () => {
  return gulp.src(INLINE_TEMPLATES_CONF.SRC)
    .pipe(inlineTemplates(INLINE_TEMPLATES_CONF.CONFIG))
    .pipe(gulp.dest(INLINE_TEMPLATES_CONF.DIST));
});

/**
 * Compile SASS to CSS.
 * @see https://github.com/ludohenin/gulp-inline-ng2-template
 * @see https://github.com/sass/node-sass
 */
function compileSass(path, ext, file, callback) {
  let compiledCss = sass.renderSync({
    file: path,
    outputStyle: 'compressed',
  });
  callback(null, compiledCss.css);
}
