"use strict";

const shell = require('shelljs');
const chalk = require('chalk');

const PACKAGE = `ontimize-web-ngx`;
const NPM_DIR = `dist`;
const TMP_DIR = `tmp`;
const ESM2015_DIR = `${NPM_DIR}/esm2015`;
const ESM5_DIR = `${NPM_DIR}/esm5`;
const BUNDLES_DIR = `${NPM_DIR}/bundles`;
const OUT_DIR_ESM5 = `${NPM_DIR}/package/esm5`;

shell.echo(`Start building...`);

shell.rm(`-Rf`, `${NPM_DIR}/*`);
shell.rm(`-Rf`, `${TMP_DIR}/*`);
shell.mkdir(`-p`, `./${ESM2015_DIR}`);
shell.mkdir(`-p`, `./${ESM5_DIR}`);
shell.mkdir(`-p`, `./${BUNDLES_DIR}`);

/* TSLint with Codelyzer */
// https://github.com/palantir/tslint/blob/master/src/configs/recommended.ts
// https://github.com/mgechev/codelyzer
shell.echo(`Start TSLint`);
shell.exec(`tslint -p tslint.json -t stylish ontimize/**/*.ts`);
shell.echo(chalk.green(`TSLint completed`));


/* Inline templates: init-common */
shell.echo(`Start inline templates parsing`);
shell.exec(`gulp inline-templates`);
shell.echo(chalk.green(`Inline templates completed`));

/* AoT compilation */
shell.echo(`Start AoT compilation`);
if (shell.exec(`ngc -p tsconfig.aot.json`).code !== 0) {
  shell.echo(chalk.red(`Error: AoT compilation failed`));
  shell.exit(1);
}
shell.echo(chalk.green(`AoT compilation completed`));

/* BUNDLING PACKAGE */
shell.echo(`Start bundling`);
shell.echo(`Rollup package`);
if (shell.exec(`rollup -c rollup.es.config.js -i ${NPM_DIR}/index.js -o ${ESM2015_DIR}/${PACKAGE}.js`).code !== 0) {
  shell.echo(chalk.red(`Error: Rollup package failed`));
  shell.exit(1);
}
shell.echo(chalk.green(`Rollup package completed`));

shell.echo(`Produce ESM5 version`);
shell.exec(`ngc -p tsconfig.build.json --target es5 -d false --outDir ${OUT_DIR_ESM5} --importHelpers true --sourceMap`);
if (shell.exec(`rollup -c rollup.es.config.js -i ${OUT_DIR_ESM5}/${PACKAGE}.js -o ${ESM5_DIR}/${PACKAGE}.js`).code !== 0) {
  shell.echo(chalk.red(`Error: ESM5 version failed`));
  shell.exit(1);
}
shell.echo(chalk.green(`Produce ESM5 version completed`));

shell.echo(`Run Rollup conversion on package`);
if (shell.exec(`rollup -c rollup.config.js -i ${ESM5_DIR}/${PACKAGE}.js -o ${BUNDLES_DIR}/${PACKAGE}.umd.js`).code !== 0) {
  shell.echo(chalk.red(`Error: Rollup conversion failed`));
  shell.exit(1);
}
shell.echo(chalk.green(`Run Rollup conversion on package completed`));

shell.echo(`Minifying`);
shell.cd(`${BUNDLES_DIR}`);
shell.exec(`uglifyjs ${PACKAGE}.umd.js -c --comments -o ${PACKAGE}.umd.min.js --source-map "filename='${PACKAGE}.umd.min.js.map', includeSources"`);
shell.echo(chalk.green(`Minifying completed`));
shell.cd(`..`);
shell.cd(`..`);

shell.echo(chalk.green(`Bundling completed`));

shell.rm(`-Rf`, `${NPM_DIR}/package`);
shell.rm(`-Rf`, `${NPM_DIR}/node_modules`);
// shell.rm(`-Rf`, `${NPM_DIR}/*.js`);
// shell.rm(`-Rf`, `${NPM_DIR}/*.js.map`);
// shell.rm(`-Rf`, `${NPM_DIR}/ontimize/**/*.js`);
// shell.rm(`-Rf`, `${NPM_DIR}/ontimize/**/*.js.map`);

/* end-common */
shell.echo(`Start copy-files`);
shell.exec(`gulp copy-files`);
shell.echo(chalk.green(`copy-files completed`));

shell.echo(`Start styles`);
shell.exec(`gulp ontimize.styles`);
shell.exec(`node-sass dist/ontimize.scss dist/ontimize.scss --output-style compressed`);
shell.echo(chalk.green(`Styles completed`));

// // shell.sed('-i', `"private": true,`, `"private": false,`, `./${NPM_DIR}/package.json`);

shell.echo(chalk.green(`End building`));