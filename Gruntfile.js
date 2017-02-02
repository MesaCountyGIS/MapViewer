module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        spriteGenerator: {
            sprite: {
                src: [
                    'images/sprites/*.png'
                ],
                stylesheet: 'less',
                spritePath: 'images/test/sprite.png',
                stylesheetPath: 'style/test/sprite.less',
                layoutOptions: {
                    padding: 10
                }
            },
            mobile: {
                src: [
                    'images/msprites/*.png'
                ],
                stylesheet: 'less',
                spritePath: 'images/msprite.png',
                stylesheetPath: 'style/msprite.less',
                layoutOptions: {
                    padding: 10
                }
            }
        }

    });

    grunt.loadNpmTasks('node-sprite-generator');

   grunt.registerTask('spritegen', ['spriteGenerator:sprite']);
//    grunt.registerTask('mobilesprite', ['spriteGenerator:mobile']);

};
