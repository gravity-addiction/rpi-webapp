'use strict';

if (process.argv.length < 4) {
  console.log('MISSING INPUT / OUTPUT FILE PATHS IN COMMAND');
  return;
}

const fs = require('fs'),
      path = require('path'),
      webpack = require('webpack'),
      minimist = require('minimist'),
      args = minimist(process.argv),
      envFile = args.env || '.env',
      dotenv = require('dotenv').config({path: envFile}).parsed || {},
      minify = args.minify || dotenv.MINIFY || false,
      minify_libraries = args.minify_libraries || dotenv.MINIFY_LIBRARIES || true,
      banner = args.banner || dotenv.BANNER || false
;

const CopyWebpackPlugin = require('copy-webpack-plugin'),
      TerserPlugin = require('terser-webpack-plugin');
      // ButternutWebpackPlugin = require('butternut-webpack-plugin').default;
      // UglifyJSPlugin = require('uglifyjs-webpack-plugin');
      // webpackUglifyJsPlugin = require('webpack-uglify-js-plugin');
      // ClosureCompilerPlugin = require('webpack-closure-compiler');

const ENV = process.env.npm_lifecycle_event || '',
      isTestWatch = ENV === 'test-watch',
      isTest = ENV === 'test' || isTestWatch,
      buildEnv = ENV.match(/.*?:build/g),
      isProd = dotenv.PRODUCTION || (buildEnv && buildEnv.length) 
;

console.log('Input File: ', process.argv[2]);
console.log('Output File: ', process.argv[4]);
console.log('Environment File: ', envFile);
console.log('Webpack Config: ', __filename);
console.log('Minify: ', (minify)?'Yes':'No');
console.log('Banner: ', (banner)?'Yes':'No');
console.log('Is Test: ', (isTest)?'Yes':'No');
console.log('Is Production: ', (isProd)?'Yes':'No');

module.exports = function makeWebpackConfig() {
  const _assetsDir = args.assets || dotenv.CLI_ASSETS || null,
        _splitChunks = args.splitchunks || dotenv.SPLITCHUNKS || false,
        _tsConfigCli = `./api-tsconfig.json`,
        _atlOptions = JSON.stringify({
          configFileName: _tsConfigCli
        });

  console.log('TSConfig File: ', _tsConfigCli);
  console.log('Assets Dir: ', _assetsDir);
  console.log('Split Chunks: ', (_splitChunks)?'Yes':'No');

  let config = {};

  config.target = 'node';

  config.node = {
    __filename: false,
    __dirname: false
  };

  config.resolve = {
    extensions: [ '.ts', '.tsx', '.js', '.json' ],
  };

  /**
   * Devtool
   * Reference: http://webpack.github.io/docs/configuration.html#devtool
   * Type of sourcemap to use per build type
   */
  if (isProd) {
    config.devtool = '';
    config.mode = args.config_mode || dotenv.CONFIG_MODE || 'production';
  }
  else if (isTest) {
    config.devtool = 'inline-source-map';
    config.mode = args.config_mode || dotenv.CONFIG_MODE || 'none'
  }
  else {
    config.devtool = 'source-map'; // eval-source-map
    config.mode = args.config_mode || dotenv.CONFIG_MODE || 'development';
  }

 

  config.module = {
    rules: [
      {
        test: /\.tsx?$/,
        loader: `awesome-typescript-loader?${_atlOptions}`,
        exclude: [isTest ? /\.(e2e)\.ts$/ : /\.(spec|e2e)\.ts$/, /node_modules\/(?!(ng2-.+))/]
      },
      { test: /\.json$/, loader: 'json-loader', exclude: [/node_modules/] },
      { test: /\.node$/, loader: 'node-loader', exclude: [/node_modules/] },
      {
        test: /\.ts$/,
        enforce: 'pre',
        loader: 'tslint-loader',
        exclude: /node_modules/,
        options: {
          configFile: `./api-tslint.json`
        }
      }      
    ]
  };

  config.externals = [];
  config.plugins = [];
  config.plugins.push(
    new webpack.DefinePlugin({ "global.GENTLY": false })
  );

  config.optimization = {
    namedChunks: true,
    minimizer: [
      new TerserPlugin({
        chunkFilter: (chunk) => {
          if (chunk.name === 'vendors~main') {
            return (minify_libraries || false);
          }
          return (minify || false);
        },
        sourceMap: false
      }),
    ]
  };

  // Node dependancies
  const nodeModules = {};
  fs.readdirSync('node_modules')
    .filter(item => ['.bin'].indexOf(item) === -1 )  // exclude the .bin folder
    .forEach((mod) => {
        nodeModules[mod] = 'commonjs ' + mod;
    });
  config.externals = nodeModules;

  // KNEX dependancies
  // config.externals.push({ knex: 'commonjs knex' }, { express: 'commonjs express' }, 'msnodesqlv8', 'tds', 'msnodesql', 
  //       'oracledb', 'strong-oracle', 'oracle', 'pg-query-stream', 'pg', 'mysql', 'mssql', 'mariasql', 'sqlite', 'sqlite3');
  // Add build specific plugins

  if (banner) {
    config.plugins.push(
      new webpack.BannerPlugin({ banner: '#!/usr/bin/env node', raw: true })
    );
  }

  if (_assetsDir) {
    // Copy assets from the public folder
    // Reference: https://github.com/kevlened/copy-webpack-plugin
    config.plugins.push(
      new CopyWebpackPlugin([{
        context: _assetsDir,
        from: { glob: '**/*', dot: true }
      }], { ignore: ['*.ts', '*.json']})
    );
  }

  // Environment Files (.env)
  config.plugins.push(
    new CopyWebpackPlugin([{
      context: 'src/',
      from: { glob: '**/.env', dot: true }
    }])
  );

  if (isProd) {
    config.plugins.push(
      // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
      // Only emit files when there are no errors
      new webpack.NoEmitOnErrorsPlugin()

      // // Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
      // // Dedupe modules in the output
      // new webpack.optimize.DedupePlugin(),
    );
  }

  if (_splitChunks) {
    config.optimization.splitChunks = {
      chunks: 'all'
    };
  }

  return config;
}();

// Helper functions
function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}

function resolvePath(envar, srcDir, defaultFile) {
  return (envar) ? path.join(process.cwd(), envar) :
             path.join(srcDir, defaultFile);
}
