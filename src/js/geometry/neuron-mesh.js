var NeuronMesh = (function () {
    function NeuronMesh(scene, scale) {
        this.scene = scene;
        this.scale = scale;
        this.position = randomVector(scale);
        this.rotation = randomAngleVector();
        this.length = scale * 3;
        this.setMaterials();
    }
    NeuronMesh.prototype.draw = function () {
        var scale = this.scale;
        this.mesh = BABYLON.Mesh.CreateCylinder('cylinder', this.length, 2 / scale, 2 / scale, scale, 1, this.scene, false);
        this.mesh.position = this.position;
        this.mesh.rotation = this.rotation;
    };
    NeuronMesh.prototype.setMaterials = function () {
        this.neuronMaterial = new BABYLON.StandardMaterial('silent-neuron', this.scene);
        this.neuronMaterial.alpha = 1;
        this.activeNeuronMaterial = new BABYLON.StandardMaterial('active-neuron', this.scene);
        this.activeNeuronMaterial.emissiveColor = new BABYLON.Color3(1, .9, 0);
        this.activeNeuronMaterial.ambientColor = new BABYLON.Color3(0, 0, 1);
        this.activeNeuronMaterial.alpha = 0.3;
    };
    NeuronMesh.prototype.activate = function () {
        this.mesh.material = this.activeNeuronMaterial;
    };
    NeuronMesh.prototype.deactivate = function () {
        this.mesh.material = this.neuronMaterial;
    };
    return NeuronMesh;
})();
