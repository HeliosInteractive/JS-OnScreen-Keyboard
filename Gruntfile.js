module.exports = function(grunt){
  require('load-grunt-tasks')(grunt);

  var pkg = require("./package.json");

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      options: {
        mangle: false,
        beautify: true,
        "indent-level" : 2,
        width : 120,
        semicolons: false,
        quote_style: 1,
        wrap: false,
        banner: "/*Keyboard v"+pkg.version+"*/",
      },
      keyboard: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['keyboard.js'],
        }
      },
    },
    copy: {
      main: {
        src: 'basic.css',
        dest: 'dist/<%= pkg.name %>.css'
      }
    },
    cssmin: {
      target: {
        files: {
          'dist/<%= pkg.name %>.min.css': ['basic.css'],
        }
      }
    }
  });

  grunt.registerTask('default', ['build'])
  grunt.registerTask('build', ['uglify', 'copy','cssmin'])
}
