var Neuron = (function () {
    function Neuron(cortex) {
        this.cortex = cortex;
        this.synapces = new Array();
        this.neuron = new NeuronMesh(this.cortex.scene, this.cortex.scale);
        this.toDefaultState();
        this.createSpike();
        this.createSynapces();
        this.startWatchForSpike();
    }
    Neuron.prototype.createSpike = function () {
        var _this = this;
        this.spike = new Spike(this);
        this.spike.state.subscribe(function (state) {
            if (!isActiveState(state)) {
                _this.deactivate();
            }
        });
    };
    Neuron.prototype.createSynapces = function () {
        var scale = this.cortex.scale;
        var devideFactor = scale / 2;
        var path = this.neuron.curve.path;
        var step = Math.floor(path.length / devideFactor);
        var halfStep = Math.floor(step / 2);
        for (var i = 0; i < devideFactor; i++) {
            var position = path[i * step + halfStep];
            var synapce = new Synapce(this, position.clone());
            this.synapces.push(synapce);
            synapce.state.subscribe(function (state) {
                if (!isActiveState(state)) {
                }
            });
        }
    };
    Neuron.prototype.startWatchForSpike = function () {
        var _this = this;
        this.spike.moved.subscribe(function (frontPosition) {
            _.chain(_this.synapces)
                .filter(function (s) { return !s.isActive(); })
                .each(function (s) {
                if (s.mesh.affect(frontPosition)) {
                    s.activate();
                }
            });
        });
    };
    Neuron.prototype.dispose = function () {
        this.spike.dispose();
        _.each(this.synapces, function (synapce) { synapce.dispose(); });
        this.neuron.dispose();
    };
    Neuron.prototype.react = function () {
        if (isActiveState(this.state())) {
            this.deactivate();
        }
        else {
            this.activate();
        }
    };
    Neuron.prototype.build = function () {
        this.neuron.draw();
    };
    Neuron.prototype.activate = function () {
        this.state(StateType.Active);
    };
    Neuron.prototype.deactivate = function () {
        this.state(StateType.Silent);
    };
    Neuron.prototype.serveState = function (newState) {
        if (isActiveState(newState)) {
            this.spike.launch();
        }
        else {
            this.spike.deactivate();
        }
    };
    Neuron.prototype.toDefaultState = function () {
        var _this = this;
        this.state = ko.observable(StateType.Silent);
        this.state.subscribe(function (state) { return _this.serveState(state); });
    };
    Neuron.prototype.getMesh = function () {
        return this.neuron.mesh;
    };
    Neuron.prototype.watchState = function (action) {
        this.state.subscribe(action);
    };
    return Neuron;
})();
