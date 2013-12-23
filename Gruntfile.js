module.exports = function(grunt) {

  grunt.initConfig({
    sass: {
      dist: {
        files: {
          'css/style.css': 'scss/style.scss'
        }
      }
    }
  });

  // grunt.loadNpmTasks('grunt-contrib-copy');
  // grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-sass');
  
  grunt.registerTask('build', ['sass']);
  grunt.registerTask('default', 'build');
};


