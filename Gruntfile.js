module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ['build/'],
    copy: {
      main: {
        src: 'src/index.html',
        dest: 'build/index.html',
      }
    },
    less: {
      main: {
        options: {
          paths: ["src/less"]
        },
        compress: true,
        cleancss: true,
        files: {
          'src/css/main.css': 'src/less/main.less'
        }
      }
    },
    watch: {
      styles: {
        files: ['src/**/*.less'],
        tasks: ['less', 'cssmin']
      },
      scripts: {
        files: ['src/*/*.js'],
        tasks: ['eslint', 'uglify']
      }
    },
    uglify: {
      scripts: {
        options: {
          banner: '',
          sourceMap: true,
          sourceMapName: 'src/js/sourcemap.map'
        },
        files: {
          'src/js/main.min.js': ['src/js/*.js']
        }
      }
    },
    cssmin: {
      one: {
        options: {
          'banner': '',
          //'keepSpecialComments': 0
        },
        files: {
          'src/css/style.min.css': [
            'src/css/main.css'
          ]
        }
      }
    },
    tslint: {
      options: {
        configuration: grunt.file.readJSON("tslint.json")
      },
      files: {
        src: ['src/ts/*.ts']
      }
    },
    eslint: {
        src: ['src/js/*.js']
    }
  });
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-tslint');
  grunt.loadNpmTasks('gruntify-eslint');

  grunt.registerTask('default', ['clean', 'copy', 'less', 'cssmin', /*'tslint','eslint',*/ 'uglify']);

};
