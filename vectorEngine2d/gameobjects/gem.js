var Gem = function(scene, x, y, size, type) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.size = size;
    this.type = type;
};

Gem.prototype.loadContent = function() {
    
};

Gem.prototype.init = function() {
    
};

Gem.prototype.update = function() {
    
};

Gem.prototype.draw = function() {
    var renderManager = this.scene.renderManager;
    if(renderManager.wireframes) {
        var radius = this.size / 2;
        
        
        renderManager.drawCircle(
            this.scene.playingFieldX + ((this.x * this.size) + radius), 
            this.scene.playingFieldY + ((this.y * this.size) + radius), radius,
            "transparent", 0, this.type
        );
    }
};