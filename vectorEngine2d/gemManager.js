var GemManager = function(scene) {
    this.scene = scene;
    this.gems = this.createEmptyArray();
    
    this.gemsNeededToClear = 3;
};

GemManager.prototype.loadContent = function() {
    for(var y = 0; y < this.gems.length; y++) {
        for(var x = 0; x < this.gems[y].length; x++) {
            this.gems[y][x].loadContent();
        }
    }
};

// Returns an array the size of the playing field, filled with -1 values
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

// Adds a new line to the top of the playfield
GemManager.prototype.newLine = function() {
    var gem;
    var tempGems = this.createEmptyArray();

    // Shift old gems down 1 space
    for(var y = 0; y < this.gems.length; y++) {
        for(var x = 0; x < this.gems[y].length; x++) {
            gem = this.gems[y][x];
            
            if(gem !== -1) { gem.y++; } 
            if(y + 1 < this.scene.levelHeight) {
                tempGems[y + 1][x] = gem;
            }
        }
    }
    
    // Create a new line of gems to be added
    var random, type;
    for(var i = 0; i < this.scene.levelWidth; i ++) {
        random = Number((Math.random() * 3).toFixed());
        type = random === 0 ? GemType.red : (
               random === 1 ? GemType.green : (
               random === 2 ? GemType.blue : (
               random === 3 ? GemType.yellow : -1)));
        if(type === -1) {
            tempGems[0][i] = -1;
        } else {
            tempGems[0][i] = new Gem(this.scene, i, 0, this.scene.gemSize, type);
        }
    }
    
    this.gems = tempGems;
    this.checkIfDead();
};

// Returns if the playfield is filled, game over if true
GemManager.prototype.checkIfDead = function() {
    for(var x = 0; x < this.gems[this.gems.length - 1].length; x++) {
        gem = this.gems[this.gems.length - 2][x];
        if(gem !== -1) {
            this.scene.isGameOver = true;
            return true;
        }
    }
    
    return false;
};


// Returns the closest group of gems of the same type found
GemManager.prototype.getClosestGroup = function(x, maxLength, gemType, keepGems) {
    var gem;
    var type = -1;
    var found = [];
    
    if(gemType) {
        type = gemType;
    }
    
    for(var y = this.scene.levelHeight - 1; y >= 0; y--) {
        gem = this.gems[y][x];
        
        // Limit the number that can be returned
        if(found.length < maxLength) {
            if(gem !== -1) { // if not air
                if(type === -1) { // on first gem found
                    type = gem.type;
                    found.push(gem);
                    if(!keepGems) { this.gems[y][x] = -1; }
                } else { // find gems of the same type
                    if(gem.type === type) {
                        found.push(gem);
                        if(!keepGems) { this.gems[y][x] = -1; }
                    } else {
                        break;
                    }
                }
            }
        }
    }
    
    return found;
};

// Returns the closest gem y position in the playfield
GemManager.prototype.findClosestOpen = function(x) {
    for(var y = this.scene.levelHeight - 1; y >= 0; y--) {
        if(this.gems[y][x] !== -1) {
            return y;
        }
    }
    
    return -1;
};

// Attempts to place gems in a column
GemManager.prototype.placeGems = function(x, gems) {
    var ystart = this.findClosestOpen(x) + 1;
    var gem;

    for(var y = 0; y < gems.length; y++) {
        // Check if this will cause suicide by placing gems at the kill line
        if(ystart + gems.length === this.scene.levelHeight - 1) {
            // Check if gem exists in location and is of the same type as gem being placed
            if((this.gems[y + ystart - 1] && this.gems[y + ystart - 1][x] && gems[y].type === this.gems[y + ystart - 1][x].type) 
            || (gems.length >= this.gemsNeededToClear)) {
                // Place gem if it will clear, even if it will hit the kill line
                gems[y].y = y + ystart;
                gems[y].x = x;
                this.gems[y + ystart][x] = gems[y];
            } else {
                return false;
            }
        }
        else if(ystart + gems.length > this.scene.levelHeight - 1) {
            return false;
        }
        // Place gem normally
        gems[y].y = y + ystart;
        gems[y].x = x;
        this.gems[y + ystart][x] = gems[y];
    }
    
    return true;
};

// Tries to clear a group of gems
GemManager.prototype.tryToClear = function(x, type) {
    var foundGems = this.getClosestGroup(x, this.scene.levelHeight, type, true);
    if(foundGems.length >= this.gemsNeededToClear) {
        this.clearGems(x, foundGems[0].y, type);
        return true;
    } else {
        return false;
    }
};

// Clears a group of gems using a flood fill algorithm
GemManager.prototype.clearGems = function(x, y, type) {
    if(this.gems[y] && this.gems[y][x] && this.gems[y][x] !== -1 && this.gems[y][x].type === type) {
        this.gems[y][x] = -1;
        this.scene.score += 100;
        this.clearGems(x - 1, y, type);
        this.clearGems(x + 1, y, type);
        this.clearGems(x, y - 1, type);
        this.clearGems(x, y + 1, type);
    }
};

// This method courtesy of github user nickmass (nickmass.com)
GemManager.prototype.collapse = function() {
    var gem, gemBelow;
    var didMove = false;
    
    for(var x = 0; x < this.gems[0].length; x++) {
         for(var y = 0; y < this.gems.length; y++) {
            gem = this.gems[y][x];
            gemBelow = this.gems[y+1] && this.gems[y+1][x] ? this.gems[y+1][x] : -1;

            if(y === 0 && gem === -1) { this.collapseCounter++; }
            
            if(gem === -1 && gemBelow !== -1) {
                didMove = true;
                gemBelow.y--;
                this.gems[y][x] = gemBelow;
                this.gems[y+1][x] = -1;
            }
        }
    }
    if(didMove) { this.collapse(); }
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