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
        this.setMaterials();
        this.constructMesh();
        this.resetPosition();
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
        this.mesh = BABYLON.Mesh.CreateSphere('s', 8, this.scale / 25, this.scene, false);
        this.light = this.getLight();
        this.light.parent = this.mesh;
    };
    SpikeMesh.prototype.positionShoulders = function () {
        this.mesh.position = this.position.clone();
    };
    SpikeMesh.prototype.getLight = function () {
        var light = new BABYLON.PointLight("Omni0", new BABYLON.Vector3(0, 1, 0), this.scene);
        light.diffuse = new BABYLON.Color3(1, 0.5, 0);
        light.specular = new BABYLON.Color3(0.9, 0.9, 1);
        light.intensity = 0;
        return light;
    };
    SpikeMesh.prototype.activate = function () {
        this.styleAsActive(true);
    };
    SpikeMesh.prototype.deactivate = function () {
        this.resetPosition();
        this.styleAsActive(false);
    };
    SpikeMesh.prototype.styleAsActive = function (isActive) {
        if (isActive) {
            this.mesh.material = this.activeMaterial;
            this.light.intensity = .1;
        }
        else {
            this.mesh.material = this.material;
            this.light.intensity = 0;
        }
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
            var nextSynapcePosition = synapce.position;
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
    SpikeMesh.prototype.setMaterials = function () {
        this.material = forSpike(this.scene);
        this.activeMaterial = forSpikeActive(this.scene);
    };
    SpikeMesh.prototype.dispose = function () {
        this.scene.removeMesh(this.mesh);
        this.scene.removeLight(this.light);
    };
    return SpikeMesh;
})();
