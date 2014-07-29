/*jslint node: true */
"use strict";


module.exports = function(grunt) {
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    bower: {
      install: {
        options: {
          install: true,
          copy: false,
          targetDir: './libs',
          cleanTargetDir: true
        },
        bowerOptions: {
          forceLatest: true
        }
      }
    },
    
    uglify: {
      dist: {
        files: {
          'dist/app.js': [ 'dist/app.js' ]
        },
        options: {
          mangle: false
        }
      }
    },
    
    html2js: {
      dist: {
        src: [ 'app/templates/*.html' ],
        dest: 'tmp/templates.js'
      }
    },
    
    clean: {
      temp: {
        src: [ 'tmp' ]
      },
      dist: {
        src: [ 'dist' ]
      }
    },
    
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [ 'app/*.js', 'tmp/*.js' ],
        dest: 'dist/app.js'
      }
    },
    
    jshint: {
      all: [ 'Gruntfile.js', 'app/*.js', 'app/**/*.js' ]
    },
    
    connect: {
      server: {
        options: {
          hostname: 'localhost',
          port: 8080
        }
      }
    },
    
    watch: {
      dev: {
        files: [ 'Gruntfile.js', 'app/*.js', '*.html', 'assets/**/*.less' ],
        tasks: [ 'jshint', 'karma:unit', 'html2js:dist', 'concat:dist', 'less:dev', 'clean:temp' ],
        options: {
          atBegin: true
        }
      },
      min: {
        files: [ 'Gruntfile.js', 'app/*.js', '*.html', 'assets/**/*.less' ],
        tasks: [ 'jshint', 'karma:unit', 'html2js:dist', 'concat:dist', 'less:dist', 'clean:temp', 'uglify:dist' ],
        options: {
          atBegin: true
        }
      }
    },
    
    compress: {
      dist: {
        options: {
          archive: 'dist/<%= pkg.name %>-<%= pkg.version %>.zip'
        },
        files: [{
          src: [ 'index.html', 'dist/*.js', 'dist/*.css', 'libs/**' ]
        }]
      }
    },
    
    less: {
      dev: {
        options: {
          paths: [ "assets/less" ]
        },
        files: {
          "dist/style.css": "assets/less/style.less"
        }
      },
      dist: {
        options: {
          paths: [ "assets/less" ],
          cleancss: true
        },
        files: {
          "dist/style.css": "assets/less/style.less"
        }
      }
    },
    
    karma: {
      options: {
        configFile: 'config/karma.conf.js'
      },
      unit: {
        singleRun: true
      },
      
      continuous: {
        singleRun: false,
        autoWatch: true
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-karma');
  
  grunt.registerTask('dev', [ 'clean:dist', 'bower', 'connect:server', 'watch:dev' ]);
  grunt.registerTask('test', [ 'clean:dist', 'bower', 'jshint', 'karma:continuous' ]);
  grunt.registerTask('minified', [ 'clean:dist', 'bower', 'connect:server', 'watch:min' ]);
  grunt.registerTask('package', [ 'clean:dist', 'bower', 'jshint', 'karma:unit', 'html2js:dist', 'concat:dist',
    'uglify:dist', 'less:dist', 'clean:temp', 'compress:dist' ]);
};
