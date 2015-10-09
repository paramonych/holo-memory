var Neuron = (function () {
    function Neuron(scene, scale) {
        var _this = this;
        this.scene = scene;
        this.scale = scale;
        this.receptorCluster = new Array();
        this.activatable = false;
        this.position = randomVector(scale);
        this.rotation = randomAngleVector();
        this.length = scale * 3;
        this.setMaterials();
        this.toDefaultState();
        this.spike = new Spike(this.scene, this.position, this.rotation, this.length, this.state);
        this.spike.state.subscribe(function (state) {
            if (state === StateType.Silent) {
                _this.deactivate();
            }
        });
    }
    Neuron.prototype.dispose = function () {
        this.spike.dispose();
        this.scene.removeMesh(this.mesh);
    };
    Neuron.prototype.draw = function () {
        var scale = this.scale;
        this.mesh = BABYLON.Mesh.CreateCylinder('cylinder', this.length, 2 / scale, 2 / scale, scale, 1, this.scene, false);
        this.mesh.position = this.position;
        this.mesh.rotation = this.rotation;
        if (Math.random() > 0.5) {
            this.activatable = true;
        }
    };
    Neuron.prototype.react = function () {
        if (this.activatable) {
            this.reset();
            this.activate();
        }
    };
    Neuron.prototype.reset = function () {
        this.spike.deactivate();
    };
    Neuron.prototype.activate = function () {
        this.state(StateType.Active);
    };
    Neuron.prototype.deactivate = function () {
        this.state(StateType.Silent);
    };
    Neuron.prototype.serveState = function (newState) {
        if (newState === StateType.Active) {
            this.mesh.material = this.activeNeuronMaterial;
        }
        else if (newState === StateType.Silent) {
            this.mesh.material = this.neuronMaterial;
        }
    };
    Neuron.prototype.toDefaultState = function () {
        var _this = this;
        this.state = ko.observable(StateType.Silent);
        this.state.subscribe(function (state) { return _this.serveState(state); });
    };
    Neuron.prototype.setMaterials = function () {
        this.neuronMaterial = new BABYLON.StandardMaterial('silent-neuron', this.scene);
        this.neuronMaterial.alpha = 1;
        this.activeNeuronMaterial = new BABYLON.StandardMaterial('active-neuron', this.scene);
        this.activeNeuronMaterial.emissiveColor = new BABYLON.Color3(1, .9, 0);
        this.activeNeuronMaterial.ambientColor = new BABYLON.Color3(0, 0, 1);
        this.activeNeuronMaterial.alpha = 0.3;
    };
    return Neuron;
})();
var StateType;
(function (StateType) {
    StateType[StateType['Active'] = 0] = 'Active';
    StateType[StateType['Silent'] = 1] = 'Silent';
})(StateType || (StateType = {}));
