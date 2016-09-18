var Cortex = (function () {
    function Cortex(scene, scale, lifetime, cortexState, spaceCallback) {
        this.scene = scene;
        this.scale = scale;
        this.lifetime = lifetime;
        this.cortexState = cortexState;
        this.spaceCallback = spaceCallback;
        this.firstLaunch = true;
        this.createNeurons();
        this.resetNeuronsCodes();
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
    };
    Cortex.prototype.resetNeuronsCodes = function () {
        var _this = this;
        _.each(this.neurons, function (neuron) {
            neuron.setCodes(_this.cortexState.wordLength, _this.cortexState.vocabLength);
        });
    };
    Cortex.prototype.fillDeltaAchievableMap = function () {
        var _this = this;
        this.firstLineDeltaAchievableNeuronsMap = newMap();
        this.secondLineDeltaAchievableNeuronsMap = newMap();
        this.distressDeltaAchievableNeuronsIdsMap = newMap();
        this.secondLineDeltaAchievableNeuronsIdsMap = newMap();
        _.each(this.neurons, function (neuronOne) {
            var firstLineAchievableNeurons = new Array();
            _.each(_this.neurons, function (neuronTwo) {
                if (checkUpperDistanceLimitFromPointToPoint(neuronOne.mesh.center, neuronTwo.mesh.center, _this.cortexState.transportDistance)) {
                    if (neuronOne.isForwardCompatibleByCodes(neuronOne)) {
                        firstLineAchievableNeurons.push(neuronTwo);
                    }
                }
            });
            mapAdd(_this.firstLineDeltaAchievableNeuronsMap, neuronOne.id, firstLineAchievableNeurons);
        });
        _.each(this.neurons, function (neuronOne) {
            var firstLineAchievableNeurons = getByKey(_this.firstLineDeltaAchievableNeuronsMap, neuronOne.id);
            var secondLineAchievableNeurons = new Array();
            var secondLineAchievableNeuronsMap = newMap();
            _.each(firstLineAchievableNeurons, function (neuronTwo) {
                if (checkUpperDistanceLimitFromVectorToVector(neuronOne, neuronTwo, _this.cortexState.transportDistance)) {
                    secondLineAchievableNeurons.push(neuronTwo);
                    mapAdd(secondLineAchievableNeuronsMap, neuronTwo.id, neuronTwo.id);
                }
            });
            mapAdd(_this.secondLineDeltaAchievableNeuronsMap, neuronOne.id, secondLineAchievableNeurons);
            mapAdd(_this.secondLineDeltaAchievableNeuronsIdsMap, neuronOne.id, secondLineAchievableNeuronsMap);
        });
        _.each(this.neurons, function (neuronOne) {
            var distresNeuronsIds = new Array();
            _.each(_this.neurons, function (neuronTwo) {
                if (checkUpperDistanceLimitFromPointToPoint(neuronOne.mesh.center, neuronTwo.mesh.center, _this.cortexState.distressDistance)) {
                    distresNeuronsIds.push(neuronTwo.id);
                }
            });
            mapAdd(_this.distressDeltaAchievableNeuronsIdsMap, neuronOne.id, distresNeuronsIds);
        });
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
    Cortex.prototype.resolveNextLayer = function () {
        var _this = this;
        _.each(this.actualSignalNeurons, function (nextSignalNeuron) {
            var achievableTransportNeurons = getByKey(_this.secondLineDeltaAchievableNeuronsMap, nextSignalNeuron.id);
            var achievableDistressNeuronsIds = getByKey(_this.distressDeltaAchievableNeuronsIdsMap, nextSignalNeuron.id);
            _.each(achievableTransportNeurons, function (nextTransportNeuron) {
                var backwardAchievableSignalNeuronsIdsMap = getByKey(_this.secondLineDeltaAchievableNeuronsIdsMap, nextTransportNeuron.id);
                var backwardAchievableSignalNeuronsAmount = 0;
                _.each(_this.actualSignalNeurons, function (signalNeuron) {
                    if (mapHasKeyFast(backwardAchievableSignalNeuronsIdsMap, signalNeuron.stringId)) {
                        backwardAchievableSignalNeuronsAmount += 1;
                    }
                });
                if (!mapHasKeyFast(_this.usedSignalNeuronsIdsMap, nextTransportNeuron.stringId)
                    && !mapHasKeyFast(_this.waveFrontNeurons, nextTransportNeuron.stringId)
                    && !mapHasKeyFast(_this.distressedNeuronsIdsMap, nextTransportNeuron.stringId)
                    && !nextTransportNeuron.isDroppedOff
                    && (backwardAchievableSignalNeuronsAmount >= _this.cortexState.patternLimit)) {
                    nextTransportNeuron.mesh.setLegatee(true);
                    nextTransportNeuron.mesh.select();
                    mapAddFast(_this.waveFrontNeurons, nextTransportNeuron.stringId, nextTransportNeuron);
                }
            });
            _.each(achievableDistressNeuronsIds, function (nextDistressedNeuronId) {
                mapAdd(_this.distressedNeuronsIdsMap, nextDistressedNeuronId, nextDistressedNeuronId);
            });
        });
    };
    Cortex.prototype.processWaveFromStart = function () {
        var _this = this;
        this.distressedNeuronsIdsMap = newMap();
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.resolveNextLayer();
        this.timer = setInterval(function () {
            _this.processNextLayer();
        }, 1000);
    };
    Cortex.prototype.resumeNextLayer = function () {
        var _this = this;
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.timer = setInterval(function () {
            _this.processNextLayer();
        }, 1000);
    };
    Cortex.prototype.processNextLayer = function () {
        if (mapSize(this.waveFrontNeurons) > 0) {
            this.prepareNextLayer();
            this.resolveNextLayer();
        }
        else {
            clearInterval(this.timer);
            this.spaceCallback(1, null, true);
        }
    };
    Cortex.prototype.freezeLayer = function () {
        clearInterval(this.timer);
    };
    Cortex.prototype.prepareNextLayer = function () {
        var _this = this;
        _.each(this.actualSignalNeurons, function (n) {
            resetMaterial(n.mesh.mesh.material, mediumMaterial, 0.1);
        });
        this.actualSignalNeurons = new Array();
        _.each(toValues(this.waveFrontNeurons), function (nextFrontNeuron) {
            nextFrontNeuron.includeInSignal();
            mapAdd(_this.usedSignalNeuronsIdsMap, nextFrontNeuron.id, nextFrontNeuron);
            _this.actualSignalNeurons.push(nextFrontNeuron);
        });
        this.waveFrontNeurons = newMap();
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
            if (checkLowerDistanceLimitFromPointToPoint(n.mesh.center, basePosition, _this.cortexState.distressDistance)) {
                if (checkUpperDistanceLimitFromPointToPoint(n.mesh.center, basePosition, _this.cortexState.transportDistance)) {
                    _this.dormantSignalNeurons.push(n);
                }
            }
        });
    };
    Cortex.prototype.initSignal = function (wavePower, distressDistance, transportDistance, patternLimit, wordLength, vocabLength) {
        this.dropSignal();
        this.cortexState.patternLimit = patternLimit;
        this.cortexState.wordLength = wordLength;
        this.cortexState.vocabLength = vocabLength;
        this.resetNeuronsCodes();
        this.actualSignalNeurons = new Array();
        this.waveFrontNeurons = newMap();
        this.usedSignalNeuronsIdsMap = newMap();
        if (this.timer) {
            clearInterval(this.timer);
        }
        _.each(this.neurons, function (n) {
            if (n.isDroppedOff) {
                n.isDroppedOff = false;
            }
        });
        for (var i = 0; i < wavePower; i++) {
            if (this.dormantSignalNeurons && this.dormantSignalNeurons.length > 0) {
                var index = Math.floor((this.dormantSignalNeurons.length - 1) * random());
                var nextSignalNeuron = this.dormantSignalNeurons[index];
                nextSignalNeuron.includeInSignal();
                mapAdd(this.usedSignalNeuronsIdsMap, nextSignalNeuron.id, nextSignalNeuron);
                this.actualSignalNeurons.push(nextSignalNeuron);
            }
            else {
                break;
            }
        }
        if (isLowResolution(cortexState.resolution)) {
            this.preprocessLowBlasts();
            this.resolveSignalInheritanse();
            this.spaceCallback(this.blastsArray.length);
        }
        else {
            this.cortexState.distressDistance = distressDistance;
            this.cortexState.transportDistance = transportDistance;
            this.fillDeltaAchievableMap();
            this.spaceCallback(1);
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
            this.resolveSignalInheritanse();
            this.spaceCallback(this.blastsArray.length);
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
