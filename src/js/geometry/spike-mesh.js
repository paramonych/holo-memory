var SpikeMesh = (function () {
    function SpikeMesh(scene, scale, spike) {
        var _this = this;
        this.scene = scene;
        this.scale = scale;
        this.spike = spike;
        this.curve = new Array();
        _.each(this.spike.neuron.neuron.curve.path, function (next) {
            _this.curve.push(next.clone());
        });
        this.setMaterials();
        this.constructShoulders();
        this.resetPosition();
        this.chargeTense();
    }
    SpikeMesh.prototype.setPositionInCurve = function () {
        var _this = this;
        this.numberPosition = Math.floor(this.curve.length / 2);
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
    SpikeMesh.prototype.constructShoulders = function () {
        this.shoulders = shouldersFrom(this.constructShoulderMesh(true), this.constructShoulderMesh(false));
        this.deactivate();
    };
    SpikeMesh.prototype.constructShoulderMesh = function (isLeft) {
        var shoulder = BABYLON.Mesh.CreateSphere('s', 8, this.scale / 45, this.scene, false);
        var light = this.getLight(isLeft);
        light.parent = shoulder;
        return shoulderFrom(shoulder, light);
    };
    SpikeMesh.prototype.positionShoulders = function () {
        this.shoulders.left.mesh.position = this.position.clone();
        this.shoulders.right.mesh.position = this.position.clone();
    };
    SpikeMesh.prototype.getLight = function (isLeft) {
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
        var left = this.shoulders.left;
        var right = this.shoulders.right;
        if (isActive) {
            left.mesh.material = this.activeMaterial;
            right.mesh.material = this.activeMaterial;
            left.light.intensity = .35;
            right.light.intensity = .35;
        }
        else {
            left.mesh.material = this.material;
            right.mesh.material = this.material;
            left.light.intensity = 0;
            right.light.intensity = 0;
        }
    };
    SpikeMesh.prototype.chargeTense = function () {
        var _this = this;
        var tense = this.spike.neuron.tense;
        var duration = this.spike.neuron.cortex.lifetime;
        var pathLeft = reversedArrayClone(this.curve.slice(0, this.numberPosition));
        var pathRight = arrayClone(this.curve.slice(this.numberPosition, this.curve.length));
        var positionLeft = { x: this.position.x, y: this.position.y, z: this.position.z };
        var positionRight = { x: this.position.x, y: this.position.y, z: this.position.z };
        tense.eventCallback('onStart', function () { return _this.activate(); });
        tense.eventCallback('onUpdate', function () {
            _this.checkIntersection();
            _this.shiftShoulders(positionLeft, positionRight);
        });
        tense.eventCallback('onComplete', function () { return _this.deactivate(); });
        var leftShoulderTween = TweenMax.to(positionLeft, duration, { bezier: pathLeft, ease: Linear.easeNone });
        var rightShoulderTween = TweenMax.to(positionRight, duration, { bezier: pathRight, ease: Linear.easeNone });
        tense.add(leftShoulderTween, 0).add(rightShoulderTween, 0);
    };
    SpikeMesh.prototype.checkIntersection = function () {
        var leftShoulder = this.shoulders.left.mesh;
        var rightShoulder = this.shoulders.right.mesh;
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
                if (leftShoulder.intersectsPoint(point) || rightShoulder.intersectsPoint(point)) {
                    var synapceToActivate = getByKey(synapcesToPositionsMap, point);
                    synapceToActivate.activateUntil(700);
                }
            }
        });
    };
    SpikeMesh.prototype.shiftShoulders = function (leftPos, rightPos) {
        this.shoulders.left.mesh.position.x = leftPos.x;
        this.shoulders.left.mesh.position.y = leftPos.y;
        this.shoulders.left.mesh.position.z = leftPos.z;
        this.shoulders.right.mesh.position.x = rightPos.x;
        this.shoulders.right.mesh.position.y = rightPos.y;
        this.shoulders.right.mesh.position.z = rightPos.z;
    };
    SpikeMesh.prototype.setMaterials = function () {
        if (isMedium(this.spike.neuron.type)) {
            this.material = forSpike(this.scene);
        }
        else {
            this.activeMaterial = forSpikeActive(this.scene);
        }
    };
    SpikeMesh.prototype.dispose = function () {
        this.scene.removeMesh(this.shoulders.left.mesh);
        this.scene.removeMesh(this.shoulders.right.mesh);
    };
    return SpikeMesh;
})();
