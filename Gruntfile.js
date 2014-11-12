'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    autoprefixer: {
      single_file: {
        options: {
          map: true
        },
        src: 'style.css',
        dest: 'style-prefixed.css'
      }
    }
  });

  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.registerTask('default', ['autoprefixer']);
};
