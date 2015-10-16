var SpikeMesh = (function () {
    function SpikeMesh(scene, scale, synapcePosition) {
        this.scene = scene;
        this.scale = scale;
        this.shift = new BABYLON.Vector3(0.01, 0.01, 0.01);
        this.position = synapcePosition.clone();
        this.setMaterials();
        this.constructShoulders();
    }
    SpikeMesh.prototype.constructShoulders = function () {
        this.shoulders = shouldersFrom(this.constructShoulderMesh(), this.constructShoulderMesh());
        this.deactivate();
    };
    SpikeMesh.prototype.constructShoulderMesh = function () {
        var shoulder = BABYLON.Mesh.CreateSphere('s', 4, this.scale / 30, this.scene, false);
        shoulder.position = this.position;
        return shoulder;
    };
    SpikeMesh.prototype.move = function () {
        var left = this.shoulders.left.position;
        var right = this.shoulders.right.position;
        var newLeft = left.add(this.shift);
        var newRight = newLeft.negate();
        this.shoulders.left.position = newLeft;
        this.shoulders.right.position = newRight;
    };
    SpikeMesh.prototype.reset = function () {
    };
    SpikeMesh.prototype.activate = function () {
        this.shoulders.left.material = this.activeMaterial;
        this.shoulders.right.material = this.activeMaterial;
    };
    SpikeMesh.prototype.deactivate = function () {
        this.shoulders.left.material = this.material;
        this.shoulders.right.material = this.material;
    };
    SpikeMesh.prototype.setMaterials = function () {
        this.material = new BABYLON.StandardMaterial('i', this.scene);
        this.material.alpha = 0;
        this.activeMaterial = new BABYLON.StandardMaterial('a', this.scene);
        this.activeMaterial.emissiveColor = new BABYLON.Color3(1, .2, 0);
        this.activeMaterial.ambientColor = new BABYLON.Color3(0, 0, 1);
        this.activeMaterial.alpha = 0.9;
    };
    SpikeMesh.prototype.dispose = function () {
        this.scene.removeMesh(this.shoulders.left);
        this.scene.removeMesh(this.shoulders.right);
    };
    return SpikeMesh;
})();
