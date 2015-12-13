var NeuroBlast = (function () {
    function NeuroBlast(synapce, radius, synapces, scene) {
        var _this = this;
        this.synapce = synapce;
        this.synapces = synapces;
        this.scene = scene;
        this.sphere = BABYLON.Mesh.CreateSphere('blast', 8, radius, scene, false);
        this.sphere.material = forBlastSphere(scene);
        this.sphere.position = synapce.position.clone();
        this.synapcesMap = newMap();
        this.synapces.forEach(function (nextSynapce) {
            _this.checkIntersection(nextSynapce);
        });
        this.dispose();
    }
    NeuroBlast.prototype.checkIntersection = function (nextSynapce) {
        if (this.sphere.intersectsMesh(nextSynapce.mesh.mesh, true)) {
            mapAdd(this.synapcesMap, nextSynapce.getId(), nextSynapce);
        }
    };
    NeuroBlast.prototype.dispose = function () {
        this.scene.removeMesh(this.sphere);
    };
    return NeuroBlast;
})();
