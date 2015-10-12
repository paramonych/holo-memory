var Neuron = (function () {
    function Neuron(scene, scale) {
        var _this = this;
        this.scene = scene;
        this.scale = scale;
        this.receptorCluster = new Array();
        this.activatable = false;
        this.neuron = new NeuronMesh(this.scene, this.scale);
        this.toDefaultState();
        this.spike = new Spike(this.scene, this.neuron.position, this.neuron.rotation, this.neuron.length, this.state);
        this.spike.state.subscribe(function (state) {
            if (state === StateType.Silent) {
                _this.deactivate();
            }
        });
    }
    Neuron.prototype.dispose = function () {
        this.spike.dispose();
        this.scene.removeMesh(this.neuron.mesh);
    };
    Neuron.prototype.react = function () {
        this.reset();
        this.activate();
    };
    Neuron.prototype.build = function () {
        this.neuron.draw();
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
            this.neuron.activate();
        }
        else if (newState === StateType.Silent) {
            this.neuron.deactivate();
        }
    };
    Neuron.prototype.toDefaultState = function () {
        var _this = this;
        this.state = ko.observable(StateType.Silent);
        this.state.subscribe(function (state) { return _this.serveState(state); });
    };
    return Neuron;
})();
var StateType;
(function (StateType) {
    StateType[StateType['Active'] = 0] = 'Active';
    StateType[StateType['Silent'] = 1] = 'Silent';
})(StateType || (StateType = {}));
