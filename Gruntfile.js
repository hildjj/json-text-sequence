module.exports = function(grunt) {
  // Load Grunt tasks declared in the package.json file
  require('jit-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      all: ['coverage', 'doc', 'lib', 'man'],
      coverage: ['coverage'],
      doc: ['doc'],
      lib: ['lib']
    },
    coffee: {
      compile: {
        expand: true,
        flatten: true,
        cwd: 'src',
        src: ['*.coffee'],
        dest: 'lib/',
        ext: '.js'
      }
    },
    codo: {
      src: ['src'],
      options: {
        name: "json-text-sequence",
        title: "json-text-sequence API Documentation",
        extras: [ "LICENSE.md" ]
      }
    },
    coffeelint: {
      src: ['src/*.coffee'],
      options: {
        configFile: 'coffeelint.json'
      }
    },
    coveralls: {
      all: {
        src: 'coverage/lcov.info'
      }
    },
    nodeunit: {
      all: ['test/*.js']
    },
    shell: {
      istanbul: {
        stdout: true,
        stderr: true,
        command: 'istanbul cover nodeunit test/*.coffee'
      },
    },
    express: {
      all: {
        options: {
          port: 9000,
          hostname: "0.0.0.0",
          bases: 'coverage/lcov-report',
          livereload: true,
          open: 'http://localhost:<%= express.all.options.port%>/lib'
        }
      }
    },
    watch: {
      all: {
        files: ['src/*.coffee', 'test/*.coffee'],
        tasks: ['test', 'shell:istanbul'],
        options: {
          livereload: true
        }
      }
    },
    release: {
      options: {
        tagName: 'v<%= version %>', //default: '<%= version %>'
      }
    }
  });

  grunt.registerTask('default', ['test']);
  grunt.registerTask('prepublish', ['clean', 'coffee', 'codo']);
  grunt.registerTask('doc', ['clean:doc', 'codo']);
  grunt.registerTask('test', ['coffee', 'nodeunit']);
  grunt.registerTask('server', ['test', 'shell:istanbul', 'express', 'watch']);
  grunt.registerTask('coverage', ['coffee', 'shell:istanbul'])
  grunt.registerTask('ci', ['coverage', 'coveralls']);
};
