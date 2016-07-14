var NeuronMesh = (function () {
    function NeuronMesh(synapces, type, scene, cortexState) {
        this.synapces = synapces;
        this.type = type;
        this.scene = scene;
        this.cortexState = cortexState;
        this.isHighlighted = false;
        this.alpha = 1;
        this.isLegatee = false;
        var segmentsAmount = isLowResolution(this.cortexState.resolution) ? (this.cortexState.synapcesAmount + 1) * 2 : 1;
        this.curve = randomPath(this.cortexState.scale, segmentsAmount);
        this.center = vectorMiddlePoint(this.curve[0], this.curve[this.curve.length - 1]);
        this.draw();
        this.setMaterial();
    }
    NeuronMesh.prototype.draw = function () {
        var scale = this.cortexState.scale;
        this.mesh = BABYLON.Mesh.CreateTube('t', this.curve, this.cortexState.scale / 400, 60, null, 0, this.scene, false, BABYLON.Mesh.FRONTSIDE);
        this.mesh.material = defaultMaterial(this.scene);
        this.deactivate();
        this.registerActions();
    };
    NeuronMesh.prototype.setSynapces = function (synapces) {
        this.synapces = synapces;
    };
    NeuronMesh.prototype.registerActions = function () {
        if (this.mesh.actionManager) {
            this.mesh.actionManager.dispose();
        }
        this.mesh.actionManager = new BABYLON.ActionManager(this.scene);
        var self = this;
        this.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function () {
            if (!self.isHighlighted) {
                self.highlightNeuron(true);
            }
        }));
        this.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function () {
            if (!self.isHighlighted) {
                self.highlightNeuron(false);
            }
        }));
        this.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnLeftPickTrigger, function () {
            self.highlightNeuron();
        }));
    };
    NeuronMesh.prototype.select = function () {
        this.isHighlighted = void 0;
        this.highlightNeuron();
    };
    NeuronMesh.prototype.deselect = function () {
        this.isHighlighted = false;
        this.highlightNeuron(false);
    };
    NeuronMesh.prototype.highlightNeuron = function (isHovered) {
        var newMaterialConfig = (isMedium(this.type) ? mediumMaterial : progenyMaterial);
        var alpha = this.alpha;
        if ((!this.isHighlighted && (isHovered === true)) || isHovered === void 0) {
            newMaterialConfig = this.isLegatee ? activeMaterial : selectedMaterial;
            alpha = 1;
        }
        if (isHovered === void 0) {
            this.isHighlighted = !this.isHighlighted;
        }
        resetMaterial(this.mesh.material, newMaterialConfig, alpha);
        if (isLowResolution(this.cortexState.resolution) && this.synapces) {
            this.synapces.forEach(function (synapce) {
                resetMaterial(synapce.mesh.mesh.material, newMaterialConfig, alpha);
                resetMaterial(synapce.mesh.synapceLegMesh.material, newMaterialConfig, alpha);
            });
        }
    };
    NeuronMesh.prototype.setAlpha = function (value) {
        this.alpha = value;
        setAlpha(this.mesh.material, value);
        if (isLowResolution(this.cortexState.resolution) && this.synapces) {
            this.synapces.forEach(function (synapce) {
                setAlpha(synapce.mesh.mesh.material, Math.floor(value));
                setAlpha(synapce.mesh.synapceLegMesh.material, Math.floor(value));
                if (synapce.codeMesh) {
                    setAlpha(synapce.codeMesh.mesh.material, Math.floor(value));
                }
            });
        }
    };
    NeuronMesh.prototype.setMaterial = function () {
        if (isMedium(this.type)) {
            resetMaterial(this.mesh.material, mediumMaterial);
        }
        else {
            resetMaterial(this.mesh.material, progenyMaterial);
        }
    };
    NeuronMesh.prototype.setLegatee = function (value) {
        this.isLegatee = value;
    };
    NeuronMesh.prototype.resetMaterials = function (type) {
        this.type = type;
        this.setMaterial();
        this.isHighlighted = void 0;
    };
    NeuronMesh.prototype.activate = function () {
        resetMaterial(this.mesh.material, activeMaterial);
    };
    NeuronMesh.prototype.deactivate = function () {
        this.setMaterial();
    };
    NeuronMesh.prototype.dispose = function () {
        this.mesh.actionManager.dispose();
        this.mesh.actionManager = null;
        this.scene.removeMesh(this.mesh);
        this.mesh.dispose();
        this.mesh = null;
        this.curve = null;
        this.synapces = null;
        this.type = null;
        this.scene = null;
        this.cortexState = null;
    };
    return NeuronMesh;
}());
