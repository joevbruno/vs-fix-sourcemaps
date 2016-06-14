import webpack from 'webpack';
import path from 'path';
import expect from 'expect';
import VSFixSourceMapsPlugin from '../dist/index';
import mocha from 'mocha'; // eslint-disable-line

import webpackConfig from '../example/webpack.config.babel';

describe('Visual Studio: Source Map Tests', function() { // eslint-disable-line
  this.timeout(30000);
  it('Should contain invalid characters and segments.', (done) => {
    const badConfig = { ...webpackConfig, entry: [path.resolve(__dirname, 'data.js')] };
    badConfig.output.path = path.resolve(__dirname, './corrupt');
    badConfig.output.sourceMapFilename = 'main.bundle.json';
    webpack(badConfig, (error, stats) => {
      if (error || stats.hasErrors()) throw new Error('Something went wrong');
      const corruptSourceMap = require('./corrupt/main.bundle.json'); // eslint-disable-line
      const mappings = corruptSourceMap.mappings;
      const hasError = mappings.includes(',M,') && mappings.includes(',S,');
      expect(hasError).toEqual(true);
      done();
    });
  });
  it('Should not contain any loner segments.', (done) => {
    const workingConfig = { ...webpackConfig, entry: [path.resolve(__dirname, 'data.js')] };
    workingConfig.output.path = path.resolve(__dirname, './valid');
    workingConfig.output.sourceMapFilename = 'main.bundle.json';
    workingConfig.plugins.push(new VSFixSourceMapsPlugin({ debug: true, verbose: true }));
    webpack(workingConfig, (error, stats) => {
      if (error || stats.hasErrors()) throw new Error('Something went wrong');
      const validSourceMap = require('./valid/main.bundle.json'); // eslint-disable-line
      const mappings = validSourceMap.mappings;
      const hasError = mappings.includes(',M,') || mappings.includes(',S,');
      expect(hasError).toEqual(false);
      done();
    });
  });
});
