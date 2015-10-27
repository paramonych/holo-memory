var sunUrl = 'http://site1.2013321.brim.ru/nru/textures/sun.png';
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
        this.setPositionInCurve();
        this.setPosition(this.curve[this.numberPosition]);
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
    SpikeMesh.prototype.resetPosition = function () {
        this.position = void 0;
        this.setPositionInCurve();
        this.position = this.curve[this.numberPosition].clone();
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
        var shoulder = BABYLON.Mesh.CreateSphere('s', 8, this.scale / 40, this.scene, false);
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
        light.diffuse = new BABYLON.Color3(1, 0.8, 0);
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
            this.activeLeftMaterial;
            left.mesh.material = this.activeMaterial;
            right.mesh.material = this.activeMaterial;
            left.light.intensity = .25;
            right.light.intensity = .25;
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
        var duration = 0.7;
        var tense = this.spike.neuron.tense;
        var pathLeft = reversedArrayClone(this.curve.slice(0, this.numberPosition));
        var pathRight = arrayClone(this.curve.slice(this.numberPosition, this.curve.length));
        var positionLeft = { x: this.position.x, y: this.position.y, z: this.position.z };
        var positionRight = { x: this.position.x, y: this.position.y, z: this.position.z };
        tense.eventCallback('onStart', function () { return _this.activate(); });
        tense.eventCallback('onUpdate', function () { return _this.shiftShoulders(positionLeft, positionRight); });
        tense.eventCallback('onComplete', function () { return _this.deactivate(); });
        var leftShoulderTween = TweenMax.to(positionLeft, duration, { bezier: pathLeft, ease: Linear.easeNone });
        var rightShoulderTween = TweenMax.to(positionRight, duration, { bezier: pathRight, ease: Linear.easeNone });
        tense.add(leftShoulderTween, 0).add(rightShoulderTween, 0);
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
        this.material = new BABYLON.StandardMaterial('i', this.scene);
        this.material.alpha = 0;
        this.activeMaterial = new BABYLON.StandardMaterial('a', this.scene);
        this.activeMaterial.emissiveColor = new BABYLON.Color3(1, 0.8, 0.3);
    };
    SpikeMesh.prototype.dispose = function () {
        this.scene.removeMesh(this.shoulders.left.mesh);
        this.scene.removeMesh(this.shoulders.right.mesh);
    };
    return SpikeMesh;
})();
