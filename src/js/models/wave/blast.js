var NeuroBlast = (function () {
    function NeuroBlast(synapce, radius, synapces, scene) {
        var _this = this;
        this.synapce = synapce;
        this.radius = radius;
        this.synapces = synapces;
        this.scene = scene;
        this.isExists = false;
        this.neuronsMap = newMap();
        this.synapces.forEach(function (nextSynapce) {
            var hasIntersections = _this.checkIntersection(nextSynapce);
            var nextNeuron = nextSynapce.neuron;
            if (hasIntersections && !mapHasKey(_this.neuronsMap, nextNeuron.getId())) {
                mapAdd(_this.neuronsMap, nextNeuron.getId(), nextNeuron);
                if (!nextNeuron.hasCodeMesh()) {
                    nextNeuron.setProgenyCodeMesh();
                }
            }
        });
        this.dispose();
    }
    NeuroBlast.prototype.checkIntersection = function (nextSynapce) {
        var hasIntersections = this.checkIntersections(nextSynapce.position);
        if (hasIntersections) {
            nextSynapce.mesh.mesh.material = forBlastSphere(this.scene);
            if (!this.isExists) {
                this.isExists = true;
            }
        }
        return hasIntersections;
    };
    NeuroBlast.prototype.checkIntersections = function (np) {
        var pos = this.synapce.position;
        var x = Math.pow((pos.x - np.x), 2);
        var y = Math.pow((pos.y - np.y), 2);
        var z = Math.pow((pos.z - np.z), 2);
        var distance = Math.sqrt(x + y + z);
        if (distance > 0 && distance < this.radius) {
            return true;
        }
        return false;
    };
    NeuroBlast.prototype.dispose = function () {
        this.scene.removeMesh(this.sphere);
    };
    return NeuroBlast;
})();
