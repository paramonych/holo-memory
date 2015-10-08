var concatenatedScriptsName = 'src/js/main.js';
var uglifiedScriptsName = 'src/js/main.min.js';
var allScripts = 'src/js/*.js';
var allTypedScripts = 'src/ts/*.ts';
var compiledCssName = 'src/css/main.css';
var minifiedCssName = 'src/css/style.min.css';
var mainLess = lessDir + '/main.less';
var allLess = 'src/**/*.less';
var sourceMapName = 'src/js/sourcemap.map';
var mainHTMLFile = 'src/index.html';

var lessDir = 'src/less/';
var buildDir = 'build/';
var libsDir = 'libs/';
var allJsLibsDir = 'src/libs/sources/';
//////// end of paths ///////////////////////////////////////////

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      options: {
          force: true
      },
      build: [buildDir]
    },
    copy: {
      options: {
          force: true
      },
      main: {
        files: [
          {src: mainHTMLFile, dest: (buildDir + 'index.html')},
          {src: [libsDir + 'babylon.2.2.js'],dest: (buildDir + 'js/babylon.2.2.js')},
          {src: [libsDir+'jquery-2.1.4.min.js'],dest: (buildDir + 'js/jquery-2.1.4.min.js')},
          {src: [libsDir+'underscore.min.js'],dest: (buildDir + 'js/underscore.min.js')},
          {src: [libsDir+'knockout-3.3.0.js'],dest: (buildDir + 'js/knockout-3.3.0.js')},
          {src: uglifiedScriptsName,dest: (buildDir + 'js/main.min.js')},
          {src: minifiedCssName,dest: (buildDir + 'css/style.min.css')}
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
          compiledCssName: mainLess
        }
      }
    },
    watch: {
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
          uglifiedScriptsName: [concatenatedScriptsName]
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
          minifiedCssName: [compiledCssName]
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
  grunt.registerTask('build', ['clean', 'copy']);

  grunt.registerTask('default', ['compile-less','compile-js', 'build']);
};
