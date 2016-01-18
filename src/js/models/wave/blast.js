var NeuroBlast = (function () {
    function NeuroBlast(synapce, radius, synapces, scene) {
        var _this = this;
        this.synapce = synapce;
        this.radius = radius;
        this.synapces = synapces;
        this.scene = scene;
        this.isExists = false;
        this.synapcesMap = newMap();
        this.synapces.forEach(function (nextSynapce) {
            _this.checkIntersection(nextSynapce);
        });
        this.dispose();
    }
    NeuroBlast.prototype.checkIntersection = function (nextSynapce) {
        var hasIntersections = this.checkIntersections(nextSynapce.position);
        if (hasIntersections) {
            nextSynapce.mesh.mesh.material = forBlastSphere(this.scene);
            mapAdd(this.synapcesMap, nextSynapce.neuron.getId(), nextSynapce.neuron);
            if (!this.isExists) {
                this.isExists = true;
            }
        }
    };
    NeuroBlast.prototype.checkIntersections = function (np) {
        var pos = this.synapce.position;
        var x = Math.pow((pos.x - np.x), 2);
        var y = Math.pow((pos.y - np.y), 2);
        var z = Math.pow((pos.z - np.z), 2);
        var distance = Math.sqrt(x + y + z);
        console.log(distance, this.radius);
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
