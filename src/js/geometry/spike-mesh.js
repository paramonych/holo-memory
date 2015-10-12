var SpikeMesh = (function () {
    function SpikeMesh(scene, position, rotation, neuronLength) {
        this.scene = scene;
        this.position = position;
        this.rotation = rotation;
        this.neuronLength = neuronLength;
        this.shift = new BABYLON.Vector3(0.01, 0.01, 0.01);
        this.setMaterials();
        this.constructShoulders();
    }
    SpikeMesh.prototype.constructShoulders = function () {
        this.shoulders = shouldersFrom(this.constructShoulderMesh(), this.constructShoulderMesh());
        this.deactivate();
    };
    SpikeMesh.prototype.constructShoulderMesh = function () {
        var scale = this.neuronLength / 3;
        var shoulder = BABYLON.Mesh.CreateCylinder('cylinder', scale / 50, 2 / scale, 2 / scale, scale, 1, this.scene, false);
        shoulder.position = this.position;
        shoulder.rotation = this.rotation;
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
        this.shoulders.left.position = this.position;
        this.shoulders.right.position = this.position;
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
    return SpikeMesh;
})();
