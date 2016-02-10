var SynapceMesh = (function () {
    function SynapceMesh(scene, scale, position, type) {
        this.scene = scene;
        this.scale = scale;
        this.position = position;
        this.type = type;
        this.setMaterials();
        this.draw();
    }
    SynapceMesh.prototype.draw = function () {
        this.mesh = BABYLON.Mesh.CreateSphere('s', 4, this.scale / (isMedium(this.type) ? 50 : 100), this.scene, false);
        this.mesh.position = this.position;
        this.deactivate();
    };
    SynapceMesh.prototype.affect = function (frontPosition) {
        return this.isCloseEnough(frontPosition.one) || this.isCloseEnough(frontPosition.two);
    };
    SynapceMesh.prototype.isCloseEnough = function (vector) {
        var delta = this.scale / 4;
        var x = Math.abs(this.position.x - vector.x);
        var y = Math.abs(this.position.y - vector.y);
        var z = Math.abs(this.position.z - vector.z);
        console.debug('delta', x, y, z, delta);
        return x < delta && y < delta && z < delta;
    };
    SynapceMesh.prototype.activate = function () {
        this.mesh.material = this.activeMaterial;
    };
    SynapceMesh.prototype.deactivate = function () {
        this.mesh.material = this.material;
    };
    SynapceMesh.prototype.setMaterials = function () {
        if (isMedium(this.type)) {
            this.material = forMediumNeuron(this.scene);
            this.activeMaterial = forMediumActiveNeuron(this.scene);
        }
        else {
            this.material = forProgenyNeuron(this.scene);
            this.activeMaterial = forProgenyActiveNeuron(this.scene);
        }
        var alpha = 0.7;
        this.material.alpha = alpha;
        this.activeMaterial.alpha = alpha;
    };
    SynapceMesh.prototype.dispose = function () {
        this.scene.removeMesh(this.mesh);
    };
    return SynapceMesh;
}());
