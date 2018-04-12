import resolve from 'rollup-plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';

// import commonjs from 'rollup-plugin-commonjs';

/**
 * Add here external dependencies that actually you use.
 *
 * Angular dependencies
 * - '@angular/animations' => 'ng.animations'
 * - '@angular/animations/browser': 'ng.animations.browser'
 * - '@angular/common' => 'ng.common'
 * - '@angular/compiler' => 'ng.compiler'
 * - '@angular/core' => 'ng.core'
 * - '@angular/forms' => 'ng.forms'
 * - '@angular/common/http' => 'ng.common.http'
 * - '@angular/platform-browser-dynamic' => 'ng.platformBrowserDynamic'
 * - '@angular/platform-browser' => 'ng.platformBrowser'
 * - '@angular/platform-browser/animations' => 'ng.platformBrowser.animations'
 * - '@angular/platform-server' => 'ng.platformServer'
 * - '@angular/router' => 'ng.router'
 *
 * RxJS dependencies
 * Each RxJS functionality that you use in the library must be added as external dependency.
 * - For main classes use 'Rx':
 *      e.g. import { Observable } from 'rxjs/Observable'; => 'rxjs/Observable': 'Rx'
 * - For observable methods use 'Rx.Observable':
 *      e.g. import 'rxjs/add/observable/merge'; => 'rxjs/add/observable/merge': 'Rx.Observable'
 *      or for lettable operators:
 *      e.g. import { merge } from 'rxjs/observable/merge'; => 'rxjs/observable/merge': 'Rx.Observable'
 * - For operators use 'Rx.Observable.prototype':
 *      e.g. import 'rxjs/add/operator/map'; => 'rxjs/add/operator/map': 'Rx.Observable.prototype'
 *      or for lettable operators:
 *      e.g. import { map } from 'rxjs/operators'; => 'rxjs/operators': 'Rx.Observable.prototype'
 *
 * Other dependencies
 * - Angular libraries: refer to their global namespace
 * - TypeScript/JavaScript libraries:
 *      e.g. lodash: 'lodash' => 'lodash'
 *
 * Also, if the dependency uses CommonJS modules, such as lodash,
 * you should also use a plugin like rollup-plugin-commonjs,
 * to explicitly specify unresolvable 'named exports'.
 *
 */
