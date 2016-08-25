'use strict';

module.exports = {
  build: {
    entryPoint: 'lib/plugin.js',
    buildFile: 'slick-ui.js',
    buildMinFile: 'slick-ui.min.js',
    buildFolder: 'build/'
  },
  serve: {
    entryPoint: '.'
  },
  markup: {
    srcPaths: ['examples/*.pug'],
    output: 'examples/'
  }
};
