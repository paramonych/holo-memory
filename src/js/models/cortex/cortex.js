var Cortex = (function () {
    function Cortex(scene, scale, lifetime, cortexState, spaceCallback) {
        this.scene = scene;
        this.scale = scale;
        this.lifetime = lifetime;
        this.cortexState = cortexState;
        this.spaceCallback = spaceCallback;
        this.createNeurons();
        this.spaceCallback(null, this.checkSynapcesDensity());
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
        this.resolveSignalInheritanse();
        this.spaceCallback(this.blastsArray.length);
    };
    Cortex.prototype.resolveSignalInheritanse = function () {
        for (var i = 0; i < this.blastsArray.length; i++) {
            var nextBlast = this.blastsArray[i];
            for (var n = 0; n < this.neurons.length; n++) {
                var isLegatee = false;
                var nextNeuron = this.neurons[n];
                if (!isMedium(nextNeuron.type)) {
                    for (var s = 0; s < nextNeuron.synapces.length; s++) {
                        isLegatee = nextBlast.checkIntersection(nextNeuron.synapces[s]);
                        if (isLegatee) {
                            break;
                        }
                    }
                    if (isLegatee) {
                        nextNeuron.mesh.setLegatee(true);
                        nextNeuron.mesh.select();
                        break;
                    }
                }
            }
        }
        ;
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
    Cortex.prototype.checkSynapcesDensity = function () {
        var density = 0;
        var checkBounds = function (val) {
            var bound = cortexSate.scale / 2;
            return (val < bound) && (val > -bound);
        };
        this.neurons.forEach(function (neuron) {
            neuron.synapces.forEach(function (synapce) {
                var pos = synapce.mesh.position;
                if (checkBounds(pos.x) && checkBounds(pos.y) && checkBounds(pos.z)) {
                    density++;
                }
            });
        });
        return density;
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
    Cortex.prototype.resetSynapces = function () {
        this.neurons.forEach(function (neuron) {
            neuron.resetSynapces();
        });
    };
    Cortex.prototype.dropSpikes = function () {
        this.neurons.forEach(function (neuron) {
            neuron.dropToInitialState(neuron.type);
        });
    };
    Cortex.prototype.dropSignal = function () {
        this.disposeBlasts();
        this.neurons.forEach(function (neuron) {
            neuron.dropToInitialState(NeuronType.Progeny);
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
        _.each(this.neurons, function (neuron) {
            neuron.dispose();
        });
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
