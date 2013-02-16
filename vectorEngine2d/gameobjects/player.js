var Player = function(scene, y) {
    this.scene = scene;
    this.x = 3;
    this.y = y;
    this.lastX = 3;
    
    this.inventorySize = 4;
    this.heldGems = [];
    
    this.init();
};

Player.prototype.loadContent = function() {
    
};

Player.prototype.init = function() {
    var _this = this;
    
    this.scene.inputManager.addKeyEvent(Key.rightArrow, function() {
        if(!_this.scene.isPaused && _this.scene.isPlaying) {
            if(_this.x >= _this.scene.levelWidth - 1) { _this.x = 0; }
            else { _this.x++; }
        }
    });
    
    this.scene.inputManager.addKeyEvent(KeyAction.backward, function() {
        if(!_this.scene.isPaused && _this.scene.isPlaying) {
            if(_this.x <= 0) { _this.x = _this.scene.levelWidth - 1; }
            else { _this.x--; }
        }
    });
    
    this.scene.inputManager.addKeyEvent(Key.h, function() {
        if(_this.scene.isPlaying && _this.scene.isPlaying) {
            _this.scene.gemManager.newLine();
            _this.forceUpdate();
        }
    });
    
    this.scene.inputManager.addKeyEvent(KeyAction.down, function() {
        if(!_this.scene.isPaused && _this.scene.isPlaying) {
            if(_this.heldGems.length > 0) {
                var heldGems = _this.scene.gemManager.getClosestGroup(_this.x, _this.inventorySize - _this.heldGems.length, _this.heldGems[0].type);
                for(var i = 0; i < heldGems.length; i++) {
                    _this.heldGems.push(heldGems[i]);
                }
            } else {
                var heldGems = _this.scene.gemManager.getClosestGroup(_this.x, _this.inventorySize);
                for(var i = 0; i < heldGems.length; i++) {
                    _this.heldGems.push(heldGems[i]);
                }
            }
            _this.forceUpdate();
        }
    });
    
    this.scene.inputManager.addKeyEvent(KeyAction.up, function() {
        if(!_this.scene.isPaused) {
            if(_this.heldGems) {
                if(_this.scene.gemManager.placeGems(_this.x, _this.heldGems)) {
                    _this.scene.gemManager.tryToClear(_this.x, _this.heldGems[0].type);
                    _this.heldGems = [];
                    _this.forceUpdate();
                }
            }
        }
    });
};

Player.prototype.forceUpdate = function() {
    this.y = this.scene.gemManager.findClosestOpen(this.x);
};

Player.prototype.update = function() {
    if(this.x !== this.lastX) {
        this.y = this.scene.gemManager.findClosestOpen(this.x);
    }
    
    this.lastX = this.x;
};

Player.prototype.draw = function() {
    var renderManager = this.scene.renderManager;
    if(renderManager.wireframes) {
        
        
        var radius = this.scene.gemSize / 2;
        var ptx = this.scene.playingFieldX + (this.x * this.scene.gemSize) + radius;
        var pty = this.scene.playingFieldY + (this.y * this.scene.gemSize) + radius;
        var basey = this.scene.playingFieldY + (this.scene.levelHeight * this.scene.gemSize) - radius;
        var topy = this.scene.playingFieldY - radius;
        
        var playerColor;
        if(this.heldGems.length > 0) {
            playerColor = this.heldGems[0].type;
        } else {
            playerColor = "#ccc";
        }
        
        var flash = this.scene.game.curTime % 3 == 0 ? "#f0f" : (this.scene.game.curTime % 3 == 1 ? "#0ff" : "#ff0");
        //renderManager.drawRectangle(ptx - radius + 2, pty - radius + 2, (radius * 2) - 4, (radius * 2) - 4, color, 4, "transparent");
        
        renderManager.drawLine(ptx, pty + radius + 16, ptx, basey, "#242424", 6);
        renderManager.drawPolyline(
            [
                {x: ptx - 12, y: pty + 24 + radius},
                {x: ptx,     y: pty + 8 + radius},
                {x: ptx + 12, y: pty + 24 + radius},
                {x: ptx - 12, y: pty + 24 + radius}
            ],
            "transparent", 0, playerColor
        );
        renderManager.drawCircle(ptx, basey, radius / 2, "transparent", 0, playerColor);
    }
};