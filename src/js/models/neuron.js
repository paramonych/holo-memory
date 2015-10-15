var Neuron = (function () {
    function Neuron(cortex) {
        this.cortex = cortex;
        this.synapces = new Array();
        this.activatable = false;
        this.neuron = new NeuronMesh(this.cortex.scene, this.cortex.scale);
        this.toDefaultState();
        this.setSynapces();
        this.setSpike(this.synapces[Math.floor(this.synapces.length / 2)]);
    }
    Neuron.prototype.setSpike = function (synapce) {
        var _this = this;
        this.spike = new Spike(this, synapce);
        this.spike.state.subscribe(function (state) {
            if (state === StateType.Silent) {
                _this.deactivate();
            }
        });
    };
    Neuron.prototype.setSynapces = function () {
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
                if (state === StateType.Silent) {
                }
            });
        }
    };
    Neuron.prototype.dispose = function () {
        this.spike.dispose();
        _.each(this.synapces, function (synapce) { synapce.dispose(); });
        this.neuron.dispose();
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
            _.each(this.synapces, function (synapce) {
                if (randomSign() > 0) {
                    synapce.activate();
                }
            });
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
    Neuron.prototype.getMesh = function () {
        return this.neuron.mesh;
    };
    Neuron.prototype.watchState = function (action) {
        this.state.subscribe(action);
    };
    return Neuron;
})();
