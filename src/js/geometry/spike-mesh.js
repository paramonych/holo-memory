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
        var shoulder = BABYLON.Mesh.CreateSphere('sphere', 4, this.scale / 30, this.scene, false);
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
        this.shoulders.left.material = this.movingSpikeMaterial;
        this.shoulders.right.material = this.movingSpikeMaterial;
    };
    SpikeMesh.prototype.deactivate = function () {
        this.shoulders.left.material = this.spikeMaterial;
        this.shoulders.right.material = this.spikeMaterial;
    };
    SpikeMesh.prototype.setMaterials = function () {
        this.spikeMaterial = new BABYLON.StandardMaterial('silent-spike', this.scene);
        this.spikeMaterial.alpha = 0;
        this.movingSpikeMaterial = new BABYLON.StandardMaterial('moving-spike', this.scene);
        this.movingSpikeMaterial.emissiveColor = new BABYLON.Color3(1, .2, 0);
        this.movingSpikeMaterial.ambientColor = new BABYLON.Color3(0, 0, 1);
        this.movingSpikeMaterial.alpha = 0.9;
    };
    SpikeMesh.prototype.dispose = function () {
        this.scene.removeMesh(this.shoulders.left);
        this.scene.removeMesh(this.shoulders.right);
    };
    return SpikeMesh;
})();
