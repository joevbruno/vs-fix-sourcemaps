# Fix Webpack JSX and JS Sourcemaps in Visual Studios
This plugin allows you to debug Webpack-bundled JS and JSX (yes, you heard that right, JSX) files directly in Visual Studios 2015 (from the original source);

### Problem
Visual Studios (2015) doesn't support 'traditional' forms of JS debugging by setting breakpoints directly in Visual Studios. You can read the issues here:

+ https://github.com/webpack/webpack/issues/1502
+ http://stackoverflow.com/questions/32445692/debugging-bundled-javascript-in-visual-studio-2015/32952254#32952254
+ https://connect.microsoft.com/VisualStudio/feedback/details/1873069/unsupported-format-of-the-sourcemap-errors

### A Solution
While the problem seems to be with Visual Studios, this webpack plugin seems to solve the issue (at least so far - if you find a bug please submit a PR). 

This plugin only has one job: fix sourcemaps. No options or configuration - at least not yet.

If you are installing this plugin, you are most likely using IE. Make sure you are adding the Event Source pollyfill in IE if you are using hot middleware: https://github.com/glenjamin/webpack-hot-middleware/issues/11


### Usage

```
npm install --save-dev vs-fix-sourcemaps
```
In your Webpack config file, under [plugins](https://webpack.github.io/docs/configuration.html#plugins), add this plugin:

```
import VSFixSourceMapsPlugin from 'vs-fix-sourcemaps';
...
  devtool: 'source-map',
  plugins: [
    new VSFixSourceMapsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(), 
    new webpack.HotModuleReplacementPlugin(), // hot loading!
    new webpack.NoErrorsPlugin()
  ]
...
```

### Known Issues
  If you are using hot middleware of any kind (like React Hot Loader or React Transforms), hot loading will not always hit breakpoints in Visual Studios. It is buggy. The problem stems from the way the referenced paths are stored in memory by Visual Studios and Webpack. If it isn't working, refreshing the page should fix it. Lame, I know, but I have not found a fix for this yet. If you have a way to make it work, I am happy to accept your PR!


### Contributing
  Yes please. Submit your PR. 


