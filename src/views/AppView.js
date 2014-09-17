define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');

    var BlocksView = require('views/BlocksView');

    function AppView() {
        View.apply(this, arguments);

        _createBlocksView.call(this);
    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    AppView.DEFAULT_OPTIONS = {
    };

    function _createBlocksView() {
        var blocksView = new BlocksView();

        var positionModifier = new StateModifier({
            transform: Transform.translate(50, 50, 0)
        });
        this.add(positionModifier).add(blocksView);
    }

    module.exports = AppView;
});
