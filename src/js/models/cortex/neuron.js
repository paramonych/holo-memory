var Neuron = (function () {
    function Neuron(cortex, type) {
        this.cortex = cortex;
        this.type = type;
        this.id = getUniqueId();
        this.code = getRandomSixMap();
        this.synapces = new Array();
        this.step = 0;
        this.mesh = new NeuronMesh(this.type, this.cortex.scene, this.cortex.scale);
        this.toDefaultState();
        this.createSynapces();
        if (isMedium(this.type)) {
            this.createSpike();
            this.startWatchForSpike();
        }
    }
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
        if (isMedium(this.type)) {
            this.spike.tense.play();
        }
    };
    Neuron.prototype.pause = function (time) {
        if (isMedium(this.type)) {
            this.spike.tense.pause(time);
        }
    };
    Neuron.prototype.resume = function () {
        if (isMedium(this.type)) {
            this.spike.tense.resume();
        }
    };
    Neuron.prototype.progress = function (value) {
        if (isMedium(this.type)) {
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
        if (isMedium(this.type)) {
            this.spike.reset();
        }
    };
    Neuron.prototype.createSynapces = function () {
        var scale = this.cortex.scale;
        var devideFactor = scale / 2;
        var path = this.mesh.curve.path;
        this.step = Math.floor(path.length / devideFactor);
        var halfStep = Math.floor(this.step / 2);
        for (var i = 0; i < devideFactor; i++) {
            var position = path[i * this.step + halfStep];
            var synapce = new Synapce(this, position.clone());
            this.synapces.push(synapce);
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
        if (isMedium(this.type)) {
            this.spike.dispose();
            this.spike = null;
        }
        _.each(this.synapces, function (synapce) { synapce.dispose(); });
        this.mesh.dispose();
        this.mesh = null;
        this.synapces = null;
        if (this.codeMesh && this.codeMesh.dispose) {
            this.codeMesh.dispose();
            this.codeMesh = null;
        }
        this.state = null;
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
}());
