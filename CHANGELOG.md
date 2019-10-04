## 4.0.7 (2019-10-04)
### Features
* New components **o-form-layout-dialog-options** and **o-form-layout-tabgroup-options** ([2ad8ae1](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/2ad8ae1))
* **o-button**: new `svg-icon` input ([404ae8f](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/404ae8f))
* **OServiceComponent**: ([660a57b9](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/660a57b9)) ([0b24c82b](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/0b24c82b))
  * new `filter-case-sensitive` input (removed from `o-list` and `o-table`) 
  * new `quick-filter` input (removed from `o-grid`, `o-table`  and `o-list`) 
  * new `showCaseSensitiveCheckbox`, `getComponentFilter` and `registerQuickFilter` methods
* **o-list**: 
  * new `insert-button-position` input ([f5ae203](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f5ae203)) Closes [#282](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/282)
  * new `insert-button-floatable` input ([f96b5d4](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f96b5d4)) 
* **o-table**: 
  * new `keep-selected-items` input ([29de43b9](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/29de43b9))
  * new `export-mode` input and `getAllRenderedValues` method([5a90d2d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/5a90d2d))

* **o-list-picker**: show or hidde clear button ([bb3b6eb](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/bb3b6eb))
* **ODialogComponent**:  allow to show html text ([783427c](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/783427c))

### Bug Fixes
* **o-table-cell-renderer-service**:not render cell value when export data table ([a594521](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/a594521))
* **o-grid**: not filter by checked columns  ([29f5036](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/29f5036)) Closes [#283](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/283)
* **o-table**: 
  * adding new columns to my tables they are being hidden by default. ([42e5ccf](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/42e5ccf)) Closes [#284](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/284)
  * Dialog for show/hide columns associated to a oTable has not visible scroll bar ([bfbe85e](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/bfbe85e)) Closes [#287](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/287)
  * ([2f0a4f6](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/2f0a4f6)) ([593b7cb](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/593b7cb)) Closes [#285](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/285)
* **o-checkbox**:  checking not work with no boolean values ([f871ac7d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f871ac7d)) Closes [#286](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/286)
* **containers**: fixed container when it is initialized with the attribute expanded=false ([347330b](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/347330b)) Closes [#288](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/288)

## 4.0.6 (2019-06-19)
### Features
* **FilterExpressionUtils**: added operator `IN` and method `buildExpressionIn` ([fcc0003](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/fcc0003))
* New component `o-daterange-input` ([7c48c09](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/7c48c09))
* **Modules**: Exporting '*ONTIMIZE_MODULES_WITHOUT_ANIMATIONS*' array of common modules that should be imported in app module if you *don`t need animations*.
* Added translations in portuges ([da648cb](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/da648cb))
* **o-hour-input, o-table-cell-editor-time**:Fix translation in text button ([d842fbd](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/d842fbd)) ([17f5ca3](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/17f5ca3))

## 4.0.5 (2019-06-05)
### Features
* **o-list-picker**: new `dialog-class` input ([321fd4b](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/321fd4b))
* **o-table**: new cell render `o-table-cell-renderer-time` and cell editor `o-table-cell-editor-time` ([399cdbc](https://github.com/OntimizeWeb/ontimize-web-ngx/
* **o-form**: new `confirm-exit` input ([01d0d29]](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/01d0d29]))
* **IFormValueOptions**: adding new `emitModelToViewValueChange` property ([4d11cd8]](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/4d11cd8]))

## 4.0.4 (2019-05-22)
### Features
* **OFormControl**: adding class `OFormControl` ([7a9cef6](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/7a9cef6))
* **o-table-columns-filter**: new `mode` attribute ([1b5d8ee](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/1b5d8ee))
* **o-table**: now the table distinguish text and numeric columns when filtering its data through the quick filter component. It also allow filering using *service cell renderer* values ([7fba4b9](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/7fba4b9))
* **OSnackBarConfig**: new `cssClass` attribute ([eaa601b](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/eaa601b))
* **o-form-layout-tabgroup**: new `onSelectedTabChange` and `onCloseTab` outputs ([29f73a0](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/29f73a0))

### Bug Fixes
* **o-list-picker**: fixed no columns selected error ([978d7cd](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/978d7cd))
* **o-service-base-component**: fixing storage bugs [#251](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/251) sort by numeric column ([2a59669](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/2a59669))
* **o-table-insertable-row**: fixed that the insert row in the table is not shown [#261](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/261)([f346f1f](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f346f1f)) ([3dce76f](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/3dce76f)) ([3dce76f4b837af](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f4b837a))
* **o-time-input**: internal date build from date and hour inputs fixed ([bb88e9a](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/bb88e9a)) Closes [#267](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/267)
* **o-list-picker**: new `dialog-disable-close` input ([b4bc292](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/b4bc292))

### BREAKING CHANGES
* **o-hour-input**: method `getValueAsTimeStamp` has been removed, the method `getValue` returns the input value in the format indicated by the attribute `value-type`

## 4.0.3 (2019-04-24)
### Features
* **o-combo**: new `searchable` input ([2ae599d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/2ae599d))
* **o-table**: new cell renderer `o-table-cell-renderer-translate` ([2763c47](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/2763c47)).

### Bug Fixes
* **o-context-menu**: remove overlay when context menu is removed ([a2bf383](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/a2bf383))

## 4.0.2 (2019-04-04)
### Features
* **o-form**:
  * new `header-position` input ([63f0f36](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/63f0f36))
  * new outputs `onInsert`, `onUpdate` and `onDelete` ([85992e6](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/85992e6))
* **OContainerCollapsibleComponent**:
  * new `collapsed-height` and  `expanded-height` input ([6dbbd95](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/6dbbd95))
* **o-list-picker**: new `onDialogAccept` and `onDialogCancel` outputs ([fd0247d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/fd0247d))
* **OFormServiceComponent**: new `onDataLoaded` output ([3d0cf70](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/3d0cf70))
* **o-table**: new `enabled` attribute ([5d48cef](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/5d48cef)).
* **MenuGroup, MenuItem**: new `class` attribute  ([6a4c500](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/6a4c500))
* **o-form-navigation**: allowing to navigate through paginated components (`OServiceComponent`) details ([286ba71](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/286ba71))
* **o-image**: new `accept-file-type` input ([cd61beb](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/cd61beb))
* **o-form-data**: new `hide-required-marker` and `label-visible` inputs ([d39db97](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/d39db97))
* **o-time-input**: new `hour-placeholder` and `date-placeholder` inputs ([48d3b9c](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/48d3b9c))
* **o-form-layout-manager**: updating main content when updating, deleting or inserting new data ([20adc1d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/20adc1d)) ([050da7c](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/050da7c))
* **o-table-cell-renderer-service**: listening to editor changes for updating the renderer ([cf56430](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/cf56430)) ([d596c5d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/d596c5d))
* **OFormServiceComponent**: new `onDataLoaded` output ([3d0cf70](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/3d0cf70))
* **o-form-data**: new `hide-required-marker` and `label-visible` inputs ([d39db97](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/d39db97)) ([a7d0e8d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/a7d0e8d)) ([5fb5509](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/5fb5509))
* **o-time-input**: new `hour-placeholder` and `date-placeholder` inputs ([48d3b9c](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/48d3b9c))

### Bug Fixes
* **o-table**: fixed error on table store configuration dialog ([ad6c84b](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/ad6c84b)), closes [#256](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/256)
* **o-grid**: sort by numeric column ([2b38fb5](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/2b38fb5)), closes [#253](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/253)
* **o-time-input**: impossible to select a different date of 01/01/1970  ([48d3b9c](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/48d3b9c)), closes [#255](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/255)

## 4.0.1 (2019-03-06)
### Features
* **o-form**:
  * new `include-breadcrumb` input ([80d9ddc](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/80d9ddc))
  * new `detect-changes-on-blur` input ([d891359](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/d891359)) ([216d9ff](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/216d9ff))
* **o-form-layout-manager**: new attributes `dialog-class`, `dialog-width`, `dialog-min-width`, `dialog-max-width`, `dialog-height`, `dialog-min-height`, `dialog-max-height` ([d891359](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/d891359)) ([216d9ff](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/216d9ff))
* **AppConfig**: Adding properties for allowing remote configuration storage.
* **o-list**: new `sort-columns`and `filter-case-sensitive` inputs ([b8bf534](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/b8bf534))
* **o-search-input**: new `appearance`, `columns`, `filter-case-sensitive`, `show-case-sensitive-checkbox` and `show-menu` inputs ([eab96f6](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/eab96f6))
* **o-button**: new button variants, *STROKED*,*BASIC*, *ICON*,*FAB* and *MINI-FAB* ([df76383](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/df76383]))([cf12fcb](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/cf12fcb]))
* New directive **oHidden** used for hiding components ([fe54972](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/fe54972))

### BREAKING CHANGES
* **o-button**:
  * Type `FLOATING` has been renamed to `FAB`.

## 4.0.0 (2018-02-19)
### Features
* **o-form-data-component**: new `tooltip-hide-delay` input ([18733ef](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/18733ef]))
* New classes  **layout-padding-vertical**,**layout-padding-horizontal**,**layout-padding-left**,**layout-padding-right**,**layout-padding-top**, **layout-padding-bottom**, **layout-margin-vertical**,**layout-margin-horizontal**,**layout-margin-left**,**layout-margin-right**,**layout-margin-top**, **layout-margin-bottom** ([6901980](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/6901980]))
* **o-grid**:
  * New `fixed-header` attribute ([4fa91d9](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/4fa91d9]))
  * New `gutter-size` attribute ([4e45aaf](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/4e45aaf]))
* **o-grid-item**: New `colspan` and `rowspan`  attributes ([f1b33a1](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f1b33a1]))
* **o-table-context-menu**: includes new filtering options ([059cd83](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/059cd83))
* **o-row, o-column, o-row-collapsible** and **o-colum-collapsible**: new `layout-gap` attribute ([15ba08e](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/15ba08e))

### BREAKING CHANGES
* **o-table-cell-renderer-currency**, **o-table-cell-renderer-real**, **o-table-cell-renderer-percentage**: Attribute `decimal-digits` has been removed. Use the new attributes `min-decimal-digits` and `max-decimal-digits`([a58b414](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/a58b414))([c1a29bd](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/c1a29bd))
* **o-button**: internal CSS class `o-button-text` has been removed.
* **o-image**:
  * Internal CSS class `container-image` has been renamed to `o-image-content`.
  * Internal CSS class `input-image` has been renamed to `o-image-form-field`,
  * Internal CSS class `image-container` has been renamed to `o-image-display-container`.
  * Internal CSS class `auto-fit-image` has been renamed to `o-image-auto-fit`,
  * Internal CSS class `input-image-container` has been removed.
* Components styles: there are some minor changes in components styles.

## 4.0.0-rc.1 (2018-01-16)
### Features
* New components `o-button-toggle` and `o-button-toggle-group` ([311a2ac](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/311a2ac)) ([415f8b0](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/415f8b0))
* New components `o-slider` ([a885043](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/a885043))
* **o-hour-input**: allowing to introduce hour value manually in the component input ([51fb9dc](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/51fb9dc))
* **o-context-menu**:  ([db32ecf](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/db32ecf))([a6d6b44](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/a6d6b44))
  * New component `o-context-menu-group` that supports the ability to open a sub-menu.
  * New component  `o-context-menu-separator` that represents a separator in the menu
* **o-table-context-menu**: includes the next options: `view detail`, `edit`, `insert`, `copy options` and `select all`.  ([ee465d4](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/ee465d4)) ([99d5040](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/99d5040))([e05cc93](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/e05cc93)) ([1b94c3c](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/1b94c3c))
* **o-app-layout-header**: new component for adding custom content to `o-app-layout` header ([dc0d408](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/dc0d408))
* **o-app-layout-sidenav**: new component for adding custom content to `o-app-layout` sidenav ([4e12eb9](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/4e12eb9))
* **o-table-cell-renderer-boolean**: new `render-type`, `render-true-value` and `render-false-value` inputs ([a8cca0d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/a8cca0d))
* **o-table-cell-editor-boolean**: new `auto-commit` input ([627aed3](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/627aed3))
* **o-table**:
  * new attribute `content-align` ([6c23f4b](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/6c23f4b))
  * new `resizable` input ([3523d54](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/3523d54))
* **o-table-column**:
  * new `orderable` input ([3523d54](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/3523d54))
  * new `resizable` input ([3523d54](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/3523d54))
  * new `max-width` input
* **AppConfig**: adding properties for allowing remote permissions query.
* **OServiceBaseComponent**: new `query-fallback-function` input ([fec7eab](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/fec7eab))
* **o-date-input**: new `value-type` input
* **o-row and o-column**: new `appearance` input ([8616872](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/8616872))
* **o-row-collapsible** and **o-colum-collapsible**: new `appearance` attribute ([41ace5d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/41ace5d)) ([fc92303](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/fc92303))
* **o-row and o-column**: new `appearance` input ([8616872](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/8616872))
* **o-row, o-column, o-row-collapsible** and **o-colum-collapsible**: new `layout-gap` attribute ([e302c25](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/e302c25))
* **o-row**, **o-column**:
  * Row and column components now extend from `OContainerComponent` class that provides shared functionality ([4713e3e](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/4713e3e))
  * Added new attribute `icon` ([69fc936](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/69fc936))
* New container components **o-row-collapsible** and **o-colum-collapsible** ([b1eb483](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/b1eb483)) ([0850ef3](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/0850ef3))
* **o-app-layout**: new `beforeOpenSidenav`, `afterOpenSidenav`, `beforeCloseSidenav` and `afterCloseSidenav` outputs ([1a2a028](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/1a2a028)), closes [#243](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/243)
* **O_MAT_ERROR_OPTIONS**: new provider for allowing to show the input components errors as a tooltip ([db74c34](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/db74c34))
* **O_INPUTS_OPTIONS**: new provider for allowing to configure input components ([01692e0](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/01692e0))
* **o-form-layout-manager**: new `title-data-origin` input ([c88ab98](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/c88ab98))

### Note on HammerJS
The sliding behavior in `o-slider` component requires that HammerJS is loaded on the page. You can see the support of Material in next ([link](https://material.angular.io/guide/getting-started#step-5-gesture-support))

### Bug Fixes
* **o-grid**: loading spinner displays properly ([7d08582](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/7d08582)), closes [#231](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/231)
* **o-form-navigation**: fixing index error ([f487e54](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f487e54)), closes [#238](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/238)
* **OServiceBaseComponent**: fixed bug on service components with pagination and located inside a detail form ([9c69c4b](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/9c69c4b)) ([bb0b04a](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/bb0b04a))
**o-grid**: It shows message of no results ([4f1878c](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/4f1878c))  closes [#245](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/245)

### BREAKING CHANGES
* **AppConfig**: removing `authGuard` property.
* **o-table-cell-renderer-boolean**: `true-value-type` and `false-value-type` inputs no longer exists ([a8cca0d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/a8cca0d))
* **o-date-input**: this component now only allows to receive and return timestamp values ([e0be14a](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/e0be14a))
* **o-table**: CSS class `action-cell-renderer` has been renamed to `o-action-cell-renderer`.
* **o-row**, **o-column**:
  * Attribute `title-label` has been renamed to `title`.
  * Attribute `layout-fill` has been removed.
  * Method `hasTitle` has been replaced by method `hasHeader`.
  * CSS classes `o-container-title-item` and `container-title` has been replaced by `o-container-title`.
  * CSS class `o-container-content-item` has been removed.
  * CSS class `container-content` has been renamed to `o-container-gap`.
* **o-form**: Attribute `layout-fill` has been removed.

## 3.2.1 (2018-12-28)
### Features
* **o-form**: new `getFormComponentPermissions` and  `getActionsPermissions` methods
* **o-table**: new attribute `select-all-checkbox-visible` ([a553447](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/a553447))
* **o-date-input**: new `value-type` input ([8876586](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/8876586))

### BREAKING CHANGES
* **PermissionsService**: ([2d186c9](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/2d186c9))
  * adding new parameter to `getTablePermissions` method
  * adding `getFormPermissions` method
  * removing `getFormDataComponentPermissions`, `getActionsContextMenuTablePermissions` and `getContainerActionsPermissions` methods
  * Routes ([1cc62a9](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/1cc62a9))
    * allowing to define permissions for routes
    * new `PermissionsGuardService` CanActivateChild guard

### Bug Fixes
* **o-grid**: pagination local in grid  ([916e632](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/916e632)), closes [#229](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/229)
* **o-table**:
  * expand the table in the container ([8d50a68](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/8d50a68))
  * the spinner produces scroll ([ef36e52](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/ef36e52))
  * tooltip not show when text is long and cell is at the edge of the screen ([9e5f328](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/9e5f328))
* **o-grid** and **o-table**: emit changes event in translations of the page
  ([f627826](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f627826))
* **ontimize-export.service**: fixing download bug ([dbeaf42](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/dbeaf42)) [#237](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/237)
* **o-context-menu** Fixed position if none of the provided positions fit ([8c72f40](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/8c72f40))


## 3.2.0 (2018-11-27)
### Features
* New component `o-slide-toggle` ([6c6453b](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/6c6453b))
* New components `o-button-toggle` and `o-button-toggle-group` ([311a2ac](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/311a2ac))
* **o-checkbox**: new attributes `color` and `label-position` ([7e9e69e](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/7e9e69e))
* **o-table-option**, **o-table-button**:
  * New `attr` and `enabled` inputs.
  * New `elRef` parameter in constructor.
* **OBaseTableCellEditor**: new `enabled` input.
* **OServiceBaseComponent**: new `query-on-event` input ([e2dfb06](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/e2dfb06))
* **OFormServiceComponent (o-combo, o-list-picker, o-radio)**: new input `set-value-on-value-change` and output `onSetValueOnValueChange` ([c972d2d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/c972d2d))
* **o-context-menu**:  ([db32ecf](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/db32ecf))([a6d6b44](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/a6d6b44))
  * New component `o-context-menu-group` that supports the ability to open a sub-menu.
  * New component  `o-context-menu-separator` that represents a separator in the menu
* **o-table-context-menu**: includes the next options: `view detail`, `edit`, `insert`, `copy options` and `select all`.  ([ee465d4](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/ee465d4)) ([99d5040](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/99d5040))([e05cc93](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/e05cc93)) ([1b94c3c](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/1b94c3c))
* **o-app-layout-header**: new component for adding custom content to `o-app-layout` header ([dc0d408](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/dc0d408))
* **o-app-layout-sidenav**: new component for adding custom content to `o-app-layout` sidenav ([4e12eb9](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/4e12eb9))
* New component `o-slider` ([a885043](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/a885043))
* **o-table-cell-renderer-boolean**: new `render-type`, `render-true-value` and `render-false-value` inputs ([a8cca0d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/a8cca0d))
* **o-table-cell-editor-boolean**: new `auto-commit` input ([627aed3](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/627aed3))
* **o-table-column**: New attribute `content-align` ([6c23f4b](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/6c23f4b))
* **AppConfig**: adding properties for allowing remote permissions query.

### Note on HammerJS
The sliding behavior in `o-slider` component requires that HammerJS is loaded on the page. You can see the support of Material in next ([link](https://material.angular.io/guide/getting-started#step-5-gesture-support))

### Bug Fixes
* **o-grid**: loading spinner displays properly ([7d08582](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/7d08582)), closes [#231](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/231)

### BREAKING CHANGES
* **AppConfig**: removing `authGuard` property.
* **o-table-cell-renderer-boolean**: `true-value-type` and `false-value-type` inputs no longer exists ([a8cca0d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/a8cca0d))
* **o-date-input**: this component now only allows to receive and return timestamp values ([e0be14a](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/e0be14a))
* **o-table**: CSS class `action-cell-renderer` has been renamed to `o-action-cell-renderer`.

## 4.0.0-rc.0 (2018-11-16)

### BREAKING CHANGES
* **Angular and Angular Material**:
  * Updating versions ([be5d6d7](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/be5d6d7))
  * You can use the official [Angular Update Guide](https://update.angular.io/)

### PEER-DEPENDENCY UPDATES ###
* **Updated**:  @angular@6.1.10
* **Updated**:  @angular/material@6.4.7
* **Updated**:  @angular/cdk@6.4.7
* **Updated**:  @angular/flex-layout@6.0.0-beta.18
* **Updated**:  @ngx-translate/core@10.0.2
* **Updated**:  @ngx-translate/http-loader@3.0.1
* **Updated**:  ngx-material-timepicker@2.8.3
* **Updated**:  typescript@2.9.2
* **Updated**:  rxjs@6.3.1
* **Updated**:  zone.js@0.8.26
* **Updated**:  core-js@2.5.7
* **NOTE**: you must update your ([node version to 8 or later](https://nodejs.org/en/download/))

### Features
* **o-hour-input**: adding `min` and `max` inputs.
* **o-time-input**: adding `hour-min` and `hour-max` inputs.
* **OFormDataComponent**:
  * Adding `placeholder` input. Now you can configure `label` and `placeholder` separately. View ([Form field appearance variants](https://v6.material.angular.io/components/form-field/overview#form-field-appearance-variants)) for details.

  * Adding `appearance` input. View ([Form field appearance variants](https://v6.material.angular.io/components/form-field/overview#form-field-appearance-variants)) for details.
  You can use angular material global provider to configure appearance in all module form fields:
  ```javascript
  import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material';

  @NgModule({
    providers: [{ provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'legacy | standard | fill | outline' } }],
    ...
  })
  ```

  * Adding `float-label` input. View ([Form field floating label](https://v6.material.angular.io/components/form-field/overview#floating-label)) for details.
  You can use angular material global provider to configure floating labels in all module form fields:
  ```javascript
  import { MAT_LABEL_GLOBAL_OPTIONS } from '@angular/material';

  @NgModule({
    providers: [{ provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: { float: 'always | never | auto' } }],
    ...
  })
  ```
* **o-slide-toggle**: New component `o-slide-toggle` ([6c6453b](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/6c6453b))
* **o-checkbox**: new attributes `color` and `label-position` ([7e9e69e](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/7e9e69e))
* **o-table-option**, **o-table-button**:
  * New `attr` and `enabled` inputs.
  * New `elRef` parameter in constructor.
* **OBaseTableCellEditor**: new `enabled` input.
* **OServiceBaseComponent**: new `query-on-event` input ([e2dfb06](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/e2dfb06))
* **OFormServiceComponent (o-combo, o-list-picker, o-radio)**: new input `set-value-on-value-change` and output `onSetValueOnValueChange` ([c972d2d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/c972d2d))

## 3.1.2 (2018-11-07)
### Features
* **OValueChangeEvent**: adding `isUserChange` and `isProgrammaticChange` methods.
* **o-table-cell-renderer-percentage**: new `value-base` input ([d9585f6](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/d9585f6)) ([#222](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/222))

### Bug Fixes
* **o-grid**: open correct detail when clicking on grid items on pages different than the first page ([b9468a3](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/b9468a3)) closes [#220](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/220)

### BREAKING CHANGES
* **o-form**: `getDataValue` method is now public again.
* **AuthGuardServiceFactory**: removing factory.
* **AuthGuardService**: `getPermissions` and `isRestricted` methods no longer exists.
* **IFormDataComponent**: adding new properties to interface ([d12a606](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/d12a606))
  * `setValue`, `clearValue` and `getValue` methods.
  * `onChange`, `onValueChange` properties.
* **o-side-menu**: the side menu component is completely removed ([b13dc69](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/b13dc69))
* **o-service-base-component**: the method `filterContainsAllParentKeys` has been moved to `ServiceUtils` class ([9c2bdd5](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/9c2bdd5))
* **o-table-column**: removing `date-model-type` and `date-model-format` unused inputs.
* **OTableDataSource**: adding `updateRenderedRowData` method.
* **o-table-column**, **o-table-cell-editor-date**: new `date-value-type` input ([43ae503](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/43ae503))
* **OBaseTableCellEditor**: `show-toast-on-edit` input changed to `show-notification-on-edit` and its default value is now true ([ba28709](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/ba28709))

## 3.1.1 (2018-10-05)
### Features
* New component `o-radio` ([1ed0286](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/1ed0286)) ([e80513e](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/e80513e))
* **o-bar-menu**: `o-bar-menu` can build automatically base on the application menu configuration ([67f543f](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/67f543f))  ([1fc1f63](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/1fc1f63))
* **o-table**: new `multiple-sort` input ([6688618](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/6688618)) ([01257ea](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/01257ea))
* **o-grid**: The grid component now supports remote pagination ([b855724](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/b855724))
* **o-form**: new `getFieldValue`, `getFieldValues`, `setFieldValue`,`setFieldValues`, `clearFieldValue`,`clearFieldValues`, `getFieldReference` and  `getFieldReferences` methods ([3453182](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/3453182)) ([d03d482](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/d03d482)) ([e69473b](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/e69473b)) ([5228ccc](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/5228ccc)
* **OFormDataComponent**: new `onValueChange` event being fired if the value changed (whether it was changed by the user or by code) ([0b24228](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/0b24228))([07bc3d6](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/07bc3d6))([3ac842e](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/3ac842e))([e69473b](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/e69473b))([f7dd987](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f7dd987))   ([#142](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/142))
* **o-list**: events `onClick` and `onDoubleClick` are triggered event when `detail-mode` attribute is set to *none* ([989f92b](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/989f92b))

### Bug Fixes
* Fixing missing 'bundles', 'esm5' and 'esm2015' bundling files error.
* **o-bar-menu** fixed error the menu on mobile screen collapses ([1fc1f63](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/1fc1f63)).
* **service.utils**: fixed error building parent keys filter with aliases ([059ddc3](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/059ddc3)) closes ([#212](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/212))
* **buttons**: Adding type="button" to all html *buttons* ([e3c4779](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/e3c4779])) ([#210](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/210))
* **o-table-insertable-row**: fixing bug with multiple insertable rows in same page ([862d8fc](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/862d8fc)) ([#211](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/211))

### BREAKING CHANGES
* **MenuItem**:
  * attribute '*show-in-app-sidenav*' has been removed ([0c96585](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/0c96585)).
* **o-grid**: Attribute `page-size-options` has changed, now it receives an string with the page size options separated by ';' ([70dcd43](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/70dcd43)).
* **o-form**: `getDataValue` method is now protected, so if you were using it you should change it to use the `getFieldValue` method.
* **o-service-component.class**: `getRouteOfSelectedRow` has only one parameter now, if you are using it you should remove the second parameter.

## 3.1.0 (2018-09-13)
### Features
* **ontimize-ee.service**, **ontimize.service**: new response parsers methods (separately by each CRUD method) ([c8c9e6f](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/c8c9e6f))
* **o-table-dao**: new `updateQuery` method ([ad4f7ea](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/ad4f7ea))
* **o-service-base-component.class**:
  * new '*OServiceBaseComponent*' `extractKeysFromRecord` and `getSqlTypes` methods ([0aa24c9](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/0aa24c9))
  * new '*OServiceBaseComponent*' `getParentKeysValues` method ([e94aa61](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/e94aa61))
* **o-form-service-component.class**, **o-combo**, **o-listpicker**: new `query-with-null-parent-keys` attribute ([7e93930](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/7e93930))
* **o-table cell editors**:
  * updating cell data in server ([360bfd0](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/360bfd0))
  * new `updateRecordOnEdit` and `showToastOnEdit` inputs and `onPostUpdateRecord` output added to all cell editors ('*OBaseTableCellEditor*' class) ([360bfd0](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/360bfd0))
* **o-table**:
  * new `updateRecord` method ([a528120](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/a528120))
  * new `auto-align-titles` input ([1714a25](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/1714a25))
  * supports **infinite scroll** when `pagination-controls="no"` and `pageable="no"` ([9fc3afa](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/9fc3afa))
* **o-table-column**:
  * new `title-align` input ([1d261e1](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/1d261e1))
  * new `multiline` input ([d5957fe](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/d5957fe))
* **o-list**:
  * new outputs added: `onItemDeleted`, `onDataLoaded`, `onPaginatedDataLoaded` ([2f71849](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/2f71849))
  * added suppor for using the `o-filter-builder` component ([1736a2a](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/1736a2a))
  * Now, both `o-list-item` component and `o-list-item` directive make the list items go to item detail when click on them by default. Use the `detail-mode` attribute to configure this ([1cb22d3](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/1cb22d3) [ee2eecb](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/ee2eecb) [60848fe](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/60848fe))
* **o-list-item-card**: new input `show-image` ([ed89b6b](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/ed89b6b))
* **o-app-layout**:
  * New input `mode` for selecting performance mode `desktop` or `mobile` ([7617175](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/7617175))
  * New input `sidenav-mode` for selecting the [material sidenav mode](https://material.angular.io/components/sidenav/overview#changing-the-sidenav-39-s-behavior) ([c9a787d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/c9a787d))
  * New input `show-language-selector` ([c06bc24](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/c06bc24))
* **o-app-header**: new input `show-language-selector` ([c06bc24](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/c06bc24))
* New **o-validator** component that allows to add a custom validator to a `OFormDataComponent`. ([4e2f841](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/4e2f841))
  * New inner **o-error** inner component for defining the error text of the possible validator errors ([4e2f841](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/4e2f841))
* **OFormDataComponent**:
  * new `validators` input (closes [#100](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/100)) ([4e2f841](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/4e2f841))
  * support for using `o-validators` and `o-error` inner components (closes [#100](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/100)) ([a2e6bbe](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/a2e6bbe))
  * new exported static `DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT` array containing default ouputs. Also declaring default `onChange` EventEmitter ([3a999c8](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/3a999c8))
* **o-checkbox**: new attributes `boolean-type`, `true-value` and `false-value` ([0d6d0dd](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/0d6d0dd)) closes [#187](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/187)
* New **o-hour-input** component ([8212f85](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/8212f85))
* New **o-time-input** component ([49fe9c2](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/49fe9c2))
* **o-table-insertable-row**: new `include-parent-keys` input ([29e2a94](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/29e2a94))
* **o-image**: new `full-screen-button` input ([78bff44](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/78bff44))
* **o-list-picker**: new `text-input-enabled` input ([f903f27](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f903f27)) Closes [#181](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/181)
* **o-date-input**: new `text-input-enabled` input ([edb65ef](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/edb65ef))
* **o-form-layout-manager**:
  * new `store-state` input for allowing localStorage state storing (only in tab mode) ([1c0afc1](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/1c0afc1)) ([de562f6](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/de562f6))
  * allowing inner components navigation

### Bug Fixes
* **o-table, o-list, o-tree**: fixed error when querying data with parent keys and no defined values for some of those parent keys ([0548c8e](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/0548c8e)).
* **o-table**:
  * fixed error attribute `controls` does not show/hide the table tool bar ([2632658](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/2632658)).
  * fixed remove method ([3870b4f](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/3870b4f)).
  * fixed bugs related with `detail-button-in-row` and `edit-button-in-row` inputs ([1cbd261](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/1cbd261)).
* **o-list**: multiple errors fixed:
  * Navigate to insert form when clicking the insert button ([2f71849](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/2f71849)).
  * Delete selected list items ([2f71849](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/2f71849)).
* **o-combo**: state bugs fixed ([#202](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/202)) ([db1de6f](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/db1de6f))
* **o-form-data-components**: components state bugs fixed ([#203](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/203)) ([f986d12](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f986d12))


### BREAKING CHANGES
* **ServiceUtils**: method `getParentItemFromForm` has been removed. Use `getParentKeysFromForm` instead.
* **OServiceBaseComponent**: method `checkQueryReadyParentKeys` has been renamed to `filterContainsAllParentKeys`.
* **o-list**:
  * The method `onReload` has been removed as it was deprecated in v1.2.0.
  * The method `registerSearchInput` has been renamed to `registerQuickFilter`.
  * The public attribute `searchInputComponent` has been renamed to `quickFilterComponent`.
* **o-table**:
  * The attribute `show-table-buttons-text` has been renamed to `show-buttons-text`.
  * The output `onTableDataLoaded` has been renamed to `onDataLoaded`.
  * The output `onPaginatedTableDataLoaded` has been renamed to `onPaginatedDataLoaded`.
  * The attribute `break-word` (breakWord) has been removed. Use `multiline` instead.
  * editors and renderers:
    * The method `initialize` which was deprecated in 3.0.0-rc.1 has been removed.
* **o-form**: Output `onFormDataLoaded` has been renamed to `onDataLoaded`.
* **o-user-info**: removed input `use-flag-icons`. This component doesn't contain the language selector anymore.
* Changes in CSS classes naming:
  * **o-app-layout**: Internal CSS classes changes:
    * All internal CSS classes starting with `application-sidenav` has changed to `o-app-sidenav`.
    * All internal CSS classes starting with `application-header` has changed to `o-app-header`.
    * All internal CSS classes starting with `user-info` has changed to `o-user-info`.
  * **o-list-picker-dialog**: Internal CSS classes changes:
    * Internal CSS class `dialog-list-container` has been removed, use `mat-dialog-content` instead.
    * Internal CSS class `list-picker-search` has changed to `o-list-picker-search`.
    * Internal CSS class `has-filter` has changed to `o-list-picker-has-filter`.
  * **o-table**: Internal CSS class `hidden-action-text` has been removed.
  * **o-form-toolbar**: Internal CSS class `toolbar-form-header` has changed to `o-form-toolbar-header`.
* **OFormDataNavigation**: This internal class has been removed. You dont have to make any change unless you were overriding its use in the **o-form-navigation** component.

## 3.0.1 (2018-07-27)
### Features
* **o-list-item**: list item directive now can be attached to `mat-list-item` and `mat-card` components ([e256100](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/e256100)).
* **DialogService**: changing '*dialogRef*' property visibility to public ([#193](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/193)) ([f797b56](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f797b56))

### Bug Fixes
* **o-form-layout-manager**: fixed error when there is a `o-form` inside the form layout manager ([5aca0cc](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/5aca0cc))
* **o-table**: `registerColumn` method allows to receive a string argument again ([#197](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/197)) ([d0ac4b8](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/d0ac4b8))
* **OHTMLInputComponent**: fixed component class name ([4f4948c](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/4f4948c)) fixes [#196](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/196)
* **o-form**: fixing `destroyDeactivateGuard` method bug ([#198](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/198)) ([261091a](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/261091a))

## 3.0.0 (2018-07-24)
### Features
* **o-table**: new '*show-paginator-first-last-buttons*' input ([1c23563](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/1c23563))
* **o-table-paginator**: new '*show-first-last-buttons*' input ([1c23563](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/1c23563))
* **o-card-menu-layout**: now it is allowed include custom `o-card-menu-item` component on this component ([2209ecd](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/2209ecd))
* **o-card-menu-item**: new `action` attribute ([0aa9a33](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/0aa9a33))
* **o-image**; new `auto-fit` and `height` attributes ([a7bd081](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/a7bd081))
* **o-table-cell-renderer-action**: new '*text*', '*icon-position*' and '*action*' inputs ([afc1cd6](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/afc1cd6))
* **OntimizeMatIconRegistry**: new '*addOntimizeSvgIcon*' method ([79953f5](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/79953f5))
* New **oTabGroup** directive: applies styles to angular material `mat-tab-group` component ([0a04ce3](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/0a04ce3))

### Bug Fixes
* **o-form**: fixing navigation bugs ([344e369](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/344e369)) ([f06362e](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f06362e)) ([cc475b0](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/cc475b0))

### BREAKING CHANGES
* **o-side-menu**: the side menu component has been deprecated and will be removed in next versions.
* **o-table**: '*registerColumn*' method only accepts '*OTableColumnComponent | OTableColumnCalculatedComponent*' argument, for registering a column using only its attr user must use the '*registerDefaultColumn*' method. This will be rolled back in the next version and allow to receive any argument in the '*registerColumn*' method.
> **OHTMLInputComponent**: the html input component class name has changed to `HTMLInputComponent`. This will be rolled back in the next version.

## 3.0.0-rc.1 (2018-07-02)

### Features
* **OFormServiceComponent**: ('*o-combo*' and '*o-list-picker*' extends this class) adding '*getSelectedRecord*' method for getting the selected value associated data. This is a object including all the properties definied in the '*columns*' input ([e513805](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/e513805)) ([#162](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/162))
* **OServiceComponent**: ('*o-list*' and '*o-table*' extends this class) double click mode (used in '*detail-mode*' and '*edition-mode' input) allows '*dblclick*' and '*doubleclick*' values.
* **Codes**: Creating '*codes*' util class for general variables and types definitions ([9e20235](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/9e20235)) ([d2f2060](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/d2f2060))
* **o-service-base-component.class**: new '*OServiceBaseComponent*' parent class for components using Ontimize services ('*o-list*' and '*o-table*')([70271b7](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/70271b7))
  * new '*store-state*' input ([35a523c](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/35a523c)) ([#166](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/166))
  * new `query-with-null-parent-keys` attribute ([8ad7f8e](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/8ad7f8e))
* **o-table-column**:
  * new '*addEditor*' static method that user '*must*' use in new cell editors constructor definitions ([f942c20](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f942c20))
  * new '*tooltip*' input (default="no") for showing the cell value as tooltip ([e334539](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/e334539]))
    * new '*tooltip-value*' and '*tooltip-function*' inputs ([ddfa6a5](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/ddfa6a5]))
  * new '*sql-type*' attribute. Indicates the sql type for the data represented in that column ([64efcbc](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/64efcbc))
  * new '*min-width*' input ([1d0c63d]](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/1d0c63d]))
* **o-table-columns-filter**: added '*preload-values*' attribute ([a52b5cd](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/a52b5cd))
* **o-table**:
  * allowing to live edit the quick filter columns ([2be977e](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/2be977e)) ([23a73d4](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/23a73d4)) ([08447e3](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/08447e3))
  * new '*horizonta-scroll*' input ([1d0c63d]](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/1d0c63d]))
* **MenuItem**:
  * new '*show-in-card-menu*' input (default=true) indicating whether or not to show its correspondent '*o-card-menu-item*' ([374c408](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/374c408))
  * new '*show-in-app-sidenav*' input (default=true) indicating whether or not to show its correspondent '*o-app-sidenav-menu-item*' ([dbb7f9a](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/dbb7f9a))
* **OFormDataComponent**:
  * new '*width*' input in form inner components ([88d28cb](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/88d28cb)) ([d7b8307](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/d7b8307))
  * new optional '*options*' parameter in '*setValue*' method. This parameter must implement the new '*IFormValueOptions*' interface (same as angular FormControl '*setValue*' method '*options*' parameter, watch [here](https://angular.io/api/forms/FormControl#setValue)) ([e1a0e18](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/e1a0e18))
  * new '*read-only*' input in form inner components ([015c037](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/015c037))
* **o-combo**: new  '*multiple*' and '*multiple-trigger-label*' inputs that allow multiple selection ([9c6eed3f] (https://github.com/OntimizeWeb/ontimize-web-ngx/tree/9c6eed3fd509cf7e7a4262936ceb9d617fe8a1a3))
* New component **o-filter-builder** that allows building complex expressions using form components for filtering the `o-table` data. ([3874f70](https://github.com/OntimizeWeb/ontimize-web-ngx/tree/3874f70))
* New directive **oFilterBuilderQuery** used with the `o-filter-builder` component for triggering the filter action. ([3874f70](https://github.com/OntimizeWeb/ontimize-web-ngx/tree/3874f70))
* New directive **oFilterBuilderClear** used with the `o-filter-builderp` component for clearing the form components involved in the filtering. ([3874f70](https://github.com/OntimizeWeb/ontimize-web-ngx/tree/3874f70))
* **ontimize-ee.service**, **ontimize.service**: new '*parseSuccessfulResponse*' and '*parseUnsuccessfulResponse*' methods ([6ab33d8](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/6ab33d8))
* **Inputs**:
  * Added `clearValue` method to all input form components. ([ae92af5](https://github.com/OntimizeWeb/ontimize-web-ngx/tree/ae92af5))
  * Added `show-clear` attribute to all input form component. ([9d274b0](https://github.com/OntimizeWeb/ontimize-web-ngx/tree/9d274b0))
* **o-table-option**: new '*active*' input ([186c1cf](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/186c1cf))
* **o-table-button**: adding '*svg-icon*' input ([bed3613](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/bed3613))
* **icons**: new '*ontimize-icon-set.svg*' file that stores svg icons noew used in '*OntimizeWeb*' components.

### Bug Fixes
* **o-table**:
  * '*reinitialize*' method added ([fbf4828](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/fbf4828)), closes [#149](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/149)
  * fixing column change order bug ([4e23e3a](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/4e23e3a)) ([#168](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/168))
  * fixing bug in custom cell editors creation ([f942c20](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f942c20)) ([#167](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/167))
  * fixing translation bugs ([ffef427](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/ffef427)) ([b3de673](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/b3de673)) ([#170](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/170))
  * empty cell edition bug ([e51783d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/e51783d)) ([#164](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/164))
  * paginator bug fixed (deleting '*show all*' records option) ([f448bfa](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f448bfa)) [#179](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/179)
  * storing selection column state ([](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/)) [#189](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/189)
* **o-table-cell-renderer-service**: fix undefined service provider ([a00a112](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/a00a112)). Closes [#172](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/172)
* **o-app-sidenav**:
  * initialization bug fixed ([d150cb2](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/d150cb2)) ([#165](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/165))
  * initialization bug fixed ([eddfec3](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/eddfec3)) ([#176](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/176))
  * tooltip bug fixed ([35f0877](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/35f0877)), closes [#177](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/177)
  * general bugs fixed ([20a3539](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/20a3539)), closes [#178](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/178)
  * opened state bug fixed ([23635d3](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/23635d3)), closes [#180](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/180)
* **OServiceBaseComponent**: adding '*ngOnChanges*' method ([f93a1d0](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f93a1d0)) ([#174](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/174))
* **OFormServiceComponent**: '*setData*' method bug fixed ([1aa9e17](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/1aa9e17)) ([#173](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/173))
* **ontimize-ee.service**: delete method bug fixed ([bea5277](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/bea5277)) ([#183](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/183))
* **o-email-input**: validation bug fixed ([1a5be2a](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/1a5be2a)) ([#184](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/184))
* **o-image**: new default '*BASE64*' '*sqlType*' ([26a1e5c](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/26a1e5c)) ([#186](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/186))

### BREAKING CHANGES
* **o-table**:
  * removing the option for showing all table records in the paginator ([f448bfa](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f448bfa))
  * removing (unused) '*editable-columns*' input
  * editors and renderers ([f942c20](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f942c20)):
    * '*initialize*' method is now deprecated (user can still invoke it but it will do nothing)
    * every new editor or renderer that uses '*ngOnInit*' method *must* init its implementation invoking '*super.ngOnInit()*'
    * cell editors typo fixed: method '*startEdtion*' is now '*startEdition*'
* **o-file-input**: method `clearData` is no longer available. Use `clearValue` instead. ([7000acc](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/7000acc))
* **o-real-input**, **o-currency-input**, **o-percentage-input**: attribute `decimal-digits` has been removed. ([f321543](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f321543))
* **oReal**: real pipe (`ORealPipe`) arguments (`IRealPipeArgument`) has changed. Attribute `decimalDigits` is no longer available, use attributes `minDecimalDigits` and `maxDecimalDigits` instead. ([f321543](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f321543))
* **.angular-cli.json**: in all your applications using *OntimizeWeb* you **MUST** add the following line in the '*.angular-cli.json*' file, otherwise all the components icons will not be loaded.
```json
...
"assets": [
...
  { "glob": "**/*", "input": "../node_modules/ontimize-web-ngx/assets/", "output": "./assets/" },
...
]
...
```
* **IMPORTANT**: if you are using '*ontimize-web-ngx-tools*' library for generating your app production version you **MUST** update it to '*ontimize-web-ngx-tools@1.0.6*' (or superior).
* removing the classes *o-form-toolbar-floating* and *o-form-toolbar-floating-scrolled*. New styles were applied *o-form-toolbar*, it is necessary to review the classes related to it ([5f8c96b](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/5f8c96b))

**Note**: There is a new '*o-tree*' component, all its information will be available at [ontimize-web-ngx-tree](https://github.com/OntimizeWeb/ontimize-web-ngx-tree)

## 3.0.0-rc.0 (2018-04-30)

### DEPENDENCY UPDATES ###
* **Removed**:  dragula@^3.7.2
* **Removed**:  ng2-dragula@1.3.1
* **Added**  :  ng2-dnd@5.0.2

### PEER-DEPENDENCY UPDATES ###
* **Updated**:  @angular@5.2.10
* **Updated**:  @angular/cli@1.7.3
* **Updated**:  @angular/material@5.2.4"
* **Updated**:  @angular/cdk@5.2.4"
* **Updated**:  @angular/flex-layout@5.0.0-beta.13
* **Updated**:  @ngx-translate/core@9.1.1
* **Updated**:  @ngx-translate/http-loader@2.0.1
* **Updated**:  core-js@2.5.3
* **Updated**:  rxjs@5.5.6
* **Updated**:  zone.js@0.8.20
* **Updated**:  reflect-metadata@0.1.12
* **New**:      @angular/material-moment-adapter@5.2.4
* **New**:      typescript@2.4.2
* **New**:      webpack@3.11.0

### BREAKING CHANGES
* **Angular and Angular Material**: updating versions ([be5d6d7](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/be5d6d7))
* **Services**: all services now are using '*HTTPClient*' instead of '*HTTP*' ([184b5df](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/184b5df))
* **o-table-visible-columns-dialog**: drag and drop library changed from '*dragula*' to '*ng2-dnd*' ([0e054f4](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/0e054f4))

### Features
* **o-combo**: `mat-select` is now used inside `mat-form-field`. This makes all of the existing form-field features available with `mat-select`, including hints, errors, prefixes, and suffixes. This also ensures that `mat-select` and `matInput` have a consistent presentation ([9c2acbb](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/9c2acbb))
* **o-list-picker**: improving performance ([64820b8](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/64820b8))
* **MomentDateAdapter**: Using angular material '*MomentDateAdapter*' (changes should be transparent to user) ([f424199](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f424199))
* **OntimizeWebModule**: adding '*schemas: [CUSTOM_ELEMENTS_SCHEMA]*' to exported '*OntimizeWebModule*' ([12d452d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/12d452d))
* **app.config**: adding '*assets*' property for configuring application assets locations (only available for i18n files) ([894f592](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/894f592))
```
export const CONFIG: Config = {
  ...
  assets: {
    i18n: {
      path: string; //path of i18n files folder
      extension: string; //extension of locale files
    }
  };
  ...
```

### Bug Fixes
* **o-combo**: Fixing change event emission ([a648c8b](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/a648c8b)) Closes [#152](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/152)
* **o-form**: Fixing close dialog on ESC key event ([f789a64](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f789a64))
* **o-list-picker**: fixing component bugs ([132bc4c](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/132bc4c))
* **o-form**: fixing dynamicform registration bugs ([d84fcbd]](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/d84fcbd]))

## 2.1.3 (2018-04-18)
### Features
* **o-list-picker**:
  * There is a new '*query-rows*' (number) input. This input indicates how many elements are initially rendered in the list picker dialog. When the dialog scroll hits bottom a new set of elements are rendered ([8b1e4ef](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/8b1e4ef))
    * NOTE: This feature only works with the data retrieved by the list picker. It does not filter the data remotely.
  * Allowing to pre-filter content using the component input text before opening the dialog.

### Bug Fixes
* **o-table**: Fixing bug when using parent-keys ([ae64e93](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/ae64e93))
* **o-list-picker**: Improving performance ([8b1e4ef](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/8b1e4ef))

## 2.1.2 (2018-04-03)
### PEER-DEPENDENCY UPDATES ###
* **Updated**:  core-js@2.5.3
* **Updated**:  rxjs@5.5.6
* **Updated**:  zone.js@0.8.20

### Bug Fixes
* **o-combo**: Fixing styling bugs ([98c8b99](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/98c8b99))
* **o-form-navigation**: Fixing navigation bugs ([835afcf](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/835afcf))
* **o-table-cell-editor-boolean**: Fixing value parsing bug ([#154](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/154)) ([8fd96ea](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/8fd96ea))


## 2.1.1 (2018-03-20)
### BREAKING CHANGES
* **o-table**: '*pageable*' input default value is now 'false' (inherited from '*OServiceComponent*') ([f0836da](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f0836da))

### Features
* **OServiceComponent**: adding '*insert-form-route*' and '*recursive-insert*' inputs to manage the insertion routes ([3ed2cb6]](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/3ed2cb6]))

## 2.1.0 (2018-03-15)

### BREAKING CHANGES
* **o-table**: '*filter-case-sensitive*' input default value is now 'false'.
* **o-table**: removing input '*insert-table*' ([4907594](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/4907594))
* **o-table**: '*pageable*' input default value is now 'true'.
* **moment**: updating momentjs dependency to version 2.19.3 ([50c80bb](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/50c80bb))
* **IAuthService**: updating interface adding '*redirectLogin*' optional function definition ([9641f12](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/9641f12))

### Features
* **o-form**
  * New '*getUrlParams*' method. Shortcut for '*getFormNavigation().getUrlParams()*' ([32f5613](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/32f5613))
  * New '*getUrlParam*' method. Shortcut for '*getFormNavigation().getUrlParams()[arg]*' ([32f5613](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/32f5613))
  * New '*layout-align*' input ([bcd2a42](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/bcd2a42))
  * Exporting inner form components and classes ([#148](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/148)) ([32cd7f9](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/32cd7f9))
    * OFormCacheClass
    * OFormNavigationComponent
    * OFormDataNavigation
    * OFormNavigationClass
  * New '*getFormCache*' method ([32f5613](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/32f5613))

* **o-table**
  * Changing '*dialog*' property visibility to protected ([68dfda1](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/68dfda1))
  * New '*clearSelection*' method ([0a37f5d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/0a37f5d))
  * Adding '*show-title*' input ([cae0868](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/cae0868))
  * Adding cell editors ([04f43ae](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/04f43ae)) ([acc4238](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/acc4238)) ([efad08a](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/efad08a))
    * Adding more editors types ([ba71737](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/ba71737)) ([1bc7f8e](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/1bc7f8e)) ([75bc0f8](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/75bc0f8)) ([5b6d9d0](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/5b6d9d0)) ([66332c1](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/66332c1))  ([ff38a7e](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/ff38a7e))
  * Updating selection mode using click + ctrl | shift ([acc4238](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/acc4238))
  * Adding '*selection-mode*' input (none|simple|multiple)
  * Adding remote pagination  ([3e10752](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/3e10752)) ([18f576d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/18f576d))
  * Adding '*quick-filter-function*' input for allowing user to override default quick filter value passed to the service ([e1ad25a](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/e1ad25a))
    * Adding '*QuickFilterFunction*' type ('*type QuickFilterFunction = (filter: string) => IFilterExpression | Object;*')
  * **o-table-insertable-row**: adding new inner table component for using insertable rows ([4907594](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/4907594)) ([2a8ceee](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/2a8ceee))
    * Using configured cell editors for the edition of each column ([6abe426](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/6abe426)) ([5b6d9d0](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/5b6d9d0))
  * **o-table-renderer-service** adding predefined cell renderer *'o-table-renderer-service'* ([f1685b5](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f1685b5))
  * **o-table-cell-renderer-action**: new '*o-table*' column renderer ([3e3a924](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/3e3a924))

* **Util**
  * '*parseArray*' methods allows to discard repeated elements ([a924ad2](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/a924ad2))
  * Adding '*equals*' and '*isDefined*' methods ([1c5aa00](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/1c5aa00))

* **OFormServiceComponent**
  * Adding '*query-method*' input ([7bd62e4](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/7bd62e4))
  * Adding '*query-on-event*' input ([7bd62e4](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/7bd62e4))

* **styles**: adding '*theme.scss*' file so user wont need to import 'node_modules/ontimize-web-ngx/ontimize/components/theming/all-theme.scss' and will only have to import 'node_modules/ontimize-web-ngx/theme.scss' ([408f863](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/408f863))
([4b02d0f](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/4b02d0f))
* **o-material-theme**: '*o-material-theme*' now initializes angular material theme and typography configuration. It also receives user custom typography as second parameter ([06baef2](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/06baef2)) ([40c6777](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/40c6777))
* **ontimize-ee**: adding remote pagination '*advancedQuery*' method ([3e10752](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/3e10752))
* **FilterExpressionUtils**: adding utility class for building filtering queries parameters ([8aacf96](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/8aacf96))
* **AppConfig**: adding properties for allowing remote bundle location:
* **oTranslate**
  * Allowing to retrieve remote bundle configuration. Using the '*bundle*' property in the application '*Config*' object ([86ecd4f](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/86ecd4f))
  * Allowing to pass parameters to '*oTranslate*' pipe, following the new '*ITranslatePipeArgument*' interface ([b7744da](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/b7744da)) ([43edbe4](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/43edbe4)) ([8e5d890](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/8e5d890))
    * Having the following entry in the bundle file:
    ```
      ...
      "EXAMPLE": "Example bundle text: {0}, {1}",
      ...
    ```
    * User can add in the html file:
    ```
      {{ 'EXAMPLE' | oTranslate : { values: ['foo', 'bar'] }}}
    ```
    * And get the following result:
    ```
      'Example bundle text: foo, bar'
    ```
* **OFormDataComponent**: adding '*elementRef*' getter ([159e57d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/159e57d))
* **o-language-selector**: adding '*use-flag-icons*' input (default false). Also added in '*o-app-layout*', '*o-app-header*' and '*o-user-info*' (for propagation) ([9c143e9](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/9c143e9))
* **OntimizeServiceResponseParser**: adding default parser for the Ontimize server responses ([1c2e420](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/1c2e420))


### Bug Fixes
* **o-table-dao**: fixing methods bugs ([5093bc0](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/5093bc0))
* **input components**: adding '*required*' attribute to HTML input elements. Now required input components have an asterisk in their placeholder ([dd6d910](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/dd6d910))
* **o-table**: fixing inputs bugs ([cae0868](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/cae0868))
* **o-table**: fixing error when columns parameter has duplicated column names ([be151a8](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/be151a8))
* **o-form**: changing disabled status bug ([fd8dbb4](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/fd8dbb4))
* **o-component.class**: fixing empty '*label*' input bug ([6e212aa](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/6e212aa))
* **o-combo**: fixing bugs when value changes ([b3a0073](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/b3a0073))

## 2.1.0-rc.3 (2018-01-18)
### Features
* **o-card-menu-layout**: new '*o-card-menu-layout*' component ([1dbc1f8](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/1dbc1f8))
* **o-card-menu-item**: new '*o-card-menu-item*' component ([1dbc1f8](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/1dbc1f8))
* **o-table** : adding '*onRowSelected*', '*onRowDeselected*', '*onRowDeleted*', '*onTableDataLoaded*' and '*onPaginatedTableDataLoaded*' outputs ([6982984](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/6982984))
* **o-context-menu**: new '*o-context-menu*' component and '*oContextMenu*' directive for attaching a context menu to DOM elements ([c838095](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/c838095)) ([559c0ae](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/559c0ae))
* **o-table-context-menu**: new '*o-table-context-menu*' component for attaching a context menu to '*o-table*' rows ([5658b83](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/5658b83))
* **o-table-column-calculated**: adding posibility to add calculated columns ([5e4aacd](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/5e4aacd)) ([d8479d6](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/d8479d6))
* **Components**: new '*automatic-registering*' input for specifying that a component will not be not registered on its parent form ([1205e57](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/1205e57))
* **o-form-data.component.class**: new '*DEFAULT_INPUTS_O_FORM_DATA_COMPONENT*' static variable ([1205e57](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/1205e57))
* **IFormDataComponent**: '*IFormDataComponent*' now extends '*IFormControlComponent*' ([1205e57](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/1205e57))
* **NavigationService**: '*NavigationService*' is now initialized on application initialization ([b63e372](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/b63e372))
* **o-form**: adding '*show-header-navigation*' input (default false) for including navigations buttons in the toolbar ([#39](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/39))

### BREAKING CHANGES
* **OServiceComponent**: changing '*dataService*' visibility from protected to public ('*o-list*' and '*o-table*' components extends this class) ([5270cde](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/5270cde))

## 2.1.0-rc.2 (2017-12-21)

### Features
* **o-table-button**: adding '*icon-position*' input ([66f0acb](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/66f0acb))
* **o-table**: adding public methods *'getValue'*, *'getRendererValue'*, *'getSqlTypes'* ([236b9b6](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/236b9b6))
* **o-table**: excel exportation support ([8b8a4b0](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/8b8a4b0))
* **o-table**: HTML and PDF exportation support ([5bbfc7f](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/5bbfc7f))
* **o-table**: adding styles to cell by type value *o-column-string*,*o-column-currency*, *o-column-integer*, *o-column-real*,*o-column-boolean*,*.o-column-date* ([aaf11b2](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/aaf11b2))
* **o-table-column**: adding posibility to customize cell renderes ([9569f00](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/9569f00)) ([5badd8d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/5badd8d)) ([443bf1c](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/443bf1c))
* **o-table-option**: new '*o-table-option*' component for adding options to '*o-table*' menu ([f48a591](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f48a591))
* **o-table, o-table-columns-filter**: new '*o-table-columns-filter*' component ([a0a3eed](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/a0a3eed)) ([21ad0b7](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/21ad0b7)) ([0d69818](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/0d69818)) ([d6c9969](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/d6c9969))
* **o-table-paginator**: new '*o-table-paginator*' component ([23b4e4d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/23b4e4d)) ([2213a0d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/2213a0d)) ([a19fa4b](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/a19fa4b)) ([6c608cf](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/6c608cf)) ([68ae7c6](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/68ae7c6))
* **o-table-column-aggregate**: new *o-table-column-aggregate* component allows to display columns of totals. ([eb7c9d7](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/eb7c9d7)) ([6f466d7](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/6f466d7)) ([80b7f04](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/80b7f04)) ([821e696](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/821e696))
* **o-form-layout-manager**: new '*o-form-layout-manager*' component ([26a0e04](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/26a0e04)) ([0be6b2c](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/0be6b2c)) ([e4871ee](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/e4871ee)) ([7f31cbd](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/7f31cbd)) ([ecd362a](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/ecd362a))
* **o-table-renderer-percentage** adding predefined cell renderers *'o-table-renderer-percentage'* ([0e48fdf](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/0e48fdf))
* **SnackBarService** added service for showing an angular material SnackBar component ([cbc4159](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/cbc4159))
* **OSnackBarComponent** added component in order to customize the snackbar component ([f3eaa13](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f3eaa13))
* **o-language-selector**: new component for changing application locale listing all available languages. It  uses '*flag-icons*' library ([d7b0c25](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/d7b0c25))
* **o-app-layout**: adding the following inputs:
  * '*sidenav-opened*', '*show-header*', '*show-user-info*', '*opened-sidenav-image*' and '*closed-sidenav-image*'
 ([03d79fe](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/03d79fe)) ([ecc3404](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/ecc3404)) ([296e920](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/296e920))

  This changes are propagated to inner components ('*o-app-sidenav*', '*o-app-sidenav-image*', '*o-app-sidenav-menu-group*' and '*o-app-sidenav-menu-item*')
* **o-table**: adding input *fixed-header*  ([a0601a6](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/a0601a6))  ([a0601a6](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/a0601a6)
* **o-breadcrumb**: new breadcrumb component. It requires NavigationsService initialization on app start ([#36](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/36)) ([b5b60bd](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/b5b60bd))
* **o-form-container** : new form container *o-form-container*  ([3a394e3](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/3a394e3)) ([df81e2d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/df81e2d)) ([ab6fa09](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/ab6fa09)) ([7c3883e](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/7c3883e))

### Bug Fixes
* **o-translate-service**: fixing *'getBrowserLang'* bug ([#138](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/138)) ([4a5d2e7](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/4a5d2e7))
* **o-form**, **o-table**, **o-datatable**, **o-list**,**o-list-picker**,**o-combo**: fixing to show server messages in the client when the requested action fails in the components bug ([#59](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/59)) ([bceae37](https://github.com/OntimizeWeb/ontimize-web-ngx-datatable/commit/bceae37)) ([6ed6bda](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/6ed6bda))
* **o-table**: fixing call *'query-method'* using a different query than the default bug ([#140](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/140)) ([e085e59](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/e085e59))
* **o-table**: fixing call *'queryData'* using parent-keys bug ([#143](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/143)) ([7fe79c6](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/7fe79c6))
* **oKeyboardListener**: fixing host listener bug ([a6ecc38](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/a6ecc38gi))
* **o-date-input**: fixing locale bug ([#145](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/145)) ([657efcb](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/657efcb))
* **o-app-layout**: fixing sidenav image bug  ([#127](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/127))

## 2.1.0-rc.1 (2017-11-15)

**NOTE:** if you want to add a issue ([here](https://github.com/OntimizeWeb/ontimize-web-ngx/issues)) please try to follow our new [issue template](https://github.com/OntimizeWeb/ontimize-web-ngx/blob/master/ISSUES_TEMPLATE.md)

### DEPENDENCIES ###
* `ontimize-web-ngx` now depends on `ng2-dragula` as a dependency.

### Features
* **o-list-picker**: adding *'onFocus'* and *'onBlur'* outputs ([afdd027](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/afdd027))
* **o-date-input**:  adding *'onChange'*, *'onFocus'* and *'onBlur'* outputs ([ba802aa](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/ba802aa))
* **oKeyboardListener**: creating directive *'oKeyboardListener'* having *'keyboardKeys'* input and *'onKeysPressed'* event output ([b410584](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/b410584))
* **o-form**: addding the feature of undo form inner components changes stored in the form cache. The *'undo-button'* (default=true) input controls the existence of a undo button in form toolbar. It also works with *'ctrl+z'* ([d026ae7](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/d026ae7))
* **o-table**:
  * adding '*row-height*' input (small|medium|large) ([59cd9a2](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/59cd9a2))
  * adding predefined renderers *'o-table-renderer-integer'* ([628aacf](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/628aacf)), *'o-table-renderer-real'* ([12477e](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/12477e)), *'o-table-renderer-currency'* ([cfc1889](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/cfc1889)), *'o-table-renderer-date'* ([b978c45](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/b978c45)),*'o-table-renderer-boolean'* ([17da1e5](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/17da1e5))  ([258b2b0d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/258b2b0d)),*'o-table-renderer-image'* ([17da1e5](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/17da1e5))
  * adding '*onClick*' and '*onDoubleClick*' outputs and detail mode navigation ([d68ae72](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/d68ae72))
  * adding predefined buttons in the toolbar (add & refresh) and optional buttons (using *o-table-button* selector) ([a0010e2](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/a0010e2))
  * adding the capability of selecting visible columns and their order ([d3dd172](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/d3dd172c2bc1a3ebb92546449a9d5f461afcc125))
  * adding the capability of multiple selection  ([1c2979b](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/1c2979b))
* **o-table-column**:
  * adding *'async-load'* input ([e075e0e](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/e075e0e)) ([f077876](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f077876)) ([258b2b0d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/258b2b0d))
  * adding *'width'* input ([c8b1ec2](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/c8b1ec2))
* **o-form**: undo feature allows to undo blocks of changes (instead of undoing changes characters one by one) ([2438a46](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/2438a46))

### BREAKING CHANGES
* **o-moment-pipe**: moment pipe class name has changed from '*oMomentPipe*' to '*OMomentPipe*', this will not affect to pipe use (still using '*oMoment*' selector) ([6ba54de](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/6ba54de))
* **o-currency-pipe**: new currency pipe class name '*oCurrencyPipe*', this selector is '*oCurrency*' and the arguments must extend ICurrencyPipeArguments) ([0a87fe0](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/0a87fe0))

### Bug Fixes
* **o-combo, o-list-picker**: Fixing value ensuring bug (comparing 0 value as undefined) ([c6a23f3](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/c6a23f3))

## 2.1.0-rc.0 (2017-11-02)

### Features
* **o-table**: new component o-table, provider new simple table  using angular-material [table](https://material.angular.io/components/table/overview)
This component allows to sort and filter data. ([be6ffcb](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/be6ffcb)) ([8e8d71b](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/8e8d71b)) ([055a685](https://github.com/OntimizeWeb/ontimize-web-ngx/commit055a685/)) ([522a5d1](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/522a5d1)) ([2a85f19](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/2a85f19)) ([3d3706a](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/3d3706a)) ([5f177d5](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/5f177d5)) ([66072b6](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/66072b6)) ([89fde1d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/89fde1d)) ([baeefc4](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/baeefc4))

* **o-file-input**: new component. It allows to upload files to a Ontimize-JEE server ([#42](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/42)) ([d77b588](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/d77b588)) ([552e4d9](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/552e4d9)) ([ee27960](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/ee27960)) ([f666992](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f666992))
* **o-form**: new '*editable-detail*' input (default value = '*true*'). When this input is true the default '*detail*' form mode allows the inner components edition ([488f997](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/488f997)).
* **o-form**: new '*keys-sql-types*' input ([76f0e88](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/76f0e88))
* **o-list**: new '*delete-button*' input (default value = '*true*') ([#133](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/133)) ([8185483](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/8185483))
* **o-list**: new '*onInsertButtonClick*' output ([#134](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/134)) ([dd4a0e2](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/dd4a0e2))


### BREAKING CHANGES
* **o-table** and **o-list**: following inputs default values have changed ([0a356c9](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/0a356c9)):
  * '*detail-mode*': changed from '*none*' to '*click*'.
  * '*detail-button-in-row*': changed from '*true*' to '*false*'.
* **OFormDataComponent**: this class now implements '*OnInit*' and '*onDestroy*' to forcing user to implement this methods at form components creation ([4c6c23b](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/4c6c23b)).

### Bug Fixes
* **o-form**: fixing bug in keys values ([#132](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/132)) ([4b5fd5e](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/4b5fd5e))


## 2.0.0 (2017-09-26)

### BREAKING CHANGES
* **OntimizeWebModule**: '*ontimize-web-ng2*' is now called '*ontimize-web-ngx*'.

**IMPORTANT**: you must update your imports for changing '*ontimize-web-ng2*' for '*ontimize-web-ngx*'. This includes module and components import and '*ontimize.scss*' reference.

* **Theming**: deleting material design pre-built exported themes. In your '*app.scss*' you wont be able to import anymore the following files:
  * `node_modules/ontimize-web-ng2/ontimize/components/theming/indigo-pink.scss`
  * `node_modules/ontimize-web-ng2/ontimize/components/theming/deeppurple-amber.scss`
  * `node_modules/ontimize-web-ng2/ontimize/components/theming/pink-bluegrey.scss`
  * `node_modules/ontimize-web-ng2/ontimize/components/theming/purple-green.scss`

**Note**: From now on, all information about theming will be available at [ontimize-web-ngx-theming](https://github.com/OntimizeWeb/ontimize-web-ngx-theming)

## 2.0.0-rc.8 (2017-09-25)

### PEER-DEPENDENCY UPDATES ###
* **Updated**:  @ngx-translate/core@8.0.0
* **Updated**:  @angular@4.3.6
* **Updated**:  @angular/cli@1.3.2
* **Updated**:  @angular/material@2.0.0-beta.10
* **Updated**:  @angular/cdk@2.0.0-beta.10
* **Updated**:  @angular/flex-layout@2.0.0-beta.9

### BREAKING CHANGES
* **o-date-input**: date input not longer using jquery-ui datepicker. Now using angular-material [datepicker](https://material.angular.io/components/datepicker/overview)

**IMPORTANT: dont forget to remove a possible jquery-ui datepicker script import in *angular-cli.json*(`node_modules/jquery-ui/ui/widgets/datepicker.js`)

* **o-table**: ontimize web table component ('*o-table*') and all its inner components ('*o-table-column*', cell renderers and cell editors) are not longer available in '*OntimizeWebModule*', you must install '*ontimize-web-ngx-datatable*' to import '*ODataTableModule*' and have the full '*o-table*' component with the following breaking changes:
  * **ODataTableModule**: you must add the import of '*ODataTableModule*' in that modules using the table component (`import { ODataTableModule } from 'ontimize-web-ngx-datatable;'`).
  * **html templates**: Change all '*o-table*' html tags for '*o-datatable*'. This also includes all the inner components ('*o-table-column*' is now '*o-datatable-column*' and so on).
  * **typescript**: Every import of table components references must also change using the new naming. For example  `import { OTableComponent } from 'ontimize-web-ng2';` must be changed to `import { ODataTableComponent } from 'ontimize-web-ngx-datatable';`. This also applies to all table components or interfaces (all '*OTable...*' references must be changed to '*ODataTable...*'.).
  * **styles**: You must import the styles of the '*o-datatable*' component:
    * Module styles:
      `node_modules/ontimize-web-ngx-datatable/styles.scss`
    * Theming styles in your '*app.scss*' file (it must be included after '*o-material-theme*'):
      `@import 'node_modules/ontimize-web-ngx-datatable/o-datatable-theme.scss';`
      `@include o-datatable-theme($theme);`
  * **angular-cli.json**:
    * If you dont install '*ontimize-web-ngx-datatable*' you must delete the following scripts from '*scripts*' property:
      * `../node_modules/jquery/dist/jquery.js`
      *  `../node_modules/colresizable/colResizable-1.6.min.js`
      *  `../node_modules/pdfmake/build/pdfmake.js`
      *  `../node_modules/pdfmake/build/vfs_fonts.js`
    * If you install '*ontimize-web-ngx-datatable*' you must add the following stylesheet to '*styles*' property:
      * `../node_modules/ontimize-web-ngx-datatable/styles.scss`

**Note**: From now on, all information about '*o-datatable*' will be available at [ontimize-web-ngx-datatable](https://github.com/OntimizeWeb/ontimize-web-ngx-datatable)

* **@angular/material**: updating styles and templates for ([@angular/material@2.0.0-beta.10](https://github.com/angular/material2/blob/master/CHANGELOG.md)) breaking changes.
  * Some of the important changes for '*ontimize-web-ng2*':
    * `md-input-container` renamed to `md-form-field`
    * `MdSidenav` has been split into `MdSidenav` and `MdDrawer`. The `MdSidenav`
    * CSS classes have changed from `mat-sidenav-` to `mat-drawer-`
    * All dash-case `@Directive` selectors are deprecated in favor of the camelCase equivalent.

* **@angular/flex-layout**: updating styles and templates for ([@angular/flex-layout@2.0.0-beta.9](https://github.com/angular/flex-layout/blob/master/CHANGELOG.md)) breaking changes.
* **deleted directives**: '*DisabledComponentDirective (o-disabled)*' and '*FormComponentDirective*' are no longer available (or needed).

### Features
* **ontimize-web-ng2**: '*OntimizeWebModule*' is now AoT compatible.
* **o-form**: adding '*layout-direction*' input ([#114](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/114)) ([afb25e7](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/afb25e7))
* **o-list-picker**, **o-combo**: adding '*value-column-type*' attribute ([#115](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/115)) ([56b7db3](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/56b7db3))

**IMPORTANT: '*value-column-type*' attribute is set to '*int*' by default, so the '*value-column*' will be *always* parsed to int.

* **o-table-cell-renderer-string**: adding '*translate*' input ([#118](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/118)) ([f9da979](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/f9da979))
* **o-table-cell-editor**: adding '*onFocus*', '*onBlur*' and '*onSubmit*' outputs to all cell editor components ([#120](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/120)) ([a1ee4e2](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/a1ee4e2))
* **o-date-input**: with new angular-material datepicker is possible to do a time selection setting component 'format' attribute that shows time (see [momentjs](https://momentjs.com/docs/#/displaying/format/) docs) and editing the input ([#68](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/68))
* **o-table** : adding '*onRowSelected*', '*onRowDeselected*', '*onRowDeleted*', '*onDoubleClick*', '*onTableDataLoaded*' and '*onPaginatedTableDataLoaded*' outputs ([#123](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/123)) ([b5aabb2](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/b5aabb2))


### Bug Fixes
* **Exports**: exporting content from '*util/async*', '*util/base64*' and '*util/events*'.
* **inputs**: edition mode bug fixed ([#112](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/112)) ([f19eba7](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/f19eba7))
* **o-table**: column header ordering icon state bug fixed. ([#116](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/116)) ([589f3a9](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/589f3a9))
* **o-table and cell renderers**: fixing ordering bugs ([#116](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/116)) ([589f3a9](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/589f3a9))
* **NumberService**: formatting bugs fixed. ([#116](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/116)) ([#117](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/117)) ([589f3a9](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/589f3a9))
* **o-table-cell-editor-combo**, **o-table-cell-renderer-service**: fixing service calls bugs ([#119](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/119)) ([eafff5c](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/eafff5c))
* **o-combo**: fixing value setting bugs ([#121](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/121)) ([a8a0eb2](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/a8a0eb2))
* **Template components**:
  * Fixing bugs in render image base64 and checkbox style in IE  ([2c13c29](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/2c13c2))
  * Updating icons in components with attribute mdSuffix ([6567e3](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/6567e3)
  * Fixing bugs of flex-layout in IE ([6567e3](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/6567e3)
* **OntimizeEE service**: logout bug fixed ([#124](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/124)) ([c341fc7](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/c341fc7))


## 2.0.0-rc.7 (2017-08-11)

### PEER-DEPENDENCY UPDATES ###
* **Updated**:  @ngx-translate/core@7.1.0
* **Updated**:  @ngx-translate/http-loader@1.0.2
* **Updated**:  @angular@4.3.3
* **Updated**:  @angular/cli@1.2.7
* **Updated**:  @angular/material@2.0.0-beta.8
* **Added**:    @angular/cdk@2.0.0-beta.8

### BREAKING CHANGES
* **o-form**: '*Mode*' enum is no longer available. Using static '*OFormComponent.Mode()*' method instead ([#103](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/103)) ([bcfc61d](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/bcfc61d))

### Features
* **o-form**: Adding '*onFormModeChange*' output ([#105](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/105)) ([721d570](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/721d570))
* **OTranslate**: Updating translate service according to '*ngx-translate*' version and adding testing methods on language change ([#109](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/109)) ([e37b0d8](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/e37b0d8))
* **o-form**: Adding '*setQueryMode*', '*setInsertMode*', '*setUpdateMode*', '*setInitialMode*' state checking methods.

### Bug Fixes
* **o-list**: Fixing bugs in list and inner renderers.
* **o-form**: Fixing bugs when inner component '*attr*' is undefined ([#107](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/107)) ([ce6bc93](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/ce6bc93))
* **o-list**: Filtering '*static-data*' bugs fixed ([#90](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/90)) ([6e58311](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/6e58311))
* **Form components**: Updating form data cache when changing inner components data with '*setValue*' method ([#80](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/80)) ([c92b1b8](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/c92b1b8))

## 2.0.0-rc.6 (2017-07-17)

### PEER-DEPENDENCY UPDATES ###
* **Updated**:  @angular/cli@^1.2.1

### Bug Fixes
* **OComponent**: fixing bugs in '*OComponent*' decorator.
* **providers**: fixing language initialization bugs.

## 2.0.0-rc.5 (2017-07-10)

### DEPENDENCY UPDATES ###
* **Added**:  colresizable@1.6.0
* **Added**:  datatables.net@^1.10.12
* **Added**:  datatables.net-buttons@^1.2.1
* **Added**:  datatables.net-colreorder@^1.3.2
* **Added**:  datatables.net-select@^1.2.0
* **Added**:  jquery@^3.0.0
* **Added**:  jquery-ui@^1.12.0
* **Added**:  pdfmake@^0.1.18
* **Added**:  moment@2.18.1

### PEER-DEPENDENCY UPDATES ###

* **Added**:    @angular/flex-layout@2.0.0-beta.8
* **Updated**:  @angular/material@2.0.0-beta.7
* **Updated**:  @angular@4.2.4
* **Updated**:  rxjs@^5.4.2
* **Updated**:  zone.js@^0.8.12,
* **Updated**:  reflect-metadata@0.1.10,
* **Updated**:  typescript@2.3.4
* **Removed**:  colresizable@1.6.0
* **Removed**:  datatables.net@^1.10.12
* **Removed**:  datatables.net-buttons@^1.2.1
* **Removed**:  datatables.net-colreorder@^1.3.2
* **Removed**:  datatables.net-select@^1.2.0
* **Removed**:  jquery@^3.0.0
* **Removed**:  jquery-ui@^1.12.0
* **Removed**:  pdfmake@^0.1.18
* **Removed**:  moment@2.18.1

### BREAKING CHANGES
* **FlexLayoutModule**: ([#34](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/34)) ([337143c](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/337143c)) adding angular '*FlexLayoutModule*'. This change makes necessary to change the following alignment attributes (only its name):
```javascript
  layout        ->  fxLayout
  layout-align  ->  fxLayoutAlign
  layout-fill   ->  fxFill
  flex          ->  fxFlex
```
**Note: '*layout-align*' input in '*o-row*' and '*o-column*' remains unchanged (it makes flex layout module update internally).

### Features
* **OValidators**: exporting '*OValidators*' class.
* **OServiceComponent**: adding '*getDataArray*' method ('*o-list*' and '*o-table*').
* **o-form**: adding '*getRequiredComponents*' method ([#76](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/76)) ([568abf6](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/568abf6))

### Bug Fixes
* **o-table**: bug in table reinitialization ([#101](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/101)) ([4b94bf3](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/4b94bf3))
* **OFormDataComponent**: bug when setting data ([#77](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/77)) ([11fb596](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/11fb596))
* **o-form**: bug when setting data ([#82](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/82)) ([b2bad20](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/b2bad20))

## 2.0.0-rc.4 (2017-06-23)

### Bug Fixes
* **o-table**: pagination bugs fixed.
* **o-app-header**: fixing flags icons bugs.

## 2.0.0-rc.3 (2017-06-22)

### Features
* **o-list-picker**: adding '*dialog-width*' and '*dialog-height*' inputs.
* **o-list-picker**: adding internal '*o-list-picker-theme*'
* **OTranslateService**: adding '*setAppLang*' method for app language initialization (before this point it was made with '*use*' method).
* **o-table-cell-renderer-boolean**: adding '*data-type*' input ([#97](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/97)) ([1fceee9](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/1fceee9))

### Bug Fixes
* **o-list-picker**: fixing styling bugs.
* **o-list**: listening to '*static-data*' changes.
* **o-table**: fixing general bugs ('*reloadData*', '*remove*' and footer text and buttons).
* **OTranslateService**: bugs in '*use*' method fixed.


## 2.0.0-rc.2 (2017-06-20)

### Features
* **LoginService**: adding '*logoutAndRedirect*' and '*logoutWithConfirmationAndRedirect*' methods.
* **Providers**: adding '*AppMenuService*' for standard menu definition, '*OUserInfoService*' for basic user info storage and  '*OModulesInfoService*' for modules communication.
* **Components**: adding '*o-user-info*', '*o-app-header*', '*o-app-sidenav*', '*o-app-sidenav-menu-group*', '*o-app-sidenav-menu-item*' and '*o-app-sidenav-image*' components.
* **Layouts**: adding standard app layout ('*o-app-layout*') component definition.
* **Config**: adding new configurable properties to app general '*Config*' object: '*applicationLocales*' (available in '*app-header*') and '*appMenuConfiguration*'.
* **o-table-column**: adding '*class*' input.
* **o-list-item-avatar**: adding '*avatar-type*' and '*empty-avatar*' inputs.

### PEER-DEPENDENCY UPDATES ###
* **Updated**:   @angular/material@2.0.0-beta.6
* **Updated**:   @ngx-translate/core@7.0.0
* **Updated**:   @ngx-translate/http-loader@0.1.0
* **Updated**:   moment@2.18.1

### BREAKING CHANGES
* **OComponent**: Changing '*OComponent*' components base class for '*OBaseComponent*'.

### Bug Fixes
* **OTranslateService**: translate service bugs at first app load ([#91](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/91)) ([82edcd9](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/82edcd9)) ([b79d1fd](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/b79d1fd))
* **o-list**: listening to '*static-data*' changes ([#89](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/89)) ([b267c51](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/b267c51))


## 2.0.0-rc.1 (2017-06-06)

### BREAKING CHANGES
* **OntimizeWebModule**: Removing '*forRoot*' method.
* **Providers**: Removing declaration of providers done in '*OntimizeWebModule.forRoot*' method. Now exporting '*ONTIMIZE_PROVIDERS*' array containig all default module providers. Also exporting '*APP_CONFIG*' provider. Example of framework providers use:
* **Modules**: Exporting '*ONTIMIZE_MODULES*' array of common modules that should be imported in app module.

```javascript
[...]
import {
  APP_CONFIG,
  ONTIMIZE_PROVIDERS,
  OntimizeWebModule
} from 'ontimize-web-ng2';

import { CONFIG } from './app.config';

[...]

@NgModule({
  imports: [
    [...]
    ONTIMIZE_MODULES,
    OntimizeWebModule,
    [...]
  ],
  [...]
  providers: [
   { provide: APP_CONFIG , useValue: CONFIG },
   ...ONTIMIZE_PROVIDERS
   [...]
  ],
  [...]
})
[...]
```

## 2.0.0-rc.0 (2017-05-30)

### Features
* **Module**: Defining framework as a ngModule ('*OntimizeWebModule*') that includes all components, directives and providers.
* **Styles**: Adding pre-built themes '*deeppurple-amber*', '*indigo-pink*', '*pink-bluegrey*' and '*purple-green*' loaded in '*$theme*' var.
  Example of theme import: '*@import 'node_modules/ontimize-web-ng2/ontimize/components/theming/indigo-pink.scss';*'
* **entryComponents**: Including '*ODialogComponent*' in '*OntimizeWebModule*'. User will no longer need to include '*ODialogComponent*' on its module '*entryComponents*'.
* **OServiceComponent**: exporting '*OServiceComponent*' class from which '*o-table*' and '*o-list*' extends ([#83](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/83))
* **o-table**: adding '*onClick*' output ([#84](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/84)) ([c9966a0](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/c9966a0))


### PEER-DEPENDENCY UPDATES ###
* **Updated**:   @angular/material@2.0.0-beta.5
* **Updated**:   @angular@4.1.2
* **Updated**:   @angular/router@4.1.2
* **Updated**:   zone.js@0.8.10
* **Added**:     @angular/animations@4.1.2
* **Added**:     @angular/compiler-cli@4.1.2
* **Added**:     @angular/cli@1.0.6
* **Added**:     @angular/platform-server@4.1.2
* **Added**:     @ngx-translate/core@6.0.1
* **Added**:     @ngx-translate/http-loader@0.0.3
* **Added**:     typescript@2.2.0
* **Removed**:   ng2-translate@5.0.0
* **Removed**:   systemjs@0.19.38

### BREAKING CHANGES
* **Styles**: Updating styles for ([@angular/material@2.0.0-beta.5](https://github.com/angular/material2/blob/master/CHANGELOG.md))
* **Directives**: Removing '*ONTIMIZE_DIRECTIVES*' export. User will no longer need to import this declarations on its module. This directives are now included in '*OSharedModule*' that is also included in '*OntimizeWebModule*'.
* **Modules**: Removing '*ONTIMIZE_MODULES*' export. This modules are now included in '*OntimizeWebModule*'. User will no longer need to import this modules on its module.
* **Providers**: Removing '*ontimizeProviders*' export. User will no longer need to call this function on its module. Declaration of providers is now done with '*OntimizeWebModule.forRoot({ config: CONFIG })*' module import.

### Bug Fixes
* **o-integer-input**: setting value bug ([#88](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/88)) ([167af16](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/167af16))
* **o-table**, **o-list**: empty collection when error occurs ([#93](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/93)) ([4815e6b](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/4815e6b))

## 1.2.3  (2017-03-31)
### Bug Fixes
* **o-form**, **o-table**, **o-list**: fixing '*reinitialize*' serious bug.
* **o-form**: Empty form fields value bug fixed. Updating '*getAttributesValuesToUpdate*' method.


## 1.2.2  (2017-03-31)

### Features
* **o-form**, **o-table**, **o-list**: adding '*reinitialize*' method ([#71](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/71)) ([d8af657](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/d8af657))
* **interfaces**: adding '*OFormInitializationOptions*', '*OTableInitializationOptions*' and '*OListInitializationOptions*' interfaces that must implement the arguments in '*reinitialize*' method ([#71](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/71)) ([d8af657](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/d8af657))

### BREAKING CHANGES
* **o-form**: Changing '*getAttributesToQuery*', '*getAttributesValuesToUpdate*', '*getAttributesValuesToInsert*' and '*getAttributesSQLTypes*' methods visibility to public.
* **o-form**: Changing '*onFormInitStream*' and '*onUrlParamChangedStream*' emmiters visibility to public.
* **o-form**: Changing '*urlParams*' property visibility to public.

### Bug Fixes
* **o-table**: Rendering empty table when result data is empty ([#70](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/70)) ([34ff7a7](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/34ff7a7))
* **o-list**: Rendering empty list when result data is empty ([#72](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/72)) ([74047bd](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/74047bd))
* **o-form**: Empty form fields value bug fixed ([#73](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/73)) ([741f609](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/741f609))

## 1.2.1 (2017-03-27)

### Features
* **o-form**: Adding attribute '*layout-fill*'.
* **o-form**: Adding attribute '*stay-in-record-after-edit*' ([#65](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/65)) ([600437f](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/600437f))
* **o-table**: updating '*static-data*' when '*insert-table*' is true([#64](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/64)) ([c98709c](https://github.com/OntimizeWeb/ontimize-web-ng2/commit/c98709c))
* **o-form**: Adding '*isInQueryMode*', '*isInInsertMode*', '*isInUpdateMode*', '*isInInitialMode*' state checking methods.
* **o-form**: Adding support for inner '*o-dynamic-form*' component.

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


