var NeuronMesh = (function () {
    function NeuronMesh(scene, scale) {
        this.scene = scene;
        this.scale = scale;
        this.setMaterials();
        this.curve = randomPath(this.scale, this.scale / 20, this.scale / 60);
        this.draw();
    }
    NeuronMesh.prototype.draw = function () {
        var scale = this.scale;
        this.mesh = BABYLON.Mesh.CreateTube('tube', this.curve.path, this.scale / 200, 60, null, 0, this.scene, true, BABYLON.Mesh.FRONTSIDE);
        this.mesh.material = this.neuronMaterial;
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
    NeuronMesh.prototype.dispose = function () {
        this.scene.removeMesh(this.mesh);
    };
    return NeuronMesh;
})();
