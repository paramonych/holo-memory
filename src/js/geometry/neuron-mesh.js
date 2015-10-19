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
        this.mesh = BABYLON.Mesh.CreateTube('t', this.curve.path, this.scale / 200, 60, null, 0, this.scene, true, BABYLON.Mesh.FRONTSIDE);
        this.mesh.material = this.material;
    };
    NeuronMesh.prototype.setMaterials = function () {
        this.material = new BABYLON.StandardMaterial('i', this.scene);
        this.material.alpha = 1;

        this.activeMaterial = new BABYLON.StandardMaterial('a', this.scene);
        //this.activeMaterial.emissiveColor = new BABYLON.Color3(1, .9, 0);
        //this.activeMaterial.ambientColor = new BABYLON.Color3(0, 0, 1);
        this.activeMaterial.alpha = 0.3;
    };
    NeuronMesh.prototype.activate = function () {
        this.mesh.material = this.activeMaterial;
    };
    NeuronMesh.prototype.deactivate = function () {
        this.mesh.material = this.material;
    };
    NeuronMesh.prototype.dispose = function () {
        this.scene.removeMesh(this.mesh);
    };
    return NeuronMesh;
})();
