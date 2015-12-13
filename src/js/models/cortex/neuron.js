var Neuron = (function () {
    function Neuron(cortex, type) {
        this.cortex = cortex;
        this.type = type;
        this.id = getUniqueId();
        this.synapces = new Array();
        this.chargeTense();
        this.mesh = new NeuronMesh(this.type, this.cortex.scene, this.cortex.scale);
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
    Neuron.prototype.restartTense = function () {
        this.tense.restart();
        this.spike.reset();
    };
    Neuron.prototype.createSynapces = function () {
        var scale = this.cortex.scale;
        var devideFactor = scale / 2;
        var path = this.mesh.curve.path;
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
    Neuron.prototype.chargeTense = function () {
        this.tense = new TimelineMax({ repeat: 0, paused: true });
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
        this.mesh.dispose();
    };
    Neuron.prototype.build = function () {
        this.mesh.draw();
    };
    Neuron.prototype.activate = function () {
        this.state(StateType.Active);
    };
    Neuron.prototype.deactivate = function () {
        this.state(StateType.Silent);
    };
    Neuron.prototype.serveState = function (newState) {
        if (isActiveState(newState)) {
            this.spike.activate();
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
        return this.mesh.mesh;
    };
    Neuron.prototype.watchState = function (action) {
        this.state.subscribe(action);
    };
    return Neuron;
})();
