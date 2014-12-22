define(function() {
    var ctor = function () {
        this.displayName = 'AstroGears';
        this.description = 'AstroGears is a toolkit for logging and examining aspect between various planets, asteroids, Arabic Parts, and fixed stars.  Usable for Natal, Transit, and many other charts!';
        this.features = [
            'Natal Charts',
            'Transit Charts',
            'Progressions',
            'Composite &amp; Davison Charts',
            'Solar/Lunar/etc. Return Charts',
            'Solar &amp; Lunar Eclipse Charts',
            'Aspect Interpretations',
            'And More!'
        ];
    };

    //Note: This module exports a function. That means that you, the developer, can create multiple instances.
    //This pattern is also recognized by Durandal so that it can create instances on demand.
    //If you wish to create a singleton, you should export an object instead of a function.
    //See the "flickr" module for an example of object export.

    return ctor;
});