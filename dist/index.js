'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /*
                                                                                                                                                                                                                                                   * vs-fix-sourcemaps plugin for Webpack
                                                                                                                                                                                                                                                   * Description: Mostly fixes JS sourcesmaps in Visual Studio (2015), allowing for JSX and JS Debugging with Webpack
                                                                                                                                                                                                                                                   * MIT
                                                                                                                                                                                                                                                   * Author Joe Bruno <joevbruno@me.com>
                                                                                                                                                                                                                                                   */


var _vlq = require('vlq');

var _vlq2 = _interopRequireDefault(_vlq);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function processMappingLine(line, debug) {
  if (line) {
    var _ret = function () {
      var lineSegments = line.split(',');
      if (lineSegments.length > 1) {
        line = lineSegments.map(function (segment, index) {
          if (index !== 0 && index !== lineSegments.length - 1 && segment.length < 4) {
            // looking for something like:
            // oCAEc,Q,EAAU,W,EAAa,a,EAAe or 6BAEO,S,EAAW or mDAC6B,mG,EAAU
            // the loner characters (or two) is what breaks VS
            if (debug === true) {
              console.log(lineSegments);
            }
            return null;
          }
          return segment;
        }).filter(function (x) {
          return x;
        }).join(',');
      }
      var lastComaIdx = line.lastIndexOf(',');
      var lastSegment = line.substr(lastComaIdx + 1);
      // remove last segment if it contains 1 integer
      // (indicating that there's no corresponding line in the source)
      if (lastSegment && _vlq2.default.decode(lastSegment).length === 1) {
        return {
          v: line.substr(0, lastComaIdx)
        }; // (0,-1) yields ''
      }
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  }
  return line;
}

function VSFixSourceMapsPlugin(options) {
  this.debug = false;
  this.verbose = false;
  if (options && options.verbose === true) {
    this.verbose = true;
  }
  if (options && options.debug === true) {
    this.debug = true;
  }
}

VSFixSourceMapsPlugin.prototype.apply = function (compiler) {
  var debug = this.debug;
  var verbose = this.verbose;
  var mapRegEx = new RegExp('.map$');
  if (debug === true) {
    mapRegEx = new RegExp('.json$');
  }
  compiler.plugin('compilation', function (compilation) {
    compilation.plugin('after-optimize-assets', function (assets) {
      var modifiedAssets = Object.keys(assets).map(function (asset) {
        if (mapRegEx.test(asset)) {
          var assetSourceMaps = assets[asset]._value; // eslint-disable-line
          var parsedSourceMaps = JSON.parse(assetSourceMaps);
          parsedSourceMaps.mappings = parsedSourceMaps.mappings.split(';').map(function (line) {
            return processMappingLine(line, verbose);
          }).join(';');
          var reSerializedSourceMaps = JSON.stringify(parsedSourceMaps);
          assets[asset]._value = reSerializedSourceMaps;
          return assets;
        }
        return asset;
      });
      return modifiedAssets;
    });
  });
};

exports.default = VSFixSourceMapsPlugin;
