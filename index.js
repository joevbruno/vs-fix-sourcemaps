/*
 * vs-fix-sourcemaps plugin for Webpack
 * Description: Mostly fixes JS sourcesmaps in Visual Studio (2015), allowing for JSX and JS Debugging with Webpack
 * MIT
 * Author Joe Bruno <joevbruno@me.com>
 */
var vlq = require('vlq');

function VSFixSourceMapsPlugin() { }

function processMappingLine(line) {
    var potentialIssue = false;
    if (line) {
        var lineSegments = line.split(',');
        if (lineSegments.length > 1) {
            line = lineSegments.map((segment, index) => {
                if (index !== 0 && index !== lineSegments.length - 1 && segment.length < 4) {
                    console.log('Potential Problem Found ', line);
                    potentialIssue = true;
                    return null;
                 }
                 return segment;
            }).filter(x => x).join(',');
        }
        if (potentialIssue === true) {
            console.log('Modified: ', line);
        }

        var lastComaIdx = line.lastIndexOf(",");
        var lastSegment = line.substr(lastComaIdx + 1);
        // remove last segment if it contains 1 integer
        // (indicating that there's no corresponding line in the source)
        if (lastSegment && vlq.decode(lastSegment).length === 1) {
            return line.substr(0, lastComaIdx); // (0,-1) yields ""
        }
    }
    return line;
};
VSFixSourceMapsPlugin.prototype.apply = function (compiler) {
  var mapRegEx = new RegExp('.map$');
  compiler.plugin("compilation", function (compilation) {
      compilation.plugin("after-optimize-assets", function (assets) {
          var modifiedAssets = Object.keys(assets).map(function (asset) {
              if (mapRegEx.test(asset)) {
                  var assetSourceMaps = assets[asset]._value;
                  var parsedSourceMaps = JSON.parse(assetSourceMaps);
                  parsedSourceMaps.mappings = parsedSourceMaps.mappings.split(";").map(processMappingLine).join(";");
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

module.exports = VSFixSourceMapsPlugin;
