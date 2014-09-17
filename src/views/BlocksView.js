define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');



    function BlocksView() {
        View.apply(this, arguments);

        _createBlocks.call(this);
        _populateCols.call(this);
        console.log(this.options.containers)
        _renderColContainers.call(this, 0, 0);
    }

    BlocksView.prototype = Object.create(View.prototype);
    BlocksView.prototype.constructor = BlocksView;

    BlocksView.DEFAULT_OPTIONS = {
        data: [],
        containers: [],
        width: 1000,
        height: 500,
        numContainers: 10,
        numBoxes: 100
    };

    function _createBlocks() {
        var width, height;
        var block;
        var rand1, rand2;
        for (var i = 0; i < this.options.numBoxes; i++) {
            rand1 = Math.random();
            rand2 = Math.random();
            width =  rand1 < 0.67 ? rand1 < 0.33 ? 100 : 50 : 25
            // height = rand2 < 0.67 ? rand2 < 0.33 ? 100 : 50 : 25
            // width = rand1 < 0.5 ? 100 : 50 
            height = rand2 < 0.5 ? 100 : 50 

            block = new Block(width, height, i);
            this.options.data.push(block);
        }
    }

    function Block(width, height, num) {
        this.width = width;
        this.height = height;
        this.id = num;

        this.background = new Surface({
            size: [width, height],
            content: ''+num,
            properties: {
                color: 'white',
                textAlign: 'center',
                backgroundColor: 'black',
                border: '1px solid white'
            }
        })
    }

    function Column(block, width, height, stop) {
        this.width = width;
        this.height = height;
        this.space = height - block.height;
        if (!stop) {
            this.storage = [new Row(block,width,block.height,true)];
        } else {
            this.storage = [block];
        }
    }

    function Row(block, width, height, stop) {
        this.width = width;
        this.height = height;
        this.space = width - block.width;
        if (!stop) {
            this.storage = [new Column(block,block.width,height,true)];
        } else {
            this.storage = [block];
        }
    }

    Column.prototype.add = Row.prototype.add = function(item) {
        this.storage.push(item);
    }

    function _placeInCol(block, col) {
        if (!col || col instanceof Block) return false;
        if (block.width > col.width) return false;
        var j = 0;
        var row = col.storage[0];
        while (!_placeInRow(block,row)) {
            if (!row) {
                if (block.height > col.space) return false;
                col.add( new Row(block, col.width, block.height, true) );
                col.space -= block.height;
                return true;
            } else {
                row = col.storage[++j];
            }
        }
        return true;
    }

    function _placeInRow(block, row) {
        if (!row || row instanceof Block) return false;
        if (block.height > row.height) return false;
        var j = 0;
        var col = row.storage[0];
        while (!_placeInCol(block,col)) {
            if (!col) {
                if (block.width > row.space) return false;
                row.add( new Column(block, block.width, row.height, true) );
                row.space -= block.width;
                return true;
            } else {
                col = row.storage[++j];
            }
        }
        return true;
    }

    function _populateCols() {
        var blocks = this.options.data;
        var containers = this.options.containers;
        var col;
        var block;
        var j;
        for (var i = 0; i < blocks.length; i++) {
            block = blocks[i];
            j = 0;
            col = containers[0];
            while (!_placeInCol(block, col)) {
                if (!col) {
                    containers.push( new Column(block, 
                        this.options.width/this.options.numContainers,
                        this.options.height) );
                    break;
                }
                col = containers[++j];
            }
        }
    }

    function _renderCol(x,y,col) {
        if (col instanceof Block) {
            var positionModifier = new StateModifier({     
                transform: Transform.translate(x, y, 0)
            });
            return this.add(positionModifier).add(col.background);    
        }
        var offset = y;
        var row;
        for (var i = 0; i < col.storage.length; i++) {
            row = col.storage[i];
            _renderRow.call(this,x,offset,row);
            offset += row.height;
        }
    }

    function _renderRow(x,y,row) {
        if (row instanceof Block) {
            var positionModifier = new StateModifier({     
                transform: Transform.translate(x, y, 0)
            });
            return this.add(positionModifier).add(row.background);
        }
        var offset = x;
        var col;
        for (var i = 0; i < row.storage.length; i++) {
            col = row.storage[i];
            _renderCol.call(this,offset,y,col);
            offset += col.width;
        }
    }

    function _renderColContainers(x,y) {
        var containers = this.options.containers;
        var col;
        var offset = x;
        for (var i = 0; i < containers.length; i++) {
            col = containers[i];
            _renderCol.call(this,offset,y,col);
            offset += col.width;
        }
    }


    module.exports = BlocksView;
});
