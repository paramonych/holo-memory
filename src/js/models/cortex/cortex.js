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
            var newBlast = new NeuroBlast(synapce, _this.cortexState.blastRadius, mediumSynapces, _this.scene, _this.cortexState.blastPower);
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
        var type = NeuronType.Medium;
        for (var i = 0; i < this.cortexState.dendritsAmount; i++) {
            if (i >= this.cortexState.dendritsAmount / 2) {
                type = NeuronType.Progeny;
            }
            this.neurons.push(new Neuron(this, type));
        }
    };
    Cortex.prototype.draw = function () {
        _.each(this.neurons, function (neuron) { return neuron.build(); });
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
    Cortex.prototype.dispose = function () {
        _.each(this.neurons, function (neuron) { neuron.dispose(); });
        for (var i = 0; i < this.blastsArray.length; i++) {
            this.blastsArray[i].dispose();
        }
        this.neurons = null;
        this.blasts = null;
        this.blastsArray = null;
    };
    return Cortex;
}());
