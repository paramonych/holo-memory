var NeuronMesh = (function () {
    function NeuronMesh(type, scene, scale) {
        this.type = type;
        this.scene = scene;
        this.scale = scale;
        this.setMaterials();
        this.curve = randomPath(this.scale, this.scale / 20, this.scale / 60);
        this.draw();
    }
    NeuronMesh.prototype.draw = function () {
        var scale = this.scale;
        this.mesh = BABYLON.Mesh.CreateTube('t', this.curve.path, this.scale / 470, 60, null, 0, this.scene, true, BABYLON.Mesh.FRONTSIDE);
        this.mesh.material = this.material;
    };
    NeuronMesh.prototype.setMaterials = function () {
        if (isMedium(this.type)) {
            this.material = forMediumNeuron(this.scene);
            this.activeMaterial = forMediumActiveNeuron(this.scene);
        }
        else {
            this.material = forProgenyNeuron(this.scene);
            this.activeMaterial = forProgenyActiveNeuron(this.scene);
        }
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
