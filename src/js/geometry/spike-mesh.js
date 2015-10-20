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
        this.position = this.curve[Math.floor(this.curve.length / 2)].clone();
        this.setMaterials();
        this.constructShoulders();
    }
    SpikeMesh.prototype.constructShoulders = function () {
        this.shoulders = shouldersFrom(this.constructShoulderMesh(true), this.constructShoulderMesh(false));
        this.deactivate();
    };
    SpikeMesh.prototype.constructShoulderMesh = function (isLeft) {
        var shoulder = BABYLON.Mesh.CreateSphere('s', 8, this.scale / 40, this.scene, false);
        shoulder.position = this.position.clone();
        var light = this.getLight(isLeft);
        light.parent = shoulder;
        return shoulderFrom(shoulder, light);
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
        this.showMovingSpike();
    };
    SpikeMesh.prototype.deactivate = function () {
        this.styleAsActive(false);
    };
    SpikeMesh.prototype.styleAsActive = function (isActive) {
        var left = this.shoulders.left;
        var right = this.shoulders.right;
        if (isActive) {
            this.activeLeftMaterial;
            left.mesh.material = this.activeMaterial;
            right.mesh.material = this.activeMaterial;
            left.light.intensity = .4;
            right.light.intensity = .4;
        }
        else {
            left.mesh.material = this.material;
            right.mesh.material = this.material;
            left.light.intensity = 0;
            right.light.intensity = 0;
        }
    };
    SpikeMesh.prototype.showMovingSpike = function () {
        var timelineLeft = new TimelineLite();
        var timelineRight = new TimelineLite();
        var quantity = 100;
        var duration = 2;
        var length = this.curve.length;
        var pos = Math.floor(this.curve.length / 2);
        var pathLeft = reversedArrayClone(this.curve.slice(0, pos));
        var pathRight = arrayClone(this.curve.slice(pos, length));
        var positionLeft = {
            x: pathLeft[0].x,
            y: pathLeft[0].y,
            z: pathLeft[0].z
        };
        var positionRight = {
            x: pathRight[0].x,
            y: pathRight[0].y,
            z: pathRight[0].z
        };
        var tweenLeft = TweenLite.to(positionLeft, quantity, { bezier: pathLeft, ease: Linear.easeNone });
        var tweenRight = TweenLite.to(positionRight, quantity, { bezier: pathRight, ease: Linear.easeNone });
        for (var i = 0; i < quantity; i++) {
            tweenLeft.time(i);
            timelineLeft.set(this.shoulders.left.mesh.position, {
                x: positionLeft.x,
                y: positionLeft.y,
                z: positionLeft.z
            }, i * (duration / quantity));
            tweenRight.time(i);
            timelineRight.set(this.shoulders.right.mesh.position, {
                x: positionRight.x,
                y: positionRight.y,
                z: positionRight.z
            }, i * (duration / quantity));
            this.spike.reportMovement(doubleVectorFrom(new BABYLON.Vector3(positionLeft.x, positionLeft.y, positionLeft.z), new BABYLON.Vector3(positionRight.x, positionRight.y, positionRight.z)));
        }
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
function reversedArrayClone(array) {
    var result = new Array();
    for (var s = array.length - 1; s >= 0; s--) {
        result.push(array[s].clone());
    }
    return result;
}
function arrayClone(array) {
    var result = new Array();
    for (var s = 0; s < array.length; s++) {
        result.push(array[s].clone());
    }
    return result;
}
function doubleVectorFrom(o, t) {
    return {
        one: o,
        two: t
    };
}
