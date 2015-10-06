module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    less: {
      main: {
        options: {
          paths: ["src/less"]
        },
        compress: true,
        cleancss: true,
        files: {
          "src/css/main.css": "src/less/main.less"
        }
      }
    },
    watch: {
      all: {
        files: ['src/**/*.less'],
        tasks: ['less', 'min', 'cssmin']
      }
    },
    /*min: {
      one: {
        src: 'js/frame.js',
        dest: 'js/frame.min.js'
      }
    },*/
    cssmin: {
      one: {
        options: {
          'banner': '',
          'keepSpecialComments': 0
        },
        files: {
          'src/css/style.min.css': [
            'src/css/main.css'
          ]
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-min');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('default', ['less', /*'min',*/ 'cssmin']);

};
