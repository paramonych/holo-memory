var Spirit = (function () {
    function Spirit(position, scene, cortexState) {
        this.position = position;
        this.scene = scene;
        this.cortexState = cortexState;
        this.id = getUniqueId();
        this.isHighlighted = false;
        this.alpha = 1;
        this.stringId = this.id.toString();
        this.draw();
    }
    Spirit.prototype.draw = function () {
        var scale = this.cortexState.scale;
        this.mesh = BABYLON.Mesh.CreateBox('a', SPIRIT_SIZE, this.scene);
        this.mesh.material = defaultMaterial(this.scene);
        this.mesh.position = this.position;
        this.deactivate();
    };
    Spirit.prototype.highlightCube = function () {
        var newMaterialConfig = invisibleMaterial;
        var alpha = 0.007;
        if (!this.isHighlighted) {
            newMaterialConfig = selectedMaterial;
            alpha = 0.02;
        }
        resetMaterial(this.mesh.material, newMaterialConfig, alpha);
    };
    Spirit.prototype.setAlpha = function (value) {
        this.alpha = value;
        setAlpha(this.mesh.material, value);
    };
    Spirit.prototype.activate = function () {
        this.isHighlighted = true;
        this.highlightCube();
    };
    Spirit.prototype.deactivate = function () {
        this.isHighlighted = false;
        this.highlightCube();
    };
    Spirit.prototype.dispose = function () {
        this.scene.removeMesh(this.mesh);
        this.mesh.dispose();
        this.mesh = null;
        this.scene = null;
        this.cortexState = null;
    };
    return Spirit;
}());
