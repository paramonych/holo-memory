// scripts
var concatenatedScriptsName = 'src/js/main.js';
var uglifiedScriptsName = 'src/js/main.min.js';
// styles
var compiledCssName = 'src/css/main.css';
var minifiedCssName = 'src/css/style.min.css';
var mainLess = lessDir + '/main.less';
// all files
var allScripts = 'src/js/**/*.js';
var allTypedScripts = 'src/ts/*.ts';
var allLess = 'src/**/*.less';
var allHTML = 'src/**/*.html';
// addings
var sourceMapName = 'src/js/sourcemap.map';
var mainHTMLFile = 'src/index.html';
var debugHTMLFile = 'src/debug.html';
// directories
var lessDir = 'src/less/';
var buildDir = 'build/';
var libsDir = 'src/libs/';
var allJsLibsDir = 'src/libs/sources/';
//////// end of paths ///////////////////////////////////////////

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      options: {
          force: true
      },
      build: [buildDir, concatenatedScriptsName, uglifiedScriptsName, sourceMapName],
      js: [concatenatedScriptsName, uglifiedScriptsName, sourceMapName]
    },
    copy: {
      options: {
          force: true
      },
      main: {
        files: [
          {src: mainHTMLFile, dest: (buildDir+'index.html')},
          {src: 'src/js/main.min.js', dest: (buildDir + 'js/main.min.js')},
          {src: 'src/js/sourcemap.map', dest: (buildDir + 'js/sourcemap.map')},
          {src: 'src/css/style.min.css', dest: (buildDir + 'css/style.min.css')},
          {expand: true, flatten: true, cwd: 'src/libs/sources/',src: [
            'babylon.2.2.js',
            'jquery-2.1.4.min.js',
            'underscore-min.js',
            'knockout-3.3.0.js'
          ], dest: (buildDir+'libs/')},
          {expand: true, flatten: true, cwd: 'src/libs/sources/greensock/',src: [
            'TweenLite.js',
            'TweenMax.js',
            'TimelineMax.js',
            'TimelineLite.js',
            'easing/EasePack.js',
            'plugins/BezierPlugin.js'
          ], dest: (buildDir+'libs/')}
        ]
      },
      debug: {
        options: {
            force: true
        },
        files: [
          {src: debugHTMLFile, dest: (buildDir+'debug.html')},
          {src: 'src/js/main.js', dest: (buildDir + 'js/main.js')},
          {src: 'src/css/style.min.css', dest: (buildDir + 'css/style.min.css')},
          {expand: true, flatten: true, cwd: 'src/libs/sources/',src: [
            'babylon.2.2.js',
            'jquery-2.1.4.min.js',
            'underscore-min.js',
            'knockout-3.3.0.js'
          ], dest: (buildDir+'libs/')},
          {expand: true, flatten: true, cwd: 'src/libs/sources/greensock/',src: [
            'TweenLite.js',
            'TweenMax.js',
            'TimelineMax.js',
            'TimelineLite.js',
            'easing/EasePack.js',
            'plugins/BezierPlugin.js'
          ], dest: (buildDir+'libs/')}
        ]
      }
    },
    less: {
      main: {
        options: {
          paths: [lessDir]
        },
        compress: true,
        cleancss: true,
        files: {
          'src/css/main.css': mainLess
        }
      }
    },
    watch: {
      /*html: {
        files: [allHTML],
        tasks: ['clean', 'copy']
      },*/
      styles: {
        files: [allLess],
        tasks: ['compile-less']
      },
      scripts: {
        files: [allScripts, ('!'+ concatenatedScriptsName), ('!'+ uglifiedScriptsName)],
        tasks: ['compile-js']
      }
    },
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: [allScripts],
        dest: concatenatedScriptsName,
      },
    },
    uglify: {
      scripts: {
        options: {
          sourceMap: true,
          sourceMapName: sourceMapName
        },
        files: {
          'src/js/main.min.js': [concatenatedScriptsName]
        }
      }
    },
    cssmin: {
      one: {
        options: {
          //banner: '',
          //'keepSpecialComments': 0
        },
        files: {
          'src/css/style.min.css': [compiledCssName]
        }
      }
    },
    tslint: {
      options: {
        configuration: grunt.file.readJSON("tslint.json")
      },
      files: {
        src: [allTypedScripts]
      }
    },
    eslint: {
        src: [allScripts]
    }
  });

  ////////////////////////////////////////////
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-tslint');
  grunt.loadNpmTasks('gruntify-eslint');
  ////////////////////////////////////////////

  grunt.registerTask('compile-less', ['less', 'cssmin']);
  grunt.registerTask('compile-js', [/*'tslint','eslint',*/ 'concat', 'uglify']);
  grunt.registerTask('build', ['clean:build', 'copy:main', 'clean:js']);

  grunt.registerTask('default', ['clean:build', 'compile-less','compile-js', 'copy:main', 'clean:js']);
  grunt.registerTask('debug', ['clean:build', 'compile-less','compile-js', 'copy:debug', 'clean:js']);

};
