var Level = function(game, levelId) {
    this.renderManager = game.renderManager;
    this.resourceManager = game.resourceManager;
    this.inputManager = game.inputManager;
    this.sceneManager = game.sceneManager;
    this.levelWidth = 7;
    this.levelHeight = 13;
    this.gemSize = 48;
    this.playingFieldX = (this.renderManager.canvas.width - this.levelWidth * this.gemSize) / 2;
    this.playingFieldY = 85;
    this.gameObjectManager = new GameObjectManager(this);
    this.gemManager = new GemManager(this);
    this.game = game;
    this.player;
    this.newLineCounter = 0;
    this.newLineInterval = 4000;
    this.timeWhenPaused = 0;
    this.multiplier = 0;
    this.score = 0;
    
    // States
    this.isPlaying = true;
    this.isGameOver = false;
    this.isPaused = false;

    // Add game objects like the player
    //this.gameObjectManager.addObject();
};

Level.prototype.init = function() {
    var _this = this;
    
    // Pause the game
    this.inputManager.addKeyEvent(KeyAction.cancel, function() {
        _this.isPaused = !_this.isPaused;
        if(!_this.isPaused) {
            _this.timeWhenPaused = _this.game.curTime;
        }
    });
    
    /* Debug keys */
    
    // Toggle wireframes
    this.inputManager.addKeyEvent(KeyAction.func1, function() {
        _this.renderManager.wireframes = !_this.renderManager.wireframes;
    }); 
    
    this.player = new Player(this, 0);
    this.gemManager.newLine();
    this.gameObjectManager.addObject(this.player);
    
    // Update first tick early so everything appears to be in position before drawing
    this.update();
};

Level.prototype.loadContent = function() {
    var timestamp = new Date().getTime();
    //this.resourceManager.load("levels/test.txt?" + timestamp, "test-level", ResourceType.text);
    this.gameObjectManager.loadContent();
};

Level.prototype.unload = function(callback) {
    this.inputManager.removeKeyEvent(this.inputManager.keyAction.cancel);
    callback();
};

Level.prototype.update = function() {
    if(!this.isPaused) {
        this.gameObjectManager.update();
        this.gemManager.update();
        
        this.newLineCounter += this.game.curTime - this.game.lastTime;
        if(this.newLineCounter > this.newLineInterval && this.isPlaying) {
            this.gemManager.newLine();
            this.player.forceUpdate();
            this.newLineCounter = 0;
        }
    }
    
    if(this.isGameOver && this.isPlaying) {
        this.isPlaying = false;
    }
};

Level.prototype.draw = function() {
    // Gameplay area
    if(this.renderManager.wireframes) {
        this.renderManager.drawRectangle(
            this.playingFieldX - 2, this.playingFieldY - 2, (this.levelWidth * this.gemSize) + 4, (this.levelHeight * this.gemSize) + 4 - this.gemSize, "#666", 4, "transparent"
        );
        
        this.renderManager.drawText(
            this.renderManager.canvas.width / 2, this.playingFieldY - 38,
            "#ccc", "14pt sans-serif", "center", "Score - " + this.score
        );
        
        for(var i = 0; i < this.player.heldGems.length; i++) {
            this.renderManager.drawCircle(
                this.playingFieldX - this.gemSize / 2 - 15, 
                this.playingFieldY + (i * this.gemSize) + (this.gemSize / 2), this.gemSize / 2,
                "transparent", 0, this.player.heldGems[0].type
            );
        };
        
        var flash;
        if(this.isPaused) {
            flash = this.timeWhenPaused % 3 == 0 ? "#f0f" : (this.timeWhenPaused % 3 == 1 ? "#0ff" : "#ff0");
        } else {
            flash = this.game.curTime % 3 == 0 ? "#f0f" : (this.game.curTime % 3 == 1 ? "#0ff" : "#ff0");
        }
        if(this.player.heldGems.length === this.player.inventorySize) {
            this.renderManager.drawText(
                this.playingFieldX - this.gemSize / 2 - 15 + 1,
                this.playingFieldY + ((this.player.heldGems.length - 1) * this.gemSize) + (this.gemSize / 2) + 4 + 1,
                "#000", "bold 9pt sans-serif", "center", "MAX"
            );
            this.renderManager.drawText(
                this.playingFieldX - this.gemSize / 2 - 15,
                this.playingFieldY + ((this.player.heldGems.length - 1) * this.gemSize) + (this.gemSize / 2) + 4,
                flash, "bold 9pt sans-serif", "center", "MAX"
            );
        }
    }
    
    // Draw game objects
    this.gemManager.draw();
    this.gameObjectManager.draw();
    
    // Game over
    if(this.isGameOver) {
        this.renderManager.drawText(
            this.renderManager.canvas.width / 2 + 2, this.renderManager.canvas.height / 2 + 2,
            "#000", "20pt sans-serif", "center", "Game Over!"
        );
        this.renderManager.drawText(
            this.renderManager.canvas.width / 2, this.renderManager.canvas.height / 2,
            "#fff", "20pt sans-serif", "center", "Game Over!"
        );
    }
    
    // Draw pause menu
    if(this.isPaused) {
        this.renderManager.drawRectangle(
            0, 0, this.renderManager.canvas.width, this.renderManager.canvas.height,
            "transparent", 0, "#141414"
        );
        
        this.renderManager.drawText(
            this.renderManager.canvas.width / 2 + 2, this.renderManager.canvas.height / 2 + 2 - 20,
            "#000", "20pt sans-serif", "center", "Paused"
        );
        this.renderManager.drawText(
            this.renderManager.canvas.width / 2, this.renderManager.canvas.height / 2 - 20,
            "#fff", "20pt sans-serif", "center", "Paused"
        );
        
        this.renderManager.drawText(
            this.renderManager.canvas.width / 2, this.renderManager.canvas.height / 2 + 10,
            "#777", "8pt sans-serif", "center", "LEFT/RIGHT ARROWS - MOVE"
        );
        this.renderManager.drawText(
            this.renderManager.canvas.width / 2, this.renderManager.canvas.height / 2 + 30,
            "#777", "8pt sans-serif", "center", "DOWN ARROW - GRAB GEMS"
        );
        this.renderManager.drawText(
            this.renderManager.canvas.width / 2, this.renderManager.canvas.height / 2 + 50,
            "#777", "8pt sans-serif", "center", "UP ARROW - SHOOT GEMS"
        );
        this.renderManager.drawText(
            this.renderManager.canvas.width / 2, this.renderManager.canvas.height / 2 + 80,
            "#fff", "10pt sans-serif", "center", "Try to match 3 or more gems in a row."
        );
    }
};