var GemManager = function(scene) {
    this.scene = scene;
    this.gems = this.createEmptyArray();
};

GemManager.prototype.loadContent = function() {
    for(var y = 0; y < this.gems.length; y++) {
        for(var x = 0; x < this.gems[y].length; x++) {
            this.gems[y][x].loadContent();
        }
    }
};

GemManager.prototype.init = function() {
    for(var y = 0; y < this.gems.length; y++) {
        for(var x = 0; x < this.gems[y].length; x++) {
            this.gems[y][x].init();
        }
    }
};

GemManager.prototype.createEmptyArray = function() {
    var arr = [];
    for(var y = 0; y < this.scene.levelHeight; y++) {
        arr[y] = [];
        for(var x = 0; x < this.scene.levelWidth; x++) {
            arr[y][x] = -1
        }
    }

    return arr;
};

GemManager.prototype.newLine = function() {
    var gem;
    var tempGems = this.createEmptyArray();

    for(var y = 0; y < this.gems.length; y++) {
        for(var x = 0; x < this.gems[y].length; x++) {
            gem = this.gems[y][x];
            
            if(gem !== -1) { gem.y++; } 
            if(y + 1 < this.scene.levelHeight) {
                tempGems[y + 1][x] = gem;
            }
        }
    }
    
    var random, type;
    for(var i = 0; i < this.scene.levelWidth; i ++) {
        random = Number((Math.random() * 3).toFixed());
        type = random === 0 ? GemType.red : (
               random === 1 ? GemType.green : (
               random === 2 ? GemType.blue : (
               random === 3 ? GemType.yellow : null)));
        tempGems[0][i] = new Gem(this.scene, i, 0, this.scene.gemSize, type);
    }
    
    this.gems = tempGems;
    this.checkIfDead();
};

GemManager.prototype.checkIfDead = function() {
    for(var x = 0; x < this.gems[this.gems.length - 1].length; x++) {
        gem = this.gems[this.gems.length - 1][x];
        if(gem !== -1) {
            this.scene.isPlaying = false;
            break;
        }
    }
};

GemManager.prototype.update = function() {
    for(var y = 0; y < this.gems.length; y++) {
        for(var x = 0; x < this.gems[y].length; x++) {
            if(this.gems[y][x] !== -1) {
                this.gems[y][x].update();
            }
        }
    }
};

GemManager.prototype.draw = function() {
    for(var y = 0; y < this.gems.length; y++) {
        for(var x = 0; x < this.gems[y].length; x++) {
            if(this.gems[y][x] !== -1) {
                this.gems[y][x].draw();
            }
        }
    }
};