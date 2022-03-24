## 8.6.0
### Features:
  * **o-password-input**: added a new atribute `show-password-button` to add the option to show the plain text instead of dots ([d4b1cb81ee3cf197dc771bd5229be31e95d7f0fa](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/d4b1cb81ee3cf197dc771bd5229be31e95d7f0fa)) Closes [#798](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/798)
  * **o-list**: added pagination ([4cdb80c](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/4cdb80c)) Closes [#861](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/861)

## 8.5.10 (2022-03-21)
### Feature
  * **app-menu-config**: new `pathMatch` attribute in `MenuItemRoute` ([c51fb374](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/c51fb374)) Closes [#919](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/919)
### Bug fixes
* **o-button**:
  * `o-button` type `BASIC`,`FLAT`, `FAB` and `MINI-FAB` have incorrect width ([b6675a5](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/b6675a5)) Closes [#915](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/915)
  * Fixed bug that `icon-position` does not work ([3b31292](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/3b31292))  Closes [#917](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/917)

## 8.5.9 (2022-03-16)
### Feature
  * **o-grid**, **o-list**: new attribute `show-buttons-text` ([c1d2336](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/c1d2336))
  * **o-form**:  Added the CSS class `fill-form` ([8d0461d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/8d0461d))

### Bug fixes
  * **o-app-header**: fixed bug that the menu icon disappeared in mobile mode ([55648e3](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/55648e3)) Closes [#899](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/899)
    * Fixed reported bugs by Sonar ([24211d7](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/24211d7))
    ** `alt` attribute of images
    ** css duplicated entries
    ** table `aria-describedby` attribute
    * **o-table**: fixing `filter-case-sensitive` input parsing and state storage bug ([3f320e49](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/3f320e49)) Closes [#903](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/903)
  * **o-grid**: Fixed that displays 'show more' button when the data length is 0 ([e35422b](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/e35422b))
  * **UX modifications**
    * **o-mat-menu**: Reseted min-height propertie in class o-mat-menu  ([4cfe8c5](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/4cfe8c5))
    * **o-app-layout**: Fixed arrow icon position in the menu ([61d5568](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/61d5568))
    * **o-form-toolbar-button**: Setting margin to 8px in the content ([045cb86](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/045cb86))
    * **o-button**: Fixed line-height in stroked button([005e9ae](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/005e9ae))
  * **o-form-layout-manager o-table o-list o-grid AbstractOServiceBaseComponent**: Fixing state service injection ([05b16f2c](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/05b16f2c)) Closes [#908](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/908)
  * **o-form-layout-manager**: protecting tabgroup initialization code ([b8cd35ca](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/b8cd35ca)) Closes [#884](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/884)
   * **OServiceBaseComponent**, **o-form-layout-manager**: no longer saving component state in component `onDestroy` method ([b8cd35ca](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/b8cd35ca)) Closes [#884](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/884)

## 8.5.8 (2022-02-23)
### Features
  * **o-search-input**: changed style to match `o-table-quickfilter` style ([96fd895](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/96fd895)) Closes [#890](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/890)
  * **o-list**, **o-grid**: new attribute `quick-filter-appearance` ([96fd895](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/96fd895)) Closes [#890](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/890)

### Bug fixes
  * **o-table**: protecting code ([00db7717](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/00db7717)) Closes [#892](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/892)
  * **o-date-input**: fixing `min` and `max` inputs bug ([a0b6d55c](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/a0b6d55c)) Closes [#891](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/891)

## 8.5.7 (2022-02-11)
### Features
  * **o-app-layout**, **o-app-header**: new attribute `static-title` ([f693bdb](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f693bdb)) Closes [#880](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/880)
  * **o-app-layout-header**: added a position attribute for `o-app-layout-header` custom elements ([ecd9848](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/ecd9848)) Closes [#879](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/879)
  * **o-app-sidenav**: modified the position of the `o-app-layout-sidenav-projection-end` to appear in the footer ([42ce709](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/42ce709)) Closes [#878](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/878)

### Bug fixes
  * **o-form**: navigation problem inside a `o-form-layout-manager` in tab mode when `after-insert-mode="detail"` ([f1d84030](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f1d84030)) Closes [#800](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/800)
  * **o-list**: Fixed error that prevents the correct operation of the detail of a list ([c49b186](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/c49b186)) Closes [#877](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/877)
   * **o-table**: Fixed error of not keeping selected rows ([92e530a](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/92e530a)) Closes [#881](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/881)
   *
## 8.5.6 (2021-12-20)
### Features
  * **o-button**: Added a new output for click (onClick) ([dbb97ec](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/dbb97ec)) Closes [#864](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/864)

### Bug fixes
  * **o-table**: Fixed error of not maintained column order changes after the application is reloaded ([30c1b332](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/30c1b332)) Closes [#860](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/860)
  * **o-button**: Fixed the problem that prevents button click event propagation when it was disabled ([dbb97ec](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/dbb97ec)) Closes [#863](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/863)
  * **o-form-layout-manager**: Fixed the problem that shows a dialog after insert new data ([2ea7a448](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/2ea7a448)) Closes [#859](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/859)
  * **o-list**: o-list selected items bug fixed ([7c453f39](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/7c453f39)) ([41721730](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/41721730)) ([c5297fa7](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/c5297fa7)) ([5403eff7](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/5403eff7)) ([ddc43a3d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/ddc43a3d)) ([6c43b934](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/6c43b934)) ([5e3dc3eb](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/5e3dc3eb)) Closes [#851](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/851)

## 8.5.5 (2021-11-26)
### Bug fixes
  * **o-list**: Fixed issue preventing query-rows from working properly ([74af8920](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/74af8920)) Closes [#847](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/847)
  * **o-error-dialog-manager.service**: added new service that handles error messages dialogs to solve the problem of opening multiple error dialogs([45c9dcbe74505f371a2d47cb0d786ee97c79b20a](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/45c9dcbe74505f371a2d47cb0d786ee97c79b20a)) Closes [#845](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/845)
  * **o-table**: fix error of selectable rows not beeing marked on filter data([770002e](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/770002e)) Closes [#846](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/846)

## 8.5.4 (2021-11-05)
### Bug fixes
  * **o-combo**: added new atribute `null-selection-label` to add a text to none selection in a combo ([99c2cf70](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/99c2cf70)) Closes [#812](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/812)
  * **o-table**: Avoid blinking no results message ([fd13799](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/fd13799)) Closes [#820](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/820)
  * **o-table**: added new input `show-expandable-icon-function` to make changes on expandable-row ([3225048](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/3225048)) Closes [#811](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/811)
  * **o-list**: Fixing selection model bugs ([1f0eabd](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/1f0eabd)) Closes [#817](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/817)

## 8.5.3 (2021-10-26)
### Features:
  * **o-app-layout**, **o-app-header**: new attribute `show-title` ([d865f4d4](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/d865f4d4)) Closes [#813](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/813)

### Bug fixes
* **o-time**: fix bug when click the clear button the field shows today's date and time ([c843876](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/c843876)) Closes [#806](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/806)
* **o-table**: emit event `onDataLoaded` when load static data Closes ([9a7ac9a](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/
9a7ac9a)) ([163387c](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/163387c)) [#717](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/717)
* **o-grid, o-list**: fixed bug that the o-grid does not filter when there is a previous value with static data  ([0a676bc](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/0a676bc)) Closes [#819](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/819)
* **o-table**: fixing selection model bug when removing rows ([2b33ff14](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/2b33ff14)) [#697](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/697)
* **o-form-layout-manager**: fixing navigation bugs ([b87df174](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/b87df174)) [#823](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/823)

## 8.5.2 (2021-10-15)
### Features
  * **o-table**:
    * Improved the perfomance of grouped table when it contain large amounts of data ([b8d0b03](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/b8d0b03)) ([38c3d24](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/38c3d24)) ([b1a3f7d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/b1a3f7d)) Closes [#785](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/785)

### Bug fixes
* **o-table**:
  * **OBaseTableCellEditor**: fixing insertable row editor bug ([029632b0](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/029632b0)) Closes [#790](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/790)
  * Fix the bug that the column sorting does not work in the table with row grouping ([d150386](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/d150386)) Closes [#789](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/789)
  * Fix the bug when using aggregate column and select-all-checkbox-visible='yes' on o-table  ([9eca7dd](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/9eca7dd)) Closes [#729](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/729)
  * **o-table-column**: adding missing `translate` input ([ad081513](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/ad081513)) Closes [#768](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/768)
  * **o-table-cell-renderer-service**: setting translation pipe ([ad081513](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/ad081513)) Closes [#768](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/768)
* **oCurrency, oReal, oInteger, oPercent pipes**: `number.service` parsing bug fixed ([dc0b5094](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/dc0b5094)) Closes [#776](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/776)
* **o-app-layout**: display app header title after reloading the page ([0d92a54](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/0d92a54)) Closes [#784](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/784)
* **o-bar-menu**: make locale items change application language ([54e30a45](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/54e30a45)) Closes [#726](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/726)

## 8.5.1 (2021-09-30)
### Features
* **Util**: adding new `wrapIntoObservable` method ([1c7523c2](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/1c7523c2))
* **OFormLayoutManager**: new `hasToConfirmExit` method ([7c4dc447](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/7c4dc447))
* **o-table**:
  * alignment on aggregate column heading with same default column type alignment ([5bfa41d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/5bfa41d))([4adeb84](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/4adeb84)) Closes [#740](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/740)
  * new `context-menu` input ([04ffbe69](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/04ffbe69))

### Bug fixes
* **o-table**:
  * Fix bug in row grouping when collapsing row groups makes columns aggregate have a wrong value ([b4920cd](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/b4920cd)) Closes [#741](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/741)
  * Fix bug when open a detail with o-form-layout-manager  ([f5612a4](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f5612a4)) Closes [#751](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/751),[#752](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/752)
  * Fix the bug that the table is displayed blank when navigating the mat tab group and virtual scrolling is enabled([6327825](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/6327825)) Closes [#751](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/751)
  * Fix the bug that the virtual scrolling works abnormally sometimes ([3b7d0ca](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/3b7d0ca)) Closes [#760](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/760)
  ontimize-web-ngx/issues/751)
  * Fix the bug when `title` attribute is defined in `o-table-column` and it does not show the translated value in o-table-context-menu ([c259570](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/c259570)) Closes [#766](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/766)
  * Fixing `expand-groups-same-level` input bug ([edd9e787](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/edd9e787)) Closes [#746](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/746)
  * Fixing the bug in the column filtering modal when using a custom renderer ([4f878d8](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/
4f878d8)) Closes [#777](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/777)

* **o-form-layout-manager**: Fix layout manager on tab mode after refreshing page ([298fce](https://github.com/OntimizeWeb/ontimize-web-ngx/pull/769/commits/298fce)) Closes [#753](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/753)


### BREAKING CHANGES
* Changes made to solve [#745](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/745) and [#754](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/754) ([d1829ef](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/d1829ef)) ([7c4dc447](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/7c4dc447)). This changes will be transparent to user.
  * **o-form-layout-manager**, **OFormLayoutManagerMode**: `setModifiedState` method arguments updated
  * **OFormNavigationClass**:
    * `setModifiedState` method is now protected
    * `suscribeToCacheChanges` method has no arguments now
  * **OFormCacheClass**: `onCacheEmptyStateChanges` emmiter no longer exists
  * **OFormLayoutManagerMode**: `canAddDetailComponent` method now can also return an Observable
  * **OFormLayoutManager**: `canAddDetailComponent` now returns an Observable
* **o-table**:
  * Bundle prefix for `o-table-columns-grouping-column` default title prefix has changed from 'AGGREGATE_FUNCTION' to 'AGGREGATE_TITLE' ([a94d7b6a](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/a94d7b6a))

## 8.5.0 (2021-09-09)
### We are restyling **OntimizeWeb**
We are implementing different modifications in **OntimizeWeb** in order to improve the design of the framework. Closes [#623](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/623)
* **o-table**:
  * Added the badge in the quickfilter that indicates the number of filtering columns ([fb80778](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/fb80778))
  * Attribute `filter-column-active-by-default` has changed its default value. Now is activated by default ([8e97d53](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/8e97d53))
* **o-app-header** : New attribute `header-height` ([fd06479](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/fd06479))
* All OntimizeWeb menus now have the CSS class `o-mat-menu` that modifies the menu items height ([e0aa722](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/e0aa722))

### Features
* **o-form-layout-tabgroup-options**: New attribute `max-tabs` ([9d78d40](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/9d78d40)) Closes [#694](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/694)
* **OFormServiceComponent** (**o-combo**, **o-list-picker**, **o-radio**) ([e92a78e5](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/e92a78e5)) Closes [#706](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/706)
  * New `refresh` method
  * A context menu has been added for showing a reload option
* **o-table** ([2f5b2bb9](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/2f5b2bb9)) Closes [#620](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/620)
  * Showing all the available values after the first configuration of a column filter
  * **OColumnValueFilter**: adding `availableValues` to stored filter properties
* **o-app-layout-sidenav**: Add multilevel navigation. Building more than 3 levels is **not recommended** ([4daab8d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/4daab8d)) ([6cbbaa9](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/6cbbaa9))  Closes [#709](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/709)
* **o-form**: New attribute `ignore-default-navigation`. ([d59d6ebb](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/d59d6ebb)) Closes[#732](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/732)

### Bug fixes
* **o-table**:
  * Fix bug when `select-all-checkbox-visible` is active. ([b88be9b](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/b88be9b)) Closes [#714](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/714)
  * **OTableQuickfilter**: Remove no searchable columns from query. ([03fd5d6](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/03fd5d6)) Closes [#721](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/721)
* **o-form-layout**:
  * Show change mark in the tab whose detail is modified. ([1eea210](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/1eea210)) Closes [#715](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/715)
  * Hide spinner when form layout manager has multiple tabs opened and the page is reloaded. ([6823e10](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/6823e10)) Closes [#733](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/733)
  * Protect navigation when the application navigation history is empty. ([35ae9b8](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/35ae9b8)) Closes [#727](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/727)
  * Show `new` label in form layout tab after reload the application. ([07619df](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/07619df)) Closes [#736](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/736)

### BREAKING CHANGES
* OntimizeWeb theme now defines its ows configuration that modifies angular maetrial's typography, if you are using OntimizeWeb material theme you should provide the typograhy defined by OntimizeWeb in the following way:
  ```css
  @import 'node_modules/ontimize-web-ngx/theme.scss';
  @include o-material-theme($theme, $default-typography);
  ```
* **o-app-layout**:
    * Default value of attribute `show-header` has been changed to `true` ([2557184](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/2557184))
  * **o-app-layout-sidenav**: ([2fc889e](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/2fc889e))
    * h3 tag has been remove in `o-app-sidenav-menu-group` component
    * Added the CSS classes `o-app-sidenav-menu-group-level-1`, `o-app-sidenav-menu-group-level-2`, `o-app-sidenav-menu-group-level-3`, `o-app-sidenav-menu-group-level-4` and `o-app-sidenav-menu-group-level-5`
  * **o-app-sidenav-menu-group**: CSS class `active` has been removed ([4b28033](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/4b28033))
* **o-table**:
  * **o-table-visible-columns-dialog**: CSS class `description` has been replaced by `mat-subheader` ([a6fe1e3](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/a6fe1e3))
  * **o-dual-list-selector**: CSS class `o-dual-list-selector-description` has been replaced by `mat-subheader` ([ae0c953](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/ae0c953))
* **o-listpicker**: CSS class `title-container` has been replaced by `mat-dialog-title` ([a6fe1e3](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/a6fe1e3))
* **o-button**: Types `BASIC`, `RAISED`, `STROKED` and `FLAT` now have CSS properties `height` set to `32px` and `min-width` set to `112px` ([2668232](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/2668232))
* All dialog buttons now have `min-width` CSS property set to `104px` ([aeeacd4](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/aeeacd4))

## 8.4.1 (2021-08-03)
### Features
* **o-form**: new attribute `ignore-on-exit`, ignores form fields changes when closing a form. ([695](https://github.com/OntimizeWeb/ontimize-web-ngx/pull/695)) Closes [#663](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/663)
* **o-time-input**: new `value-type` and `value-format` inputs ([b7b4d24](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/b7b4d24)) Closes [#693](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/693)

### Bug fixes
* **o-table-quickfilter**: fixing ExpressionChangedAfterItHasBeenCheckedError errors ([bc78f3a](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/bc78f3a)) Closes [#670](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/670)
* **o-form-service-component.class**, **o-combo**, **o-listpicker**: fixing setFieldValues method error ([3e9fe3b](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/3e9fe3b)) Closes [#675](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/675)


## 8.4.0 (2021-07-23)
### Features
* **AbstractOServiceBaseComponent**: component now looks for parent keys values in route params if form is not present ([658](https://github.com/OntimizeWeb/ontimize-web-ngx/pull/658)) Closes [#634](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/634)
* **o-table**:
  * Adding new warn message when user wants to hide a column with an active filter or sorting. ([#628](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/628)) ([c413ece](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/c413ece))
  * Adding new optional parameter (indicating the columns attr to clean filters) to the `clearColumnFilters` method. ([#628](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/628)) ([c413ece](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/c413ece))
  * Adding new optional parameter (indicating the new sort columns) to the `reinitializeSortColumns` method and changing its access level to public.([#628](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/628)) ([c413ece](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/c413ece))
  * **o-table-cell-editor-email**: new component for email cell editors([6fdf754](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/6fdf754))
  * Adding virtual scroll ([#598](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/598)) ([e14c424](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/e14c424) ([238da22](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/238da22)) ([b5668c3](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/b5668c3)) ([4cabf1a](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/4cabf1a)) ([59e7684](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/59e7684))

    *NOTE*
      * The virtual scrolling and the table tooltip are incompatible due to a recognized bug in Angular library ([#686](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/686)), if you want the tooltip functionality on the table, you must deactivate virtual scrolling as follows `virtual-scroll = no` because it is actived by default
      * It has been set min-height='400px' in o-table by default, you can modify the height table in .o-table class

  * Added validators functionality to cell editors and insertable row ([4d66853](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/4d66853)) Closes [#517](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/517)
  * Row grouping new features [#597](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/597):
    * **o-table-columns-grouping**: new `o-table` inner component used to configure the row grouping columns
    * **o-table-columns-grouping-column**: new `o-table-columns-grouping` inner comopnent used to configure the grouping features of a specific column

* **OTableDataSource**: adding new optional parameter (indicating the columns attr to clean filters) to the `clearColumnFilters` method ([#628](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/628)) ([c413ece](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/c413ece)).



### Bugfix
* **o-table**:
  * Cannot read property 'onChange' of undefined in oTableExpandedFooter directive ([9b853f8](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/9b853f8)) Closes [#668](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/668)

### BREAKING CHANGES
* **o-table**: `fixed-header` value `no` has been replaced by `yes` ([aa53bd8](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/aa53bd8))

## 8.3.1 (2021-06-24)
### Features
* **o-search-input**: new `options` optional argument in `setValue` method ([01a12ba](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/01a12ba)
* **o-grid**: new `pageSizeChanged` and `sortColumnChanged` methods ([#643](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/643)) ([01a12ba](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/01a12ba))
* **AbstractOServiceComponent**: ([#640](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/640)) ([01a12ba](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/01a12ba))
  * New `filterData` and `setData` common methods defintions (used in `o-list` and `o-grid`, overrided in `o-table`)
  * New `getQuickFilterDataFromArray`, `getSortedDataFromArray`, `getPaginationDataFromArray` and `parseResponseArray` methods
  * `onDataLoaded` and `onPaginatedDataLoaded` common outputs variables definition (removed from `o-list`, `o-grid` and `o-table`)
* **o-table**: New attribute for o-table default-visible-columns to set the initial visible columns ([9891e29](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/9891e29)) Closes [#647](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/647)

### Bug Fixes
* **o-grid**: adding `registerQuickFilter` method extension ([#640](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/640)) ([17a3263](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/17a3263))
* **o-list**: fixing `sort-columns` initialization error ([#639](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/639)) ([01a12ba](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/01a12ba))
* **OGridComponentStateService, OListComponentStateService**: storing missing properties ([#640](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/640)) ([01a12ba](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/01a12ba))
* **o-table**:
  * Quickfilter glass icon position and placeholder color ([f5245fd](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f5245fd)) Closes [#641](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/641)
  * Update *No results* message with quick filter value ([c3bb839](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/c3bb839)) Closes [#638](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/638)

## 8.3.0 (2021-06-16)
### Features
* **o-form-layout-manager**: new `split-pane` mode.
* **OFormLayoutManagerMode**: new interface that every new `o-form-layout-manager` mode must implement.
* **OFormLayoutSplitPaneOptionsDirective**: new directive for using the `split-pane` mode inputs.
* **OBaseTableCellRenderer**:
 * new `getFilterExpression` method ([#630](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/630)) ([0866de1](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/0866de1))
* **o-table-cell-renderer-service**:
 * adding `value-column-type` attribute and `queryAllData` method ([#630](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/630)) ([0866de1](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/0866de1))
* **o-table-quickfilter**: new `placeholder` input ([#635](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/635)) ([f79fab4](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f79fab4))
* **OServiceComponent**: new `quick-filter-placeholder` input ([#635](https://github.com/OntimizeWeb/ontimize-web-ng2/issues/635)) ([f79fab4](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f79fab4))

### BREAKING CHANGES
* The authentication has been refactored:
  * Service `LoginService` has been removed and replaced by `AuthService`. This is an abstract service that provides basic functionality regarding authentication. Its default implementation is `OntimizeAuthService` class that performs authentication with Ontimize based backends. Developers can provide their own implementation using the Injection Token `O_AUTH_SERVICE` and the class of their service that extends `AuthService` class.
  * Interface `ILoginService` has been removed, use abstract class `AuthService` instead.
  * Method `sessionExpired` from old `LoginService` has been renamed to `clearSessionData` in `AuthService`.
  * Method `redirectLogin` has been removed in class `OntimizeBaseService` and all its subclasses (`OntimizeService`, `OntimizeEEService`, `OntimizeExportService` and `OntimizeFileService`), use method `logout` from `AuthService` instead.
  * Method `redirectLogin` has been removed in class `ServiceUtils`, now it is a method of Ontimize authentication implementation in `OntimizeAuthService`.
* **o-service-component.class**:
  * Method `initializeState` no longer exists. This change will only affect to extended components which have overrided or extended this method.
* **o-form-layout-manager**:
  * Methods `getFormCacheData`, `setModifiedState` and `closeDetail` no longer has the `id` argument.
  * Method `updateNavigation` changed the `id` argument for the `keyValues` (object that contains the form keys values) argument.
  * This changes will only affect to applications which have extended the `OFormLayoutManagerComponent` and have overrided or extended the affected methods.
  * The following inputs have been deprecated: `title`, `title-data-origin`, `label-columns`, `separator`, `dialog-width`, `dialog-min-width`, `dialog-max-width`, `dialog-height`, `dialog-min-height`, `dialog-max-height` and `dialog-class`. User should use the option inputs.
* **OFormLayoutDialogOptionsComponent, OFormLayoutTabGroupOptionsComponent**:
  * This components no longer exists. Both components have been refactored into two directives: `OFormLayoutDialogOptionsDirective` and `OFormLayoutTabGroupOptionsDirective`.
  * This change is transparent to the user, now the `o-form-layout-manager` mode inputs can be setted in two ways: using the mode option tag (the same way `o-form-layout-dialog-options` or `o-form-layout-tabgroup-options` were used before) or including the mode inputs in the `o-form-layout-manager` tag.

  ```javascript
  <o-form-layout-manager mode="tab" attr="o-form-layout-customer-home"
   title="CUSTOMERS" label-columns="SURNAME;NAME" separator="," icon="info" color="warn">

  ...

  </o-form-layout-manager>
  ```

  Is equivalent to:

   ```javascript
  <o-form-layout-manager mode="tab" attr="o-form-layout-customer-home">

    <o-form-layout-tabgroup-options color="accent" title="CUSTOMERS"
      label-columns="SURNAME;NAME" separator="," icon="info" color="warn">
    </o-form-layout-tabgroup-options>

    ...

  </o-form-layout-manager>
  ```
* The service components hierarchy has been changed, now using abstract classes.
  * New `OServiceBaseComponent` hierarchy:
    * New `AbstractOServiceBaseComponent<T extends AbstractComponentStateService<AbstractComponentStateClass>>`.
    * New `DefaultOServiceBaseComponent` default implementation of `AbstractOServiceBaseComponent` using the `DefaultComponentStateService`.
    * `OServiceBaseComponent` keeps existing to have backwards compatibility, its equals to the `DefaultOServiceBaseComponent`.
  * New `OServiceComponent` hierarchy:
    * New `AbstractOServiceComponent<T extends AbstractComponentStateService<AbstractComponentStateClass>>` extending `AbstractOServiceBaseComponent<T>`.
    * `OServiceComponent` keeps existing to have backwards compatibility, its a default implementation of `AbstractOServiceComponent` using the `DefaultComponentStateService`.
  * If you have a component extending `OServiceBaseComponent` or `OServiceComponent` it should keep working as usual.
  * If you have a component extending a `o-table`, `o-list` or `o-grid` you have to add its own component state service to the providers array:
    * `o-table`:
      ```javascript
        providers: [
          ...
          { provide: AbstractComponentStateService, useClass: OTableComponentStateService, deps: [Injector] }
          ...
        ]
      ```
    * `o-list`:
      ```javascript
        providers: [
          ...
          { provide: AbstractComponentStateService, useClass: OListComponentStateService, deps: [Injector] }
          ...
        ]
      ```
    * `o-grid`:
      ```javascript
        providers: [
          ...
          { provide: AbstractComponentStateService, useClass: OGridComponentStateService, deps: [Injector] }
          ...
        ]
      ```

### Bug Fixes
* **o-table**: fixing header sort bug ([794210d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/794210d)) Closes [#629](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/629)

## 8.2.5 (2021-05-26)
### Features
* **o-image**: New attribute `max-file-size`. ([d8a84c0](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/d8a84c0)) Closes [#589](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/589)
* **o-table**: adding new optional `clearSelectedItems` (defaults to true) argument to `reloadPaginatedDataFromStart` and `reloadData` methods ([1aa26ec](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/1aa26ec))

### Bug Fixes
* **o-list-picker, OFormDataComponent**: checking if the component has the appropriate permissions to execute the `setEnabled` method ([40089da](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/40089da)) Closes [#607](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/607)
* **o-list-picker**:
  * fixing initialization errors ([954b8b2](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/954b8b2)) Closes [#615](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/615)
  * fixing renderers errors ([dba5a11](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/dba5a11)) Closes [#616](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/616)
* **o-combo**: fixing renderers errors ([9d4b5de](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/9d4b5de)) Closes [#612](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/612)
* **o-table**: solving filters storage bugs ([1aa26ec](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/1aa26ec)) Closes [#606](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/606)

### BREAKING CHANGES
* **oLocker**: Default `oLockerMode` is set to 'load' ([40089da](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/40089da))
* **o-list-picker**:
  * `getListPickerValue` method now receives the entire record object ([dba5a11](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/dba5a11))
  * `getRenderedValue` method no longer exists (this shouldn't affect the user) ([dba5a11](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/dba5a11))
* **o-table**:
  * The following changes should not affect the user unless it was specifically using the following properties ([1aa26ec](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/1aa26ec))
  * `showFilterByColumnIcon` and `originalFilterColumnActiveByDefault` properties no longer exists.
  * new `isColumnFiltersActive` property.
  * deleting arguments from `onFilterByColumnChange` EventEmitter (retrieve same value using dataSource.getColumnValueFilters())

## 8.2.4 (2021-04-30)
### Bug Fixes
* **oCurrency, oReal, oInteger, oPercent**: pipes don't update the format of values when language is changed ([a9343d0](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/a9343d0)) Closes [#566](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/566)

* **OTranslateHttpLoader**: Remote bundle request: do not parse error object as translations ([4670659](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/4670659)) Closes [#563](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/563)
* **o-table**:
  * **OBaseTableCellEditor**: fixing cell edition bug ([6eb72b2](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/6eb72b2)) Closes [#571](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/571)
  * **oTableColumnAggregate**: Aggregate column is not updated on changing cell value ([de7e77c](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/de7e77c))
  * **o-table-cell-editor-time**: Fixed not set new value in table-cell-editor-time ([16ccf90](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/16ccf90))
  * **o-table-cell-editor-boolean**: fixing cell edition bug ([755daf4](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/755daf4)) Closes [#573](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/573)
  * Fixed prevent touch vertical and horizontal scrolling in table: ([e1b14d1](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/e1b14d1)) Closes [#576](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/576)
  * **o-table-row-expandable**: Fixed error when exporting table data ([98bdd0e](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/98bdd0e))

## 8.2.3 (2021-04-09)
### Features
* **o-form**: new output `onCancel` [b1711d7e](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/b1711d7e))

### Bug Fixes
* **o-slide-toggle**: does not display or submit the correct value in the detail form ([5986e3d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/5986e3d)) ([f534274](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f534274))
* **o-real-input**: ignore minimum decimal digits validation when value has lower precision ([1ee1fafc](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/1ee1fafc))

## 8.2.2 (2021-03-25)
### Features
* **validators**: new pattern validator ([7eded1c](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/7eded1c))
* **o-dialog**: Added classes in the buttons in dialog ([b107153](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/b107153))
* **OFormServiceComponent** (**o-combo**, **o-list-picker**, **o-radio**): new attribute `sort`, include `translate` attribute in `o-list-picker` ([7a7032bb](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/7a7032bb)) Closes ([#322](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/322))
* **o-table-row-expandable**: new `multiple` input ([fb4fb10](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/fb4fb10)) Closes ([#545](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/545))
* **o-combo**: new types of render (currency,integer,boolean,percentage,date,custom render) ([eabdd2d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/eabdd2d)) Closes ([#529](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/529))
* **o-list-picker**: new types of render (currency,integer,percentage,date,custom render) ([eabdd2d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/eabdd2d)) Closes ([#529](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/529))

### Bug Fixes
* **o-list**: use `sort-columns` attribute value on the first query ([3a0cf8a](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/3a0cf8a)) Closes ([#536](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/536))
* **o-slide-toggle**: fixed getValue function ([d386f4d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/d386f4d)) Closes ([#535](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/535))
* **o-table-row-expandable**: no expand button in row break example ([8e89988](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/8e89988)) Closes ([#541](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/541))

## 8.2.0 (2021-02-26)
### Features
* **table**:
  * Added row grouping ([078931b](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/078931b))
  * new class `OTableGroupedRow`([ed9607](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/ed9607))
  * `o-table-context-menu`:
    * added new sub-menu *Group by*.([ed9607](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/ed9607))
    * new interface **OnExecuteTableContextEvent**
  * `o-table-visible-columns-dialog`: Improved the usability and the appearance similar to other modals ([73b699d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/73b699d))
  * `o-table-columns-filter-column`:  Added new input start-view to set initial view in datepicker ([33a44c6](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/33a44c6)) Closes [#508](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/508)
  * Added columnName and cell properties in `OnClickTableEvent` interface ([7a4e783](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/7a4e783))([96e33b8](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/96e33b8))
* new component `o-dual-list-selector`([7eedc0d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/7eedc0d))
* new component `o-user-info-configuration` ([c6cac4b](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/7eec6cac4bdc0d))
* **o-app-layout**: new `header-color` input([52187ef](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/52187ef))
* **o-grid**:
  * added new button ([10c5bef](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/10c5bef))
  * new `insert-button-position` and `insert-button-floatable` inputs ([10c5bef](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/10c5bef))
* **o-date-range**: new attribute `mode` ([52fb863](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/52fb863)) Closes [#481](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/481)
* **o-percent-input**: new attribute `value-base` ([44becb6](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/44becb6)) Closes ([#513](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/513))

### Bug Fixes
* **o-input-file**: fixed `accept-file-type` value parser ([14c5bca8](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/14c5bca8))
* **OFormDataComponent**: Show input value when internal value is zero ([a7b2392](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/a7b2392))
* **OFormDataComponent**: Show clear button on inputs when internal value is zero ([512a8c3](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/512a8c3))
* **o-column**: Fix appearence outline when no title is displayed. ([664c518](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/664c518))
* **o-row**: Fix appearence outline when no title is displayed. ([664c518](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/664c518))
* **o-list-picker**: Fixed duplication of last value when search is side scrolling ([5529b03](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/5529b03))
* **language bundle**: Check if data exist on language bundle ([f2f8155](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f2f8155)) Closes [#444](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/444)
*  **o-combo**: fixing bug when data is null and multiple-trigger-label=true ([bbcbca1](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/d4065cdd)) Closes [#484](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/484)
* **o-hour-input**: Fix component styles ([cbb6a03](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/cbb6a03)) Closes ([#485](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/485))
* **o-table, OBaseTableCellEditor**: Ignoring keyboard events from outside a cell being edited. Also stopping active cell edition when table content has changed ([d888fad](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/d888fad)) Closes ([#523](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/523))

### BREAKING CHANGES
* **table**:
  * method `handleCellClick` has been removed, you have to use `handleClick` instead  ([0cc55af](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/0cc55af))
  * method `handleCellDoubleClick` has been removed, you have to use `handleDoubleClick` instead ([0cc55af](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/0cc55af))
  * Changed the parametres of the `handleDoubleClick` and `handleCellClick` methods ([e64dcc3](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/e64dcc3)) ([0cc55af](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/0cc55af))

## 8.1.1 (2020-11-25)
### Bug Fixes
* **table**: fixing bug in filtering by column ([88ac4bf](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/88ac4bf))

## 8.1.0 (2020-11-23)
### Features
* **icons**: Added sort_by_alpha, sort_by_alpha_asc and sort_by_alpha_desc icons in Ontimize Web ([edd8927](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/edd8927))
* **table**:
  * `o-table-filter-by-column`:
    * added clear button in the inputs of the customized filters  ([6fe1e33](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/6fe1e33))
    * added clear button in filter column dialog ([a67cdb4](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/a67cdb4))
  * reinitialize method: added new option 'filterColumns' ([361b8c1](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/361b8c1))
  * new component `o-table-columns-filter-column` ([f395b82](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f395b82))
  * new attribute `filter-column-active-by-default`([fccc41a](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/fccc41a))
  * new internal class `column-filter-icon-active` ([e94e465](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/e94e465))
  * new component `o-table-row-expandable` ([4452ca2](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/4452ca2))
  * new component `o-expandable-container` ([3036381](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/3036381))
  * new directive `o-table-custom-toolbar` for adding custom content to the table toolbar ([0fb3793](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/0fb3793))
  * added sort flags in column sorting and filtering ([7b54634](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/7b54634)) ([1ad49e0](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/1ad49e0))
  * new attributte `auto-adjust` ([d5adedb](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/d5adedb))

* **o-form**:
  * new public methods `back`, `closeDetail`, `reload`, `goInsertMode`, `insert`, `goEditMode`, `update`, `undo`, `delete` and `setData` ([e5c899d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/e5c899d), [f256e4a](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f256e4a)).
  * The following methods has been deprecated and will be removed in the future: `_backAction`, `_closeDetailAction`, `_reloadAction`, `_goInsertMode`, `_insertAction`, `_goEditMode`, `_editAction`, `_undoLastChangeAction`, `_deleteAction` and `_setData` ([e5c899d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/e5c899d), [f256e4a](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f256e4a)).
* **button**:
  * new attribute `enabled` ([534c2a6](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/534c2a6))
  * new attribute `color` ([1326002](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/1326002))

### BREAKING CHANGES
* **table**:
  * `onClick` event return `onClickTableEvent` type ([1da21eb](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/1da21eb))

## 8.0.0 (2020-08-20)
### Bug Fixes
* **o-checkbox** : fixing bug in sql-type value was always overwritted by VARCHAR ([b9f6cbb](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/b9f6cbb))
* **o-form-navigation**:
  * fixing form header navigation ([29f5bd9](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/29f5bd9))
  * fixing navigation through form details ([8da33c5](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/8da33c5))
* **o-form**: setting layoutAling= 'start stretch' instead of 'start start'([008c78c](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/008c78c))
* **o-table**: fixing bug in horizontal scroll ([eef29b4](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/eef29b4))

## 8.0.0-rc.1 (2020-07-30)
### Features
* **o-date-input**: new attribute `date-class` ([039da18](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/039da18))

### Bug Fixes
* **base-service.class**: fixing bug in delete method headers ([d4065cdd](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/d4065cdd)) ([#361](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/361))
* **o-combo**: scroll not worked when searchable="yes" ([b70b2a1](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/b70b2a1)) Closes [#365](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/365)
* **OServiceBaseComponent**: fixing bug including parent-keys value in filter when exporting data ([d34280f](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/d34280f9086ef8e2107367327e6724fd0c666501)) Closes [#373](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/373)
* **defaultLocale**: added new parameter in app.config to set a defaultLocale when language.json file is not found ([5783afc](https://github.com/OntimizeWeb/ontimize-web-ngx/pull/386)) Closes [#383](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/383)
* **o-image**: added new parameter(not-found-image) in o-image component to manage not found images. ([cdaaf7b](https://github.com/OntimizeWeb/ontimize-web-ngx/pull/396))

### BREAKING CHANGES
* **o-app-layout**: the menu icon appears in sidenav when mode="desktop" and show-header="yes". ([#364](https://github.com/OntimizeWeb/ontimize-web-ngx/pull/364)) Closes [#316](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/363)

## 8.0.0.rc-0 (2020-05-29)
### Features
* **angular8:** adapt code to Angular 8.

### BREAKING CHANGES
* All components inputs/outputs arrays are no longer exported as static variables, they are only exported as independent arrays.
* Some interfaces has been replaced by types and their names has changed:
  * interface **IFormValueOptions** has been replaced by type `FormValueOptions`.
  * interface **IExpression** has been replaced by type `Expression`.
  * interface **IBasicExpression** has been replaced by type `BasicExpression`.
  * interface **IFilterExpression** has been replaced by type `FilterExpression`.
  * interface **ISQLOrder** has been replaced by type `SQLOrder`.
* **o-table**:
  * `NAME_COLUMN_SELECT`, `SUFFIX_COLUMN_INSERTABLE`, `LIMIT_SCROLLVIRTUAL` and `DEFAULT_COLUMN_MIN_WIDTH` static variables no longer exists. Now they are located in `Codes` utility class.
  * editors and renderers:
    * '*initialize*' method added always called in base class ngOnInit method
  * `usePlainRender`, `useCellRenderer`, `useCellEditor` and `useDetailButton` no longer exists (used for template purposes) ([e56c736b](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/e56c736b)) ([47c0714e](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/47c0714e))
* **o-form**:
  * `RELOAD_ACTION`, `GO_EDIT_ACTION`, `EDIT_ACTION`, `INSERT_ACTION`, `GO_INSERT_ACTION`, `DELETE_ACTION` and `UNDO_LAST_CHANGE_ACTION` static variables not longer exists, now they are defined in the `Codes` static class.

## 4.1.3
### Features
* **o-table**:
  * new attribute `show-filter-option` ([#318](https://github.com/OntimizeWeb/ontimize-web-ngx/pull/318))
  * new attribute `visible-export-dialog-buttons` ([#320](https://github.com/OntimizeWeb/ontimize-web-ngx/pull/320)). Closes [#316](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/316)
  * new attribute `export-service-type` ([0f2db1c](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/0f2db1c))
  * new attribute `row-class` ([b0de94d](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/b0de94d)). Closes [#367](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/367)
* **App configuration**: new attribute `exportServiceType` allows configuring the service used for exportation in the whole application ([c785371](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/c785371))
* **OFormServiceComponent**: new `query-fallback-function` input ([089338f3](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/089338f3))
* **o-form**: new `query-fallback-function` input ([089338f3](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/089338f3))
* Now the application language is stored in the browser and loaded on application startup ([e9b9535](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/e9b9535))
* We have developed a new mechanism for overriding/extending servicies. From now on, you can use one of the following Injection Tokens for indicating the service class you want to use in your application for the different services: `O_DATA_SERVICE`, `O_TRANSLATE_SERVICE`, `O_FILE_SERVICE`, `O_EXPORT_SERVICE`, `O_PERMISSION_SERVICE` ([ade651e](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/ade651e))
  * Attributes `serviceType`, `exportServiceType`, `permissionsServiceType` from application configuration will be deprecated and removed in future versions.

### Bug Fixes
* **o-time-input**: Fix bad behaviour when there is more than one component in the same form ([fc1dd47](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/fc1dd47))
* **o-language-selector**: emit `onChange` event ([231c1d4](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/231c1d4))

## 4.1.2 (2020-02-26)
### Features
* **o-table**: new `show-configuration-option` input ([5450798](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/5450798)) ([863b1ae](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/863b1ae)) Closes [#306](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/306)

### Bug Fixes
* **o-table**: fixing bug in table visible columns edition dialog ([03ba4a1](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/03ba4a1)) Closes [#298](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/298)

## 4.1.1 (2020-02-11)
### Bug Fixes
* **o-table**:
  * use independent editor for column edition a insertable row ([10af3c6](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/10af3c6)) Closes [#299](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/299)
  * reinitialize table resets table dialogs configuration ([3763caf](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/3763caf)) Closes [#298](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/298)
  * use correct type for `value-base` attribute value on `o-table-cell-renderer-percentage` and include it in `o-table-column` attributes ([054c324](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/054c324))

## 4.1.0 (2019-12-19)
### Features
* **o-table**:
  * new value `local` for `export-mode` input
  * new `o-table-export-button` component ([3258fe6](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/3258fe6))
  * allowing to define custom `o-table-quickfilter` ([e964043a](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/e964043a))
* **OBaseTableCellRenderer**: new `filter-source` and `filter-function` inputs (inherited by all cell renderers)  ([f5296660](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f5296660))
* **o-table-column**: new `filter-expression-function` input ([f5296660](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/f5296660))

### Bug Fixes
* **o-table-cell-renderer-action**, **o-table-cell-renderer-image**: not show title in the column ([b4bc292](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/b4bc292)) Closes [#288](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/288)
* **o-combo**: throw error when request result is a empty object  ([4884fe2](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/e14b8ec)) Closes [#296](https://github.com/OntimizeWeb/ontimize-web-ngx/issues/296)

### BREAKING CHANGES
* **o-table**: exportation and download paths has changed, now they are similar to the CRUD methods paths.
> Example:<br>
> Export path: https://www.mydomain.com/service/rest/customers/customer/pdf<br>
> Download path: https://www.mydomain.com/service/rest/customers/pdf

* **o-table**: `export-mode` value `all` has been replaced by `local`
* **o-table**: `export-mode="all"` has changed, now it sends the current filters to the backend in order to generate the report with all data

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
* **o-form**: new `confirm-exit` input ([01d0d29](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/01d0d29]))
* **IFormValueOptions**: adding new `emitModelToViewValueChange` property ([4d11cd8](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/4d11cd8]))

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
* **o-form**: new `after-insert-mode` input ([4378201](https://github.com/OntimizeWeb/ontimize-web-ngx/commit/437820185e7f9da538b309d2b97577e0e0b32dd2)).
  * Note: `stay-in-record-after-insert` attribute will be deprecated in 8.x.x

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

## 4.0.0 (2019-02-19)
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

## 4.0.0-rc.1 (2019-01-16)
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


