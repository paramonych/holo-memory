var Cortex = (function () {
    function Cortex(scene, scale, lifetime) {
        this.scene = scene;
        this.scale = scale;
        this.lifetime = lifetime;
        this.neuronsAmount = 4;
        this.createNeurons();
        this.preprocessBlasts();
    }
    Cortex.prototype.preprocessBlasts = function () {
        var _this = this;
        var mediumSynapces = this.collectMediumSynapces();
        var progenySynapces = this.collectProgenySynapces();
        this.blasts = newMap();
        mediumSynapces.forEach(function (synapce) {
            var newBlast = new NeuroBlast(synapce, _this.scale / 2.3, progenySynapces, _this.scene);
            if (mapSize(newBlast.synapcesMap) > 1) {
                mapAdd(_this.blasts, synapce.getId, newBlast);
            }
        });
        console.debug('Blasts: ', mapSize(this.blasts));
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
        _.each(this.neurons, function (n) { return n.dispose(); });
        this.neurons = new Array();
        var type = NeuronType.Medium;
        for (var i = 0; i < this.neuronsAmount; i++) {
            if (i >= this.neuronsAmount / 2) {
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
    };
    return Cortex;
})();
