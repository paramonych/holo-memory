var Cortex = (function () {
    function Cortex(scene, scale, lifetime, cortexState, spaceCallback) {
        this.scene = scene;
        this.scale = scale;
        this.lifetime = lifetime;
        this.cortexState = cortexState;
        this.spaceCallback = spaceCallback;
        this.createNeurons();
        if (isLowResolution(cortexState.resolution)) {
            this.spaceCallback(null, this.checkSynapcesAmountInBox());
            this.preprocessLowBlasts();
        }
        else {
            this.fillDeltaAchievableMap();
        }
    }
    Cortex.prototype.preprocessLowBlasts = function () {
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
    Cortex.prototype.fillDeltaAchievableMap = function () {
        var _this = this;
        this.firstLineDeltaAchievableNeuronsIdsMap = newMap();
        this.secondLineDeltaAchievableNeuronsIdsMap = newMap();
        var d1 = new Date();
        _.each(this.neurons, function (neuronOne) {
            var firstLineAchievableIds = new Array();
            var secondLineAchievableIds = new Array();
            _.each(_this.neurons, function (neuronTwo) {
                if (checkDistanceFromPointToPoint(neuronOne.mesh.center, neuronTwo.mesh.center, SCALE_THRESHOLD)) {
                    firstLineAchievableIds.push(neuronTwo);
                    if (checkDistanceFromVectorToVector(neuronOne, neuronTwo, _this.cortexState.blastRadius)) {
                        secondLineAchievableIds.push(neuronTwo);
                    }
                }
            });
            mapAdd(_this.firstLineDeltaAchievableNeuronsIdsMap, neuronOne.id, firstLineAchievableIds);
            mapAdd(_this.secondLineDeltaAchievableNeuronsIdsMap, neuronOne.id, secondLineAchievableIds);
        });
        var d2 = new Date();
        console.log((d2.getTime() - d1.getTime()) / 1000);
        debugger;
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
    Cortex.prototype.checkSynapcesAmountInBox = function () {
        var amount = 0;
        var checkBounds = function (val) {
            var bound = cortexState.scale / 1.25;
            return (val < bound) && (val > -bound);
        };
        this.neurons.forEach(function (neuron) {
            neuron.synapces.forEach(function (synapce) {
                var pos = synapce.mesh.position;
                if (checkBounds(pos.x) && checkBounds(pos.y) && checkBounds(pos.z)) {
                    amount++;
                }
            });
        });
        return amount;
    };
    Cortex.prototype.createNeurons = function () {
        this.neurons = new Array();
        for (var i = 0; i < this.cortexState.dendritsAmount; i++) {
            this.neurons.push(new Neuron(this, NeuronType.Progeny));
        }
        var halfScale = this.cortexState.scale / 2;
        var waveStartingPoint = new BABYLON.Vector3(halfScale, halfScale, halfScale);
        this.revealDormantSignalNeurons(waveStartingPoint);
    };
    Cortex.prototype.revealDormantSignalNeurons = function (basePosition) {
        var _this = this;
        this.dormantSignalNeurons = new Array();
        _.each(this.neurons, function (n) {
            if (checkDistanceFromPointToPoint(n.mesh.center, basePosition, SCALE_THRESHOLD)) {
                _this.dormantSignalNeurons.push(n);
            }
        });
    };
    Cortex.prototype.initSignal = function (wavePower) {
        this.dropSignal();
        for (var i = 0; i < wavePower; i++) {
            var progenyNeurons = _.filter(this.dormantSignalNeurons, function (neuron) {
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
        if (isLowResolution(cortexState.resolution)) {
            this.preprocessLowBlasts();
        }
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
        if (isLowResolution(cortexState.resolution)) {
            this.preprocessLowBlasts();
        }
        else {
            this.fillDeltaAchievableMap();
        }
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
        this.scene = null;
        this.cortexState = null;
        this.spaceCallback = null;
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
