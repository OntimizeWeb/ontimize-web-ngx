## 1.2.1

### Features
* **o-form**: Adding attribute '*layout-fill*'.
* **o-form**: Adding attribute '*stay-in-record-after-edit*' ([#65](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/65)) ([600437f](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/600437f))
* **o-table**: updating '*static-data*' when '*insert-table*' is true([#64](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/64)) ([c98709c](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/c98709c))

### PEER-DEPENDENCY UPDATES ###

### BREAKING CHANGES

### Bug Fixes
* **o-table**: Using parent-keys (inside md-tab) ([#62](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/62)) ([5eb088d](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/5eb088d))
* **o-form**: Updating styles for adapting to container height.
* **o-table editors**: Fixing variable bugs.
* **o-table**: Fixing input '*static-data*' update ([#63](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/63)) ([c98709c](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/c98709c))

## 1.2.0 (2017-03-16)

### Features
* **o-list**: adding remote pagination ([#40](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/40)) ([8fbbb73](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/8fbbb73))
* **o-list**: adding *'detail-mode'* attribute for choosing which action (*'click'*, *'dblclick'* or *'none'*) will navigate to detail form.
* **o-list**: adding *'recursive-detail'*, *'detail-form-route'*, *'detail-button-in-row'*, *'detail-button-in-row-icon'* attributes for managing detail mode access.
* **o-list**: adding *'recursive-edit'*, *'edit-form-route'*, *'edit-button-in-row'*, *'edit-button-in-row-icon'* attributes for managing edition mode access.
* **o-list-item**: updating item rendering for allowing to add detail or/and edit button.
* **o-list-item.directive**: adding dblclick event handler.
* **o-list**: adding default item for empty list.
* **input components**: new parameter *'tooltip'* for specifying tip display on input components.
* **o-list**: adding *'selectable'* attribute ([#41](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/41)) ([719042c](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/719042c))
* **o-list-item**: updating item rendering for allowing to add a checkbox for selectable state.
* **local-storage.service**: adding service for storing components state in navigator local storage.
* **Interfaces**: adding *'ILocalStorageComponent'* for components using *'local-storage.service'*.
* **o-list**: adding *'delete-method'* attribute and delete button when list is selectable.
* **o-list**: adding *'insert-button'* and *'dense'* attributes.
* **o-list**: adding *'row-height'* attribute.
* **o-list**: adding list item predefined renderers *'o-list-item-avatar'*, *'o-list-item-text'*, *'o-list-item-card'*, *'o-list-item-card-image'* ([#25](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/25)) ([9b559a3](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/9b559a3))
* **o-table**: adding *'pagination-controls'* attribute ([#44](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/44)) ([b69f69a](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/b69f69a))
* **o-table-column**: adding *'width'* attribute ([#48](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/48)) ([7ee86dd](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/7ee86dd))
* **o-table-cell-renderer-action**: adding *'onClick'* output ([#54](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/54)) ([7fc0ded](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/7fc0ded))
* **o-table-cell-renderer-image**: adding *'onClick'* output.
* **o-table-cell-renderer-action**: adding default width if *'render-type'* is *'icon'* ([#53](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/53)) ([2bedc7e](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/2bedc7e))
* **service components**: adding *'service-type'* attribute to configurable service components for setting a custom service.
* **o-table-cell-renderer-action**: adding *'action-title'* attribute ([#58](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/58)) ([c9fc19a](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/c9fc19a))
* **input components**: adding *'onFocus'* and *'onBlur'* outputs ([#56](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/56)) ([978fdaf](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/978fdaf)).
* **o-table**: adding *'selectRowsByData'* and *'setSelectAllCheckboxValue'* methods.
* **configuration** : adding *'startSessionPath'* property.
* **o-form** : adding *'query-method'*, *'delete-method'*, *'update-method'* and *'insert-method'* attributes.
* **o-table-column** : adding *'getRowData'* method.
* **o-table** : adding *'getRowDataFromColumn'* method.

### PEER-DEPENDENCY UPDATES ###
* **Updated**:   @angular/material@2.0.0-beta.1
* **Updated**:   @angular@2.4.2
* **Updated**:   @angular/router@3.4.2
* **Updated**:   rxjs@5.0.1
* **Updated**:   zone.js@0.7.4
* **Updated**:   moment@2.17.1
* **Updated**:   ng2-translate@5.0.0

### BREAKING CHANGES
* **Interfaces**: The interface *'IFormComponent'* was renamded to *'IComponent'*.
* **Components**: Several components have changed its constructor.
* **o-selectable-list**: Deleted component (use *'selectable'* attribute in o-list instead).
* **o-md-selectable-list-item**: Deleted directive (use *'selectable'* attribute in o-list instead).
* **o-selectable-list-item**: Deleted component (use *'selectable'* attribute in o-list instead).
* **o-list**: *'onReload'* method changed (marked as deprecated) for *'reloadData'*.
* **o-table**: *'onReload'* method changed (marked as deprecated) for *'reloadData'*.
* **o-table**: *'data'* attribute changed for *'static-data'*.
* **o-table-button**: *'click'* output changed for *'onClick'*.
* **o-table-option**: *'click'* output changed for *'onClick'*.

### Bug Fixes
* **o-html-input**: Fixing component bugs ([#32](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/32)) ([3d2d121](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/3d2d121))
* **o-table**: Fixing options documents generation bugs.
* **o-table-column**: Fixing bugs in width attribute ([#53](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/53)) ([2bedc7e](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/2bedc7e))
* **o-table**: fixing selection bugs ([#51](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/51)) ([d617194](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/d617194))

* **o-form**: Fixing routing bugs.

## 1.1.1 (2017-01-11)

### Features
* **o-table**: adding remote pagination ([#22](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/22)) ([6593db8](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/6593db8))
* **o-table-option**: adding icon position parameter ([1c65a80](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/1c65a80))
* **ontimize.service**: adding advancedQuery method.
* **o-list-picker**: adding new parameter (static-data) ([1d0f2cc](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/1d0f2cc))

### Bug Fixes
* **minor bugs**: Fixing minor bugs in components.

## 1.1.0 (2016-11-24)

### Features
* **angular2:** update to official version 2.1.2
* **angular/material:** v2.0.0-alpha.10 ([#1](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/1))
* **container components:** New container components: *'o-row'* and *'o-column'*. ([c055f59](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/c055f59))
* **o-list:** enhancements on *'o-list'* component ([8fe285a](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/8fe285a))
* **creating pipes**: adding *'o-integer.pipe'* and *'o-real.pipe'* to *'o-integer-input'*, *'o-real-input'*, *'o-currency-input'* and *'o-percent-input'* ([#23](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/23)) ([cc74967](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/cc74967))

### PEER-DEPENDENCY UPDATES ###
* **Removed**: angular2-material@v2.0.0-alpha.8-2
* **Added**:   angular/material@v2.0.0-alpha.10

### BREAKING CHANGES
* **tabs components:** see new definition mode ([2.0.0-alpha.10 mithril-hoverboard](https://github.com/angular/material2/blob/master/CHANGELOG.md#breaking-changes))
* **o-table:** show-header-buttons-text attribute changed to show-table-buttons-text ([fc96884](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/fc96884))
* **o-table-button:** text attribute changed to label ([fc96884](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/fc96884))
* **o-table-option:** text attribute changed to label ([fc96884](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/fc96884))

### Bug Fixes
* **i18n:** Fixing core translations. ([ecb38ca](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/ecb38ca)) ([796f613](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/796f613))
* **o-form:** Fixing minor bugs. ([ecb38ca](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/ecb38ca))
* **disable state:** Fixing errors when setting *'disabled'* state on input components. ([bd04120](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/bd04120))
* **o-image:** Fixing errors ([2c12065](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/2c12065))


## 1.0.2 (2016-11-07)

### Bug Fixes
* **i18n:** Fixing configuration path for i18n files. ([47aaeff](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/47aaeff))
* **Table:** Fixing columns width calculation ([f19e19e](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/f19e19e))
* **Table:** Fixing columns visibility options ([f19e19e](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/f19e19e))
* **Table:** Fixing columns definition ([f19e19e](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/f19e19e))
* **Table:** Fixing form reference bug ([f19e19e](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/f19e19e))

## 1.0.1 (2016-11-03)

### Features
* **o-table-cell-renderer-action:** Allowing to set edition type using *'editionMode'* (inline or not)
* **Table:** Set parent-key values on detail form ([#9](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/9)) ([7967481](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/7967481))
* **Table:** Material style ([#4](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/4))
* **Table:** Customizing options: rows height, options, buttons and header visibility.
* **Form:** Change styling of form buttons panel ([#18](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/18)) ([5ebe4ba](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/5ebe4ba))
* **Form:** Adding custom buttons to form buttons panel ([#19](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/19)) ([6cf8f37](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/6cf8f37))
* **Menu:** Implementing *'locale-item'* on *'o-side-menu'* ([#21](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/21)) ([82166a5](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/82166a5))

### Bug Fixes
* **Table:**  Configuration parameter for navigate detail mode ([#3](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/3)) ([cb9821d](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/cb9821d))
* **Menu:** "o-bar-menu" is not hidden when navigating ([#16](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/16)) ([9e38304](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/9e38304))
* **Menu:** "o-bar-menu" responsive menu icon ([#17](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/17)) ([9e38304](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/9e38304))
* **Currency-input:** allowing negative values ([04c53ab](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/04c53ab))


## 1.0.0-rc.1 (2016-10-21)

### Features

* **Components:** it is no longer necessary to set *'data'* attribute parameter on form data components, the form will set values automatically.
- Example:
  * Before: `<o-text-input attr="NAME" flex  [data]="oForm.getDataValue('NAME')"></o-text-input>`
  * After: `<o-text-input attr="NAME" flex  ></o-text-input>`
* **Components:** new parameter *'automatic-binding'* for specifying custom data value on form data components.
- Example:
  `<o-text-input attr="NAME" flex automatic-binding="yes" [data]="myCustomFn()" ></o-text-input>`

### Bug Fixes

* **Form:** refresh does not work from all tabs  ([#10](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/10)) ([811e642](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/811e642))
* **HTMLInput:** component is editable in a detial form  ([#11](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/11)) ([65bdcb8](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/65bdcb8))
* **Combo:** selected value is lost when move between tabs  ([#13](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/13)) ([b6b7151](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/b6b7151))
* **Styling:** validation errors styling fixings  ([#14](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/14)) ([fe1e144](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/fe1e144))
* **BarMenu:** tooltip translation  ([#15](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/15)) ([1f5dea6](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/1f5dea6))

## 1.0.0-rc.0 (2016-09-30)

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
* **services** IDataService interface change the *'entity'* argument position in CRUD methods (query, insert, delete, update).
  Now it is not always necessary to pass *'entity'* argument, simply configure it once in service.
- Example:
  * Before: `query('ECustomers', filter, columns)`
  * After: `query(filter, columns, 'ECustomers')`



## 0.0.4 (2016-08-24)

### Features

* **angular2:** update to release candidate 5.
* **angular2 router:** update to 3.0.0-rc.1.
* **angular2 forms:** update to 0.3.0.
* **angular2-material:** update to v2.0.0-alpha.7-3.


## 0.0.3 (2016-08-02)

### Features

* **angular2:** update to release candidate 4.
* **angular2 router:** update to 3.0.0-beta.2.
* **angular2-material:** update to v2.0.0-alpha.6.


## 0.0.2 (2016-04-08)

### Features

* **angular2:** update to beta 13 (adapt code to version changes).


## 0.0.1 (2016-04-06)

### Features

* **build:** first commit


