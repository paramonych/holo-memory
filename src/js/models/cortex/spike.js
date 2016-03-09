var Spike = (function () {
    function Spike(neuron) {
        this.neuron = neuron;
        this.speed = 1;
        var neuronMesh = this.neuron.getMesh();
        var scene = this.neuron.cortex.scene;
        var scale = this.neuron.cortex.scale;
        this.chargeTense();
        this.mesh = new SpikeMesh(scene, scale, this, SpikeDirection.Forward);
        this.toDefaultState();
        this.deactivate();
        this.moved = ko.observable(doubleVectorFrom(new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 0)));
    }
    Spike.prototype.activate = function () {
        this.state(StateType.Active);
    };
    Spike.prototype.deactivate = function () {
        this.state(StateType.Silent);
    };
    Spike.prototype.reportMovement = function (vectors) {
        this.moved(vectors);
    };
    Spike.prototype.dispose = function () {
        this.mesh.dispose();
        this.mesh = null;
        this.tense = null;
    };
    Spike.prototype.serveState = function (newState) {
        if (newState === StateType.Active) {
            this.mesh.activate();
        }
        else if (newState === StateType.Silent) {
            this.mesh.deactivate();
        }
    };
    Spike.prototype.chargeTense = function () {
        this.tense = new TimelineMax({ repeat: 0, paused: true });
    };
    Spike.prototype.reset = function () {
        this.tense.restart();
        this.mesh.reset();
    };
    Spike.prototype.toDefaultState = function () {
        var _this = this;
        this.state = ko.observable(StateType.Silent);
        this.state.subscribe(function (state) { return _this.serveState(state); });
    };
    return Spike;
}());
