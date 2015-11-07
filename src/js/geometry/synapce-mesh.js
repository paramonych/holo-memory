var SynapceMesh = (function () {
    function SynapceMesh(scene, scale, position) {
        this.scene = scene;
        this.scale = scale;
        this.position = position;
        this.setMaterials();
        this.draw();
    }
    SynapceMesh.prototype.draw = function () {
        this.mesh = BABYLON.Mesh.CreateSphere('s', 4, this.scale / 30, this.scene, false);
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
        this.material = new BABYLON.StandardMaterial('i', this.scene);
        this.material.emissiveColor = new BABYLON.Color3(0.17, 0.57, 1);
        this.material.alpha = 0.5;
        this.activeMaterial = this.material;
    };
    SynapceMesh.prototype.dispose = function () {
        this.scene.removeMesh(this.mesh);
    };
    return SynapceMesh;
})();
