# OntimizeWebNgx

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.21.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm run build` to build the library. It will create the distribution folder, copy the styles and pack this to use it as a npm package in a .tgz file but you can run those tasks separately. 

The npm script `build` executes the following commands:

    - ng build
    - scss-bundle -p scss-bundle-ontimize.config.json (Bundles all scss linked files in one file that will be the one we import in our project)
    - scss-bundle -p scss-bundle-theme.config.json (With this 2 tasks we will be able to use variables, mixins, keyframes ... in our project)
    - copyfiles -u 3 ./projects/ontimize-web-ngx/assets/svg/ontimize-icon-set.svg ./dist/ontimize-web-ngx/assets (Copy the assets folder to distribution folder)
    - cd dist/ontimize-web-ngx && npm pack (From the distribution folder we create a .tgz file to import in our project)

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
