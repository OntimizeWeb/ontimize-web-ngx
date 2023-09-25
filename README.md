[![Build CI](https://github.com/OntimizeWeb/ontimize-web-ngx/actions/workflows/build-ci.yml/badge.svg)](https://github.com/OntimizeWeb/ontimize-web-ngx/actions/workflows/build-ci.yml)
[![Sonar](https://github.com/OntimizeWeb/ontimize-web-ngx/actions/workflows/sonar.yml/badge.svg)](https://github.com/OntimizeWeb/ontimize-web-ngx/actions/workflows/sonar.yml)

<h1 align="center">
  <div style="display:inline-block;vertical-align: middle;">
    <a name="logo" href="https://ontimizeweb.github.io/docs/v15/">
      Ontimize Web
    </a>
  </div>
</h1>

<p align="center">
  <a href="#-introduction">Introduction</a> •
  <a href="#zap-getting-started">Getting started</a> •
  <a href="#-ideas">Ideas</a> •
  <a href="#gear-development">Development</a> •
  <a href="#eyes-versions-and-dependencies">Versions and dependencies</a>
</p>

## 📜 Introduction

Ontimize Web is web application framework that provides to you an environment for solving the problematic situation of building aplications that require a browser-based user interface. Ontimize Web allows developing data management applications quickly and agile.

Ontimize Web is based on the [15.x version of Angular](https://v15.angular.io/docs), and comes with many significant performance, usability, and feature improvements.

### 📖 Documentation

Check out our [documentation site](https://ontimizeweb.github.io/docs/) to know more details.

## :zap: Getting started

Follow the [Getting Started](https://ontimizeweb.github.io/docs/v15/doc-overview/) documentation section to get started quickly.
There is a practical [Quickstart Application](https://github.com/OntimizeWeb/ontimize-web-ngx-quickstart), a perfect starting point for building your own Ontimize Web app.

### Ontimize Web Examples

View all the examples in action at [Ontimize Web](https://try.imatia.com/ontimizeweb/).

## 💡 Ideas

We would love any feedback you have or to know when you encounter issues, by filing an issue report on this repo.


## :gear: Development

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.9.

### Installation

Follow the next steps:

  - cd repository root
```bash
npm install
```
  - cd projects/ontimize-web-ngx
```bash
npm install
```

### Build

We have a script to build the library.

`npm run build`

It will create the distribution folder, copy the styles and pack this to use it as a npm package in a .tgz file but you can run those tasks separately.

The script `build` executes the following commands:

    - ng build
    - scss-bundle -c scss-bundle-ontimize.config.json (Bundles all scss linked files in one file that will be the one we import in our project)
    - scss-bundle -p scss-bundle-theme.config.json (With this 2 tasks we will be able to use variables, mixins, keyframes ... in our project)
    - copyfiles -u 3 ./projects/ontimize-web-ngx/assets/svg/ontimize-icon-set.svg ./dist/ontimize-web-ngx/assets (Copy the assets folder to distribution folder)
    - cd dist/ontimize-web-ngx && npm pack (From the distribution folder we create a .tgz file to import in our project)


## :eyes: Versions and dependencies

Each version of the Addons is compatible with a version of the framework, you can check the dependencies between Angular, Ontimize web and Addons [here](https://ontimizeweb.github.io/docs/v15/versions/).
