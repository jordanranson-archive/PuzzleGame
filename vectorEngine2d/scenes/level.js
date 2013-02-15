var Level = function(game, levelId) {
    this.renderManager = game.renderManager;
    this.resourceManager = game.resourceManager;
    this.inputManager = game.inputManager;
    this.sceneManager = game.sceneManager;
    this.levelWidth = 7;
    this.levelHeight = 12;
    this.gemSize = 48;
    this.playingFieldX = (this.renderManager.canvas.width - this.levelWidth * this.gemSize) / 2;
    this.playingFieldY = 100;
    this.gameObjectManager = new GameObjectManager(this);
    this.gemManager = new GemManager(this);
    this.game = game;
    
    // States
    this.isPlaying = true;
    this.isRunning = false;
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
    
    this.gameObjectManager.addObject(new Player(this));
    this.gemManager.newLine();
    
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
    }
};

Level.prototype.draw = function() {
    // Gameplay area
    if(this.renderManager.wireframes) {
        this.renderManager.drawRectangle(
            this.playingFieldX - 2, this.playingFieldY - 2, (this.levelWidth * this.gemSize) + 4, (this.levelHeight * this.gemSize) + 4, "#666", 4, "transparent"
        );
    }
    
    // Draw game objects
    this.gemManager.draw();
    this.gameObjectManager.draw();
    
    // Draw pause menu
    if(this.isPaused) {
        this.renderManager.drawRectangle(
            0, 0, this.renderManager.canvas.width, this.renderManager.canvas.height,
            "transparent", 0, "rgba(0,0,0,0.5)"
        );
        this.renderManager.drawText(
            this.renderManager.canvas.width / 2, this.renderManager.canvas.height / 2,
            "#ffffff", "20pt sans-serif", "center", "Game Paused"
        );
    }
};