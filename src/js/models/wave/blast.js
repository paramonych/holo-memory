var NeuroBlast = (function () {
    function NeuroBlast(synapce, radius, synapces, scene, blastPowerLimit) {
        var _this = this;
        this.synapce = synapce;
        this.radius = radius;
        this.synapces = synapces;
        this.scene = scene;
        this.blastPowerLimit = blastPowerLimit;
        this.isExists = false;
        this.synapcesCount = 0;
        this.color = new BABYLON.Color3(ra(), ra(), ra());
        this.neuronsMap = newMap();
        this.synapcesMap = newMap();
        this.synapces.forEach(function (nextSynapce) {
            var hasIntersections = _this.checkIntersection(nextSynapce);
            var nextNeuron = nextSynapce.neuron;
            if (hasIntersections) {
                if (!mapHasKey(_this.neuronsMap, nextNeuron.getId())) {
                    mapAdd(_this.neuronsMap, nextNeuron.getId(), nextNeuron);
                }
                if (!mapHasKey(_this.synapcesMap, nextSynapce.getId())) {
                    mapAdd(_this.synapcesMap, nextSynapce.getId(), nextSynapce);
                }
                if (!nextNeuron.hasCodeMesh()) {
                }
            }
        });
        this.synapcesCount = mapSize(this.synapcesMap);
        var isEnoughIntersections = (this.synapcesCount >= this.blastPowerLimit);
        this.synapce.setMediumCodeMesh(this.synapcesCount, isEnoughIntersections);
        if (this.isExists && isEnoughIntersections) {
            this.sphere = BABYLON.Mesh.CreateSphere('s', 32, this.radius * 2, this.scene, false);
            this.sphere.material = glass(this.scene);
            this.sphere.position = this.synapce.mesh.position.clone();
            this.synapce.allowMediator();
            this.synapce.mesh.mesh.material = forBlastSphere(this.scene, this.color);
            useMap(this.synapcesMap, function (synapce) {
                var coloredMaterial = forBlastSphere(_this.scene, _this.color);
                synapce.neuron.allowSpikes();
                synapce.allowMediator();
                resetMaterial(synapce.neuron.mesh.mesh.material, colorizeMaterial(mediumMaterial, _this.color));
                resetMaterial(synapce.mesh.mesh.material, colorizeMaterial(mediumMaterial, _this.color));
                resetMaterial(synapce.mesh.synapceLegMesh.material, colorizeMaterial(mediumMaterial, _this.color));
            });
        }
        else {
            this.isExists = false;
            this.dispose();
        }
    }
    NeuroBlast.prototype.checkIntersection = function (nextSynapce) {
        var hasIntersections = this.checkIntersections(nextSynapce.mesh.position);
        if (hasIntersections) {
            if (!this.isExists) {
                this.isExists = true;
            }
        }
        return hasIntersections;
    };
    NeuroBlast.prototype.checkIntersections = function (np) {
        var pos = this.synapce.mesh.position;
        var x = Math.pow((pos.x - np.x), 2);
        var y = Math.pow((pos.y - np.y), 2);
        var z = Math.pow((pos.z - np.z), 2);
        var distance = Math.sqrt(x + y + z);
        if (distance > 0 && distance < this.radius) {
            return true;
        }
        return false;
    };
    NeuroBlast.prototype.getIntersectionsCount = function () {
        return this.synapcesCount;
    };
    NeuroBlast.prototype.dispose = function () {
        this.scene.removeMesh(this.sphere);
        if (this.sphere && this.sphere.dispose) {
            this.sphere.dispose();
        }
        this.neuronsMap = null;
        toValues(this.synapcesMap).forEach(function (synapce) {
            synapce.disposeCodeMesh();
        });
        this.synapcesMap = null;
    };
    return NeuroBlast;
}());
