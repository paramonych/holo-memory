var SpikeMesh = (function () {
    function SpikeMesh(scene, scale, spike, direction) {
        var _this = this;
        this.scene = scene;
        this.scale = scale;
        this.spike = spike;
        this.direction = direction;
        this.curve = new Array();
        _.each(this.spike.neuron.mesh.curve.path, function (next) {
            _this.curve.push(next.clone());
        });
        this.constructMesh();
        this.chargeTense();
    }
    SpikeMesh.prototype.setPositionInCurve = function () {
        var _this = this;
        this.numberPosition = isDirect(this.direction) ? 0 : (this.curve.length - 1);
        if (this.position !== void 0) {
            _.each(this.curve, function (next, index) {
                if (compareVectors(next, _this.position)) {
                    _this.numberPosition = index;
                }
            });
        }
    };
    SpikeMesh.prototype.reset = function () {
        this.resetPosition();
    };
    SpikeMesh.prototype.resetPosition = function () {
        this.position = void 0;
        this.setPositionInCurve();
        this.position = this.curve[this.numberPosition].clone();
        this.setPosition(this.position);
    };
    SpikeMesh.prototype.setPosition = function (position) {
        this.position = position.clone();
        this.setPositionInCurve();
        this.positionShoulders();
    };
    SpikeMesh.prototype.constructMesh = function () {
        this.mesh = BABYLON.Mesh.CreateSphere('s', 8, this.scale / 45, this.scene, false);
        this.mesh.material = defaultMaterial(this.scene);
        this.deactivate();
    };
    SpikeMesh.prototype.positionShoulders = function () {
        this.mesh.position = this.position.clone();
    };
    SpikeMesh.prototype.activate = function () {
        resetMaterial(this.mesh.material, activeMaterial);
        setAlpha(this.mesh.material, 1);
    };
    SpikeMesh.prototype.deactivate = function () {
        this.resetPosition();
        this.setMaterial();
        setAlpha(this.mesh.material, 0);
    };
    SpikeMesh.prototype.setMaterial = function () {
        resetMaterial(this.mesh.material, mediumMaterial);
    };
    SpikeMesh.prototype.chargeTense = function () {
        var _this = this;
        var tense = this.spike.tense;
        var duration = this.spike.neuron.cortex.lifetime;
        var path = isDirect(this.direction)
            ? arrayClone(this.curve.slice(this.numberPosition, this.curve.length))
            : reversedArrayClone(this.curve.slice(0, this.numberPosition));
        var position = { x: this.position.x, y: this.position.y, z: this.position.z };
        tense.eventCallback('onStart', function () { return _this.activate(); });
        tense.eventCallback('onUpdate', function () {
            _this.checkIntersection();
            _this.moveSpikeTo(position);
        });
        tense.eventCallback('onComplete', function () { return _this.deactivate(); });
        tense.add(TweenMax.to(position, duration, {
            bezier: path,
            ease: Linear.easeNone
        }), 0);
    };
    SpikeMesh.prototype.checkIntersection = function () {
        var _this = this;
        var synapces = this.spike.neuron.synapces;
        var synapcesToPositionsMap = newMap();
        var synapcesPositions = _.map(this.spike.neuron.synapces, function (synapce) {
            var nextSynapcePosition = synapce.mesh.basePosition;
            mapAdd(synapcesToPositionsMap, nextSynapcePosition, synapce);
            return nextSynapcePosition;
        });
        var checkedPointsMap = newMap();
        _.each(synapcesPositions, function (point) {
            if (!mapHasKey(checkedPointsMap, point)) {
                mapAdd(checkedPointsMap, point, point);
                if (_this.mesh.intersectsPoint(point)) {
                    var synapceToActivate = getByKey(synapcesToPositionsMap, point);
                    synapceToActivate.activateUntil(700);
                }
            }
        });
    };
    SpikeMesh.prototype.moveSpikeTo = function (position) {
        this.mesh.position.x = position.x;
        this.mesh.position.y = position.y;
        this.mesh.position.z = position.z;
    };
    SpikeMesh.prototype.dispose = function () {
        this.scene.removeMesh(this.mesh);
        this.scene.removeLight(this.light);
        this.mesh.dispose();
        this.mesh = null;
        this.light.dispose();
        this.light = null;
        this.curve = null;
    };
    return SpikeMesh;
}());
