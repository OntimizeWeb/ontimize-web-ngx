<a name="1.0.0"></a>
## 1.0.0 (2016-09-30)

### Features
* **angular2:** update to official version 2.0.0
* **angular2 router:** update to 3.0.0-rc.2.
* **angular2 forms:** update to 2.0.0.
* **angular2-material:** update to v2.0.0-alpha.8-2.
* **services**: services of data components now must implement IDataService interface. (see Breaking changes)
* **services**: services configuration parameters (SERVICE_CONF) now is easier to configure.

### PEER-DEPENDENCY UPDATES ###

* **Updated**: zone.js@0.6.23
* **Updated**: rxjs@5.0.0-beta.12
* **Updated**: systemjs@0.19.38
* **Updated**: ng2-translate@2.5.0
* **Removed**: es6-module-loader@0.17.11
* **Removed**: es6-promise@3.2.1
* **Removed**: es6-shim@0.35.1
* **Added**:   core-js@2.4.1


### BREAKING CHANGES

* **configuration** application configuration parameters (app.config) perform camelCase standard.
* **services** IDataService interface change the 'entity' argument position in CRUD methods (query, insert, delete, update).
  Now it is not always necessary to pass 'entity' argument, simply configure it once in service.
- Example:
  * Before: `query('ECustomers', filter, columns)`
  * After: `query(filter, columns, 'ECustomers')`



<a name="0.0.4"></a>
## 0.0.4 (2016-08-24)


### Features

* **angular2:** update to release candidate 5.
* **angular2 router:** update to 3.0.0-rc.1.
* **angular2 forms:** update to 0.3.0.
* **angular2-material:** update to v2.0.0-alpha.7-3.

<a name="0.0.3"></a>
## 0.0.3 (2016-08-02)


### Features

* **angular2:** update to release candidate 4.
* **angular2 router:** update to 3.0.0-beta.2.
* **angular2-material:** update to v2.0.0-alpha.6.

<a name="0.0.2"></a>
## 0.0.2 (2016-04-08)


### Features

* **angular2:** update to beta 13 (adapt code to version changes).

<a name="0.0.1"></a>
## 0.0.1 (2016-04-06)


### Features

* **build:** first commit


