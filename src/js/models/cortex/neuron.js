var Neuron = (function () {
    function Neuron(cortex, type) {
        this.cortex = cortex;
        this.type = type;
        this.id = getUniqueId();
        this.code = getRandomSixMap();
        this.mesh = new NeuronMesh(this.synapces, this.type, this.cortex.scene, this.cortex.cortexState);
        this.toDefaultState();
        this.createSynapces();
    }
    Neuron.prototype.includeInSignal = function () {
        this.type = NeuronType.Medium;
        this.mesh.resetMaterials(this.type);
        this.synapces.forEach(function (synapce) {
            synapce.reset();
        });
    };
    Neuron.prototype.dropToInitialState = function (type) {
        this.type = type;
        this.mesh.resetMaterials(this.type);
        this.synapces.forEach(function (synapce) {
            synapce.reset();
        });
        this.preventSpikes();
    };
    Neuron.prototype.allowSpikes = function () {
        this.createSpike();
        this.startWatchForSpike();
        this.mesh.select();
    };
    Neuron.prototype.preventSpikes = function () {
        this.disposeSpike();
    };
    Neuron.prototype.setProgenyCodeMesh = function () {
        var scene = this.cortex.scene;
        var scale = this.cortex.scale;
        var path = this.mesh.curve.path;
        var code = toValues(this.code).join('');
        this.codeMesh = new Code(scene, scale, path[Math.floor(path.length / 2)], code, true);
    };
    Neuron.prototype.hasCodeMesh = function () {
        return (this.codeMesh !== void 0);
    };
    Neuron.prototype.getId = function () {
        return this.id.toString();
    };
    Neuron.prototype.play = function () {
        if (isMedium(this.type) && this.spike) {
            this.spike.tense.play();
        }
    };
    Neuron.prototype.pause = function (time) {
        if (isMedium(this.type) && this.spike) {
            this.spike.tense.pause(time);
        }
    };
    Neuron.prototype.resume = function () {
        if (isMedium(this.type) && this.spike) {
            this.spike.tense.resume();
        }
    };
    Neuron.prototype.progress = function (value) {
        if (isMedium(this.type) && this.spike) {
            this.spike.tense.progress(value);
        }
    };
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
        if (isMedium(this.type) && this.spike) {
            this.spike.reset();
        }
    };
    Neuron.prototype.createSynapces = function () {
        this.synapces = new Array();
        var scale = this.cortex.cortexState.scale;
        var synapcesAmount = this.cortex.cortexState.synapcesAmount;
        var path = this.mesh.curve.path;
        for (var i = 0; i < synapcesAmount; i++) {
            var position = path[i * 2 + 1];
            var synapce = new Synapce(this, position.clone());
            this.synapces.push(synapce);
        }
        this.mesh.setSynapces(this.synapces);
    };
    Neuron.prototype.resetSynapces = function () {
        this.disposeSynapces();
        this.createSynapces();
    };
    Neuron.prototype.hide = function () {
        this.mesh.setAlpha(0.07);
        if (this.spike) {
            this.spike.setAlpha(0.07);
        }
    };
    Neuron.prototype.show = function () {
        this.mesh.setAlpha(1);
        if (this.spike) {
            this.spike.setAlpha(1);
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
        this.disposeSpike();
        this.disposeSynapces();
        this.disposeMesh();
        this.disposeCodeMesh();
        this.state = null;
    };
    Neuron.prototype.disposeSpike = function () {
        if (this.spike) {
            this.spike.dispose();
            this.spike = null;
        }
    };
    Neuron.prototype.disposeCodeMesh = function () {
        if (this.codeMesh && this.codeMesh.dispose) {
            this.codeMesh.dispose();
            this.codeMesh = null;
        }
    };
    Neuron.prototype.disposeMesh = function () {
        this.mesh.dispose();
        this.mesh = null;
    };
    Neuron.prototype.disposeSynapces = function () {
        _.each(this.synapces, function (synapce) {
            synapce.dispose();
        });
        this.synapces = null;
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
    Neuron.prototype.disposeMediators = function () {
        _.each(this.synapces, function (synapce) { synapce.resetMediator(); });
    };
    return Neuron;
}());
