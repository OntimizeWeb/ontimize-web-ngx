## 3.0.0-rc.1
### Dependencies
* **New**: ng2-tree@2.0.0-rc.11

### Features
* **OFormServiceComponent**: ('*o-combo*' and '*o-list-picker*' extends this class) adding '*getSelectedRecord*' method for getting the selected value associated data. This is a object including all the properties definied in the '*columns*' input ([e513805](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/e513805)) ([#162](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/162))
* **OServiceComponent**: ('*o-list*' and '*o-table*' extends this class) double click mode (used in '*detail-mode*' and '*edition-mode' input) allows '*dblclick*' and '*doubleclick*' values.
* **Codes**: Creating '*codes*' util class for general variables and types definitions ([9e20235](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/9e20235)) ([d2f2060](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/d2f2060))
* **o-tree**: new '*o-tree*' component ([6b1e524](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/6b1e524))

### BREAKING CHANGES
* **o-table**: Removing the option for showing all table records in the paginator ([f448bfa](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f448bfa))
* **o-table**: Removing (unused) '*editable-columns*' input.


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

## 2.1.3 (2018-18-04)
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


