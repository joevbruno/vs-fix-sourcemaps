/*
 * vs-fix-sourcemaps plugin for Webpack
 * Description: Mostly fixes JS sourcesmaps in Visual Studio (2015), allowing for JSX and JS Debugging with Webpack
 * MIT
 * Author Joe Bruno <joevbruno@me.com>
 */
import vlq from 'vlq';

function processMappingLine(line, debug) {
  if (line) {
    const lineSegments = line.split(',');
    if (lineSegments.length > 1) {
      line = lineSegments.map((segment, index) => {
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
      }).filter(x => x).join(',');
    }
    const lastComaIdx = line.lastIndexOf(',');
    const lastSegment = line.substr(lastComaIdx + 1);
    // remove last segment if it contains 1 integer
    // (indicating that there's no corresponding line in the source)
    if (lastSegment && vlq.decode(lastSegment).length === 1) {
      return line.substr(0, lastComaIdx); // (0,-1) yields ''
    }
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
  const debug = this.debug;
  const verbose = this.verbose;
  let mapRegEx = new RegExp('.map$');
  if (debug === true) {
    mapRegEx = new RegExp('.json$');
  }
  compiler.plugin('compilation', (compilation) => {
    compilation.plugin('after-optimize-assets', (assets) => {
      const modifiedAssets = Object.keys(assets).map((asset) => {
        if (mapRegEx.test(asset)) {
          const assetSourceMaps = assets[asset]._value; // eslint-disable-line
          const parsedSourceMaps = JSON.parse(assetSourceMaps);
          parsedSourceMaps.mappings = parsedSourceMaps.mappings.split(';').map(line => processMappingLine(line, verbose)).join(';');
          const reSerializedSourceMaps = JSON.stringify(parsedSourceMaps);
          assets[asset]._value = reSerializedSourceMaps;
          return assets;
        }
        return asset;
      });
      return modifiedAssets;
    });
  });
};

export default VSFixSourceMapsPlugin;
