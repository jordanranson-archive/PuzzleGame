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
    this.newLineInterval = 5000;
    
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
            "transparent", 0, "rgba(0,0,0,0.5)"
        );
        this.renderManager.drawText(
            this.renderManager.canvas.width / 2 + 2, this.renderManager.canvas.height / 2 + 2,
            "#000", "20pt sans-serif", "center", "Paused"
        );
        this.renderManager.drawText(
            this.renderManager.canvas.width / 2, this.renderManager.canvas.height / 2,
            "#fff", "20pt sans-serif", "center", "Paused"
        );
    }
};