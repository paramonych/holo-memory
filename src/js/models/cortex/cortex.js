var Cortex = (function () {
    function Cortex(scene, scale, lifetime, cortexState, spaceCallback) {
        this.scene = scene;
        this.scale = scale;
        this.lifetime = lifetime;
        this.cortexState = cortexState;
        this.spaceCallback = spaceCallback;
        this.createNeurons();
        this.preprocessBlasts();
    }
    Cortex.prototype.preprocessBlasts = function () {
        var _this = this;
        var mediumSynapces = this.collectMediumSynapces();
        var progenySynapces = this.collectProgenySynapces();
        this.blasts = newMap();
        this.blastsArray = new Array();
        mediumSynapces.forEach(function (synapce) {
            var filteredSynapces = _.filter(mediumSynapces, function (nextSynapce) {
                return synapce.neuron.id !== nextSynapce.neuron.id;
            });
            var newBlast = new NeuroBlast(synapce, _this.cortexState.blastRadius, filteredSynapces, _this.scene, _this.cortexState.blastPower);
            if (newBlast.isExists) {
                _this.blastsArray.push(newBlast);
            }
            else {
                newBlast = null;
            }
        });
        this.spaceCallback(this.blastsArray.length);
    };
    Cortex.prototype.collectMediumSynapces = function () {
        var allSynapces = new Array();
        this.neurons.forEach(function (neuron) {
            if (isMedium(neuron.type)) {
                appendAll(allSynapces, neuron.synapces);
            }
        });
        return allSynapces;
    };
    Cortex.prototype.collectProgenySynapces = function () {
        var allSynapces = new Array();
        this.neurons.forEach(function (neuron) {
            if (!isMedium(neuron.type)) {
                appendAll(allSynapces, neuron.synapces);
            }
        });
        return allSynapces;
    };
    Cortex.prototype.createNeurons = function () {
        this.neurons = new Array();
        for (var i = 0; i < this.cortexState.dendritsAmount; i++) {
            this.neurons.push(new Neuron(this, NeuronType.Progeny));
        }
    };
    Cortex.prototype.initSignal = function (wavePower) {
        this.dropSignal();
        for (var i = 0; i < wavePower; i++) {
            var progenyNeurons = _.filter(this.neurons, function (neuron) {
                return !isMedium(neuron.type);
            });
            if (progenyNeurons.length > 0) {
                var index = Math.floor((progenyNeurons.length - 1) * random());
                progenyNeurons[index].includeInSignal();
            }
            else {
                break;
            }
        }
        this.preprocessBlasts();
    };
    Cortex.prototype.dropSignal = function () {
        this.disposeBlasts();
        this.neurons.forEach(function (neuron) {
            neuron.dropToInitialState();
        });
    };
    Cortex.prototype.computeBlasts = function () {
        this.preprocessBlasts();
    };
    Cortex.prototype.chargeTense = function (time) {
        _.each(this.neurons, function (n) {
            time.tense.add(function () { return n.play(); }, 0);
        });
    };
    Cortex.prototype.freezeTense = function (time) {
        _.each(this.neurons, function (n) {
            n.pause(time.tense.progress() * time.duration);
        });
    };
    Cortex.prototype.resumeTense = function (time) {
        _.each(this.neurons, function (n) {
            n.resume();
        });
    };
    Cortex.prototype.restartTense = function (time) {
        _.each(this.neurons, function (n) {
            n.restartTense();
        });
    };
    Cortex.prototype.shiftTense = function (time, progress) {
        _.each(this.neurons, function (n) {
            n.progress(progress);
        });
    };
    Cortex.prototype.keepSelected = function (keepSelected) {
        _.each(this.neurons, function (n) {
            if (keepSelected && !n.mesh.isHighlighted) {
                n.hide();
            }
            if (!keepSelected && !n.mesh.isHighlighted) {
                n.show();
            }
        });
    };
    Cortex.prototype.dispose = function () {
        this.disposeBlasts();
        _.each(this.neurons, function (neuron) { neuron.dispose(); });
        this.neurons = null;
    };
    Cortex.prototype.disposeBlasts = function () {
        this.disposeMediators();
        if (this.blastsArray) {
            for (var i = 0; i < this.blastsArray.length; i++) {
                this.blastsArray[i].dispose();
            }
            this.blasts = null;
            this.blastsArray = null;
        }
    };
    Cortex.prototype.disposeMediators = function () {
        _.each(this.neurons, function (neuron) { neuron.disposeMediators(); });
    };
    return Cortex;
}());
