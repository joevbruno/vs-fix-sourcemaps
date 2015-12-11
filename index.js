/* 
 * VSFixSourceMapsPlugin for Webpack 
 * Description: Fixes JS sourcesmaps in Visual Studio (2015), allowing for JSX and JS Debugging with Webpack!
 * MIT 
 * Author Joe Bruno <joevbruno@me.com>
 */
function VSFixSourceMapsPlugin() {}
module.exports = VSFixSourceMapsPlugin;

VSFixSourceMapsPlugin.prototype.apply = function(compiler) {
  var mapRegEx = new RegExp('.map$');
  compiler.plugin("compilation", function(compilation) {
    compilation.plugin("after-optimize-assets", function(assets) {
      var modifiedAssets = Object.keys(assets).map(function(asset) {
        if (mapRegEx.test(asset)) {
          var assetSourceMaps = assets[asset]._value;
          var parsedSourceMaps = JSON.parse(assetSourceMaps);
          var regToFixSourceMaps = new RegExp(',\s*[^\s\";]{1,3}?(;|\")', 'g');
          var fixedMaps = parsedSourceMaps.mappings.replace(regToFixSourceMaps, ';');
          parsedSourceMaps.mappings = fixedMaps;
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

