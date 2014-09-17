define(function(require, exports, module) {
    // import dependencies
    var Engine = require('famous/core/Engine');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var ImageSurface = require('famous/surfaces/ImageSurface');

    var AppView = require('views/AppView');

    // create the main context
    var mainContext = Engine.createContext();
    var appView = new AppView();

    mainContext.add(appView);
}); 
