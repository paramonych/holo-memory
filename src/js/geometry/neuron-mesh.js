var NeuronMesh = (function () {
    function NeuronMesh(neuron, scene, cortexState) {
        this.neuron = neuron;
        this.scene = scene;
        this.cortexState = cortexState;
        this.isHighlighted = false;
        this.setMaterials();
        this.curve = randomPath(this.cortexState.scale, (this.cortexState.synapcesAmount + 1) * 2);
        this.draw();
    }
    NeuronMesh.prototype.draw = function () {
        var scale = this.cortexState.scale;
        this.mesh = BABYLON.Mesh.CreateTube('t', this.curve.path, this.cortexState.scale / 400, 60, null, 0, this.scene, true, BABYLON.Mesh.FRONTSIDE);
        this.mesh.material = this.material;
        if (this.mesh.actionManager) {
            this.mesh.actionManager.dispose();
        }
        this.mesh.actionManager = new BABYLON.ActionManager(this.scene);
        var self = this;
        this.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function () {
            if (!self.isHighlighted) {
                self.highlightNeuron(self.activeMaterial, false);
            }
        }));
        this.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function () {
            if (!self.isHighlighted) {
                self.highlightNeuron(self.material, false);
            }
        }));
        this.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnLeftPickTrigger, function () {
            self.highlightNeuron((self.isHighlighted ? self.material : self.activeMaterial), !self.isHighlighted);
        }));
    };
    NeuronMesh.prototype.highlightNeuron = function (material, isHighlighted) {
        this.isHighlighted = isHighlighted;
        this.mesh.material = material;
        this.neuron.synapces.forEach(function (synapce) {
            synapce.mesh.mesh.material = material;
            synapce.mesh.synapceLegMesh.material = material;
        });
    };
    NeuronMesh.prototype.setMaterials = function () {
        if (isMedium(this.neuron.type)) {
            this.material = forMediumNeuron(this.scene);
        }
        else {
            this.material = forProgenyNeuron(this.scene);
        }
        this.activeMaterial = forActiveNeuron(this.scene);
    };
    NeuronMesh.prototype.activate = function () {
        this.mesh.material = this.activeMaterial;
    };
    NeuronMesh.prototype.deactivate = function () {
        this.mesh.material = this.material;
    };
    NeuronMesh.prototype.dispose = function () {
        this.mesh.actionManager.dispose();
        this.mesh.actionManager = null;
        this.scene.removeMesh(this.mesh);
        this.mesh.dispose();
        this.mesh = null;
    };
    return NeuronMesh;
}());
