# Ontimize Web

Ontimize Web is web application framework that provides to you an environment for solving the problematic situation of building aplications that require a browser-based user interface. Ontimize Web allows developing data management applications quickly and agile.

Ontimize Web is based on the [8.x version of Angular](https://v8.angular.io/docs), and comes with many significant performance, usability, and feature improvements.


### Try Ontimize Web

To try Ontimize Web today, visit the [Ontimize Web Docs](https://ontimizeweb.github.io/docs/). We would love any feedback you have or to know when you encounter issues, by filing an issue report on this repo.


### Ontimize Web Examples

View all the examples in action at [Ontimize Web](https://try.imatia.com/ontimizeweb/).

### Ontimize Web Getting Started

There is a practical [Getting Started](https://github.com/OntimizeWeb/ontimize-web-ngx-quickstart), a perfect starting point for building your own Ontimize Web app.

### Versions and dependencies
Each version of the Addons is compatible with a version of the framework, you can check the dependencies between Angular, Ontimize web and Addons [here](https://ontimizeweb.github.io/docs/versions/).



## Development

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.21.

### Installation

Follow the next steps:

    - npm install
    - cd projects/ontimize-web-ngx
    - npm install

### Build

We have to scripts to build the application. One of them is for production and the other is for development.

#### Production

`npm run prodbuild`

It will create the distribution folder, copy the styles and copy the assets.

The script `prodbuild` executes the following commands:

    - ng build
    - scss-bundle -p scss-bundle-ontimize.config.json (Bundles all scss linked files in one file that will be the one we import in our project)
    - scss-bundle -p scss-bundle-theme.config.json (With this 2 tasks we will be able to use variables, mixins, keyframes ... in our project)
    - copyfiles -u 3 ./projects/ontimize-web-ngx/assets/svg/ontimize-icon-set.svg ./dist/ontimize-web-ngx/assets (Copy the assets folder to distribution folder)

#### Development

`npm run build`

It will create the distribution folder, copy the styles and pack this to use it as a npm package in a .tgz file but you can run those tasks separately.

The script `build` executes the following commands:

    - ng build
    - scss-bundle -p scss-bundle-ontimize.config.json (Bundles all scss linked files in one file that will be the one we import in our project)
    - scss-bundle -p scss-bundle-theme.config.json (With this 2 tasks we will be able to use variables, mixins, keyframes ... in our project)
    - copyfiles -u 3 ./projects/ontimize-web-ngx/assets/svg/ontimize-icon-set.svg ./dist/ontimize-web-ngx/assets (Copy the assets folder to distribution folder)
    - cd dist/ontimize-web-ngx && npm pack (From the distribution folder we create a .tgz file to import in our project)

We are working on solve those warning messages that appear on building the library.