const globals = {
  'moment': 'moment',

  '@angular/compiler-cli': 'ng.compilerCli',
  '@angular/http': 'ng.http',
  '@angular/upgrade': 'ng.upgrade',

  '@angular/material-moment-adapter': 'ng.materialMomentAdapter',
  '@angular/cdk': 'ng.cdk',
  '@angular/flex-layout': 'ng.flexLayout',
  '@angular/material': 'ng.material',
  '@angular/animations': 'ng.animations',
  '@angular/common': 'ng.common',
  '@angular/animations/browser': 'ng.animations.browser',
  '@angular/compiler': 'ng.compiler',
  '@angular/core': 'ng.core',
  '@angular/forms': 'ng.forms',
  '@angular/common/http': 'ng.common.http',
  '@angular/platform-browser-dynamic': 'ng.platformBrowserDynamic',
  '@angular/platform-browser': 'ng.platformBrowser',
  '@angular/platform-browser/animations': 'ng.platformBrowser.animations',
  '@angular/platform-server': 'ng.platformServer',
  '@angular/router': 'ng.router',
  '@ngx-translate/core': 'ng.translateCore',
  '@ngx-translate/http-loader': 'ng.translateHttpLoader',

  // RxJS dependencies
  'rxjs/operators/debounceTime': 'Rx.operators',
  'rxjs/operators/takeUntil': 'Rx.operators',
  'rxjs/operators/take': 'Rx.operators',
  'rxjs/operators/first': 'Rx.operators',
  'rxjs/operators/filter': 'Rx.operators',
  'rxjs/operators/map': 'Rx.operators',
  'rxjs/operators/tap': 'Rx.operators',
  'rxjs/operators/startWith': 'Rx.operators',
  'rxjs/operators/auditTime': 'Rx.operators',
  'rxjs/operators/switchMap': 'Rx.operators',
  'rxjs/operators/finalize': 'Rx.operators',
  'rxjs/operators/catchError': 'Rx.operators',
  'rxjs/operators/share': 'Rx.operators',
  'rxjs/operators/delay': 'Rx.operators',
  'rxjs/operators/combineLatest': 'Rx.operators',

  'rxjs/AnonymousSubject': 'Rx',
  'rxjs/AsyncSubject': 'Rx',
  'rxjs/BehaviorSubject': 'Rx',
  'rxjs/Notifiction': 'Rx',
  'rxjs/ObservableInput': 'Rx',
  'rxjs/Observable': 'Rx',
  'rxjs/Observer': 'Rx',
  'rxjs/ReplaySubject': 'Rx',
  'rxjs/Scheduler': 'Rx',
  'rxjs/Subject': 'Rx',
  'rxjs/SubjectSubscriber': 'Rx',
  'rxjs/SubscribableOrPromise': 'Rx',
  'rxjs/Subscriber': 'Rx',
  'rxjs/Subscription': 'Rx',
  'rxjs/TeardownLogic': 'Rx',

  'rxjs/observable/combineLatest': 'Rx.Observable',
  'rxjs/observable/defer': 'Rx.Observable',
  'rxjs/observable/empty': 'Rx.Observable',
  'rxjs/observable/forkJoin': 'Rx.Observable',
  'rxjs/observable/fromEvent': 'Rx.Observable',
  'rxjs/observable/fromEventPattern': 'Rx.Observable',
  'rxjs/observable/merge': 'Rx.Observable',
  'rxjs/observable/of': 'Rx.Observable',
  'rxjs/observable/throw': 'Rx.Observable',

  'rxjs/add/observable/fromPromise': 'Rx.Observable',
  'rxjs/add/observable/of': 'Rx.Observable',
  'rxjs/add/observable/bindCallback': 'Rx.Observable',
  'rxjs/add/observable/bindNodeCallback': 'Rx.Observable',
  'rxjs/add/observable/combineLatest': 'Rx.Observable',
  'rxjs/add/observable/concat': 'Rx.Observable',
  'rxjs/add/observable/create': 'Rx.Observable',
  'rxjs/add/observable/defer': 'Rx.Observable',
  'rxjs/add/observable/empty': 'Rx.Observable',
  'rxjs/add/observable/forkJoin': 'Rx.Observable',
  'rxjs/add/observable/from': 'Rx.Observable',
  'rxjs/add/observable/fromEvent': 'Rx.Observable',
  'rxjs/add/observable/fromEventPattern': 'Rx.Observable',
  'rxjs/add/observable/interval': 'Rx.Observable',
  'rxjs/add/observable/merge': 'Rx.Observable',
  'rxjs/add/observable/never': 'Rx.Observable',
  'rxjs/add/observable/range': 'Rx.Observable',
  'rxjs/add/observable/throw': 'Rx.Observable',
  'rxjs/add/observable/timer': 'Rx.Observable',
  'rxjs/add/observable/webSocket': 'Rx.Observable',
  'rxjs/add/observable/zip': 'Rx.Observable',

  'rxjs/add/operator/audit': 'Rx.Observable.prototype',
  'rxjs/add/operator/auditTime': 'Rx.Observable.prototype',
  'rxjs/add/operator/buffer': 'Rx.Observable.prototype',
  'rxjs/add/operator/bufferCount': 'Rx.Observable.prototype',
  'rxjs/add/operator/bufferTime': 'Rx.Observable.prototype',
  'rxjs/add/operator/bufferToggle': 'Rx.Observable.prototype',
  'rxjs/add/operator/bufferWhen': 'Rx.Observable.prototype',
  'rxjs/add/operator/catch': 'Rx.Observable.prototype',
  'rxjs/add/operator/combineAll': 'Rx.Observable.prototype',
  'rxjs/add/operator/combineLatest': 'Rx.Observable.prototype',
  'rxjs/add/operator/concat': 'Rx.Observable.prototype',
  'rxjs/add/operator/concatAll': 'Rx.Observable.prototype',
  'rxjs/add/operator/concatMap': 'Rx.Observable.prototype',
  'rxjs/add/operator/concatMapTo': 'Rx.Observable.prototype',
  'rxjs/add/operator/count': 'Rx.Observable.prototype',
  'rxjs/add/operator/debounce': 'Rx.Observable.prototype',
  'rxjs/add/operator/debounceTime': 'Rx.Observable.prototype',
  'rxjs/add/operator/defaultIfEmpty': 'Rx.Observable.prototype',
  'rxjs/add/operator/delay': 'Rx.Observable.prototype',
  'rxjs/add/operator/delayWhen': 'Rx.Observable.prototype',
  'rxjs/add/operator/dematerialize': 'Rx.Observable.prototype',
  'rxjs/add/operator/distinct': 'Rx.Observable.prototype',
  'rxjs/add/operator/distinctUntilChanged': 'Rx.Observable.prototype',
  'rxjs/add/operator/distinctUntilKeyChanged': 'Rx.Observable.prototype',
  'rxjs/add/operator/do': 'Rx.Observable.prototype',
  'rxjs/add/operator/elementAt': 'Rx.Observable.prototype',
  'rxjs/add/operator/every': 'Rx.Observable.prototype',
  'rxjs/add/operator/exhaust': 'Rx.Observable.prototype',
  'rxjs/add/operator/exhaustMap': 'Rx.Observable.prototype',
  'rxjs/add/operator/expand': 'Rx.Observable.prototype',
  'rxjs/add/operator/filter': 'Rx.Observable.prototype',
  'rxjs/add/operator/find': 'Rx.Observable.prototype',
  'rxjs/add/operator/findIndex': 'Rx.Observable.prototype',
  'rxjs/add/operator/first': 'Rx.Observable.prototype',
  'rxjs/add/operator/forEach': 'Rx.Observable.prototype',
  'rxjs/add/operator/finally': 'Rx.Observable.prototype',
  'rxjs/add/operator/groupBy': 'Rx.Observable.prototype',
  'rxjs/add/operator/ignoreElements': 'Rx.Observable.prototype',
  'rxjs/add/operator/isEmpty': 'Rx.Observable.prototype',
  'rxjs/add/operator/last': 'Rx.Observable.prototype',
  'rxjs/add/operator/letProto': 'Rx.Observable.prototype',
  'rxjs/add/operator/lift': 'Rx.Observable.prototype',
  'rxjs/add/operator/map': 'Rx.Observable.prototype',
  'rxjs/add/operator/materialize': 'Rx.Observable.prototype',
  'rxjs/add/operator/max': 'Rx.Observable.prototype',
  'rxjs/add/operator/merge': 'Rx.Observable.prototype',
  'rxjs/add/operator/mergeAll': 'Rx.Observable.prototype',
  'rxjs/add/operator/mergeMap': 'Rx.Observable.prototype',
  'rxjs/add/operator/mergeMapTo': 'Rx.Observable.prototype',
  'rxjs/add/operator/mergeScan': 'Rx.Observable.prototype',
  'rxjs/add/operator/min': 'Rx.Observable.prototype',
  'rxjs/add/operator/multicast': 'Rx.Observable.prototype',
  'rxjs/add/operator/observeOn': 'Rx.Observable.prototype',
  'rxjs/add/operator/pairwise': 'Rx.Observable.prototype',
  'rxjs/add/operator/partition': 'Rx.Observable.prototype',
  'rxjs/add/operator/pluck': 'Rx.Observable.prototype',
  'rxjs/add/operator/publish': 'Rx.Observable.prototype',
  'rxjs/add/operator/publishBehavior': 'Rx.Observable.prototype',
  'rxjs/add/operator/publishLast': 'Rx.Observable.prototype',
  'rxjs/add/operator/publishReplay': 'Rx.Observable.prototype',
  'rxjs/add/operator/race': 'Rx.Observable.prototype',
  'rxjs/add/operator/reduce': 'Rx.Observable.prototype',
  'rxjs/add/operator/repeat': 'Rx.Observable.prototype',
  'rxjs/add/operator/repeatWhen': 'Rx.Observable.prototype',
  'rxjs/add/operator/retry': 'Rx.Observable.prototype',
  'rxjs/add/operator/retryWhen': 'Rx.Observable.prototype',
  'rxjs/add/operator/sample': 'Rx.Observable.prototype',
  'rxjs/add/operator/sampleTime': 'Rx.Observable.prototype',
  'rxjs/add/operator/scan': 'Rx.Observable.prototype',
  'rxjs/add/operator/sequenceEqual': 'Rx.Observable.prototype',
  'rxjs/add/operator/share': 'Rx.Observable.prototype',
  'rxjs/add/operator/single': 'Rx.Observable.prototype',
  'rxjs/add/operator/skip': 'Rx.Observable.prototype',
  'rxjs/add/operator/skipUntil': 'Rx.Observable.prototype',
  'rxjs/add/operator/skipWhile': 'Rx.Observable.prototype',
  'rxjs/add/operator/startWith': 'Rx.Observable.prototype',
  'rxjs/add/operator/subscribeOn': 'Rx.Observable.prototype',
  'rxjs/add/operator/switch': 'Rx.Observable.prototype',
  'rxjs/add/operator/switchMap': 'Rx.Observable.prototype',
  'rxjs/add/operator/switchMapTo': 'Rx.Observable.prototype',
  'rxjs/add/operator/take': 'Rx.Observable.prototype',
  'rxjs/add/operator/takeLast': 'Rx.Observable.prototype',
  'rxjs/add/operator/takeUntil': 'Rx.Observable.prototype',
  'rxjs/add/operator/takeWhile': 'Rx.Observable.prototype',
  'rxjs/add/operator/throttle': 'Rx.Observable.prototype',
  'rxjs/add/operator/throttleTime': 'Rx.Observable.prototype',
  'rxjs/add/operator/timeInterval': 'Rx.Observable.prototype',
  'rxjs/add/operator/timeout': 'Rx.Observable.prototype',
  'rxjs/add/operator/timeoutWith': 'Rx.Observable.prototype',
  'rxjs/add/operator/timestamp': 'Rx.Observable.prototype',
  'rxjs/add/operator/toArray': 'Rx.Observable.prototype',
  'rxjs/add/operator/toPromise': 'Rx.Observable.prototype',
  'rxjs/add/operator/window': 'Rx.Observable.prototype',
  'rxjs/add/operator/windowCount': 'Rx.Observable.prototype',
  'rxjs/add/operator/windowToggle': 'Rx.Observable.prototype',
  'rxjs/add/operator/windowWhen': 'Rx.Observable.prototype',
  'rxjs/add/operator/withLatestFrom': 'Rx.Observable.prototype',
  'rxjs/add/operator/zipAll': 'Rx.Observable.prototype',
  'rxjs/add/operator/zipProto': 'Rx.Observable.prototype'
};

export default {
  external: Object.keys(globals),
  plugins: [
    resolve(),
    sourcemaps()
    // ,
    // commonjs({
    //   include: 'node_modules/**'
    // })
  ],
  onwarn: () => { return },
  output: {
    format: 'umd',
    name: 'ng.ontimizeWeb',
    globals: globals,
    sourcemap: true,
    exports: 'named',
    amd: { id: 'ontimize-web-ngx' }
  }
}
