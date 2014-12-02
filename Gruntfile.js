'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    autoprefixer: {
      style: {
        options: {
          map: false
        },
        files: {
          'dist/style.css': ['src/style.css']
        }
      }
    },

    mkdir: {
      build: {
        options: {
          create: ['tmp', 'dist']
        },
      },
    },

    ngAnnotate: {
      options: {
        singleQuotes: true,
      },
      bike: {
        files: {
          'tmp/ng.js': ['src/ng.js'],
        },
      }
    },

    uglify: {
      options: {
        compress: {
          drop_console: true
        },
        mangle: {
          except: ['Bike', 'CanvasBike', 'angular']
        }
      },
      bike: {
        files: {
          'dist/bike.min.js': [
            'src/bike.js', 'src/canvas-bike.js', 'tmp/ng.js'
          ]
        }
      }
    },

    'string-replace': {
      dist: {
        options: {
          replacements: [{
            pattern: /<!-- ?<prod>.*[\n\r]\s*([\S\s]*?)[\n\r].*<\/prod> ?-->/ig,
            replacement: '$1'
          }, {
            pattern: /<!-- ?<dev>[\S\s]*?<\/dev> ?-->/ig,
            replacement: ''
          }]
        },
        files: {
          'dist/index.html': ['src/index.html']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-string-replace');

  grunt.registerTask('default', [
    'mkdir', 'ngAnnotate', 'autoprefixer', 'uglify', 'string-replace'
  ]);
};
