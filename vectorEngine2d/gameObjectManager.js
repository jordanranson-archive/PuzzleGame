var GameObjectManager = function(scene) {
    this.scene = scene;
    this.gameObjects = [];
};

GameObjectManager.prototype.loadContent = function() {
    for(var i = 0; i < this.gameObjects.length; i++) {
        this.gameObjects[i].loadContent();
    }
}

GameObjectManager.prototype.addObject = function(gameObject) {
    this.gameObjects.push(gameObject);
};

GameObjectManager.prototype.update = function() {
    for(var i = 0; i < this.gameObjects.length; i++) {
        this.gameObjects[i].update();
    }
};

GameObjectManager.prototype.draw = function() {
    for(var i = 0; i < this.gameObjects.length; i++) {
        this.gameObjects[i].draw();
    }
};