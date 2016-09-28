
var getPackageJson = function () {
  let  fs = require('fs');
  return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
};


export = function bump(gulp:any, plugins:any, option:any) {
  return function () {
    // let semver = require('semver');

    // reget package
    var pkg = getPackageJson();
    // increment version
    // var newVer = semver.inc(pkg.version, 'patch');

    return gulp.src(['./package.json'])
      .pipe(plugins.bump({
        version: pkg.version //newVer
      }))
      .pipe(gulp.dest('./out'));
  };
};
