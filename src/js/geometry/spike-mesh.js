var sunUrl = 'http://site1.2013321.brim.ru/nru/textures/sun.png';
var SpikeMesh = (function () {
    function SpikeMesh(scene, scale, synapce, neuron) {
        var _this = this;
        this.scene = scene;
        this.scale = scale;
        this.synapce = synapce;
        this.neuron = neuron;
        this.curve = new Array();
        _.each(this.neuron.neuron.curve.path, function (next) {
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
        var shoulder = BABYLON.Mesh.CreateSphere('s', 8, this.scale / 10, this.scene, false);
        shoulder.position = isLeft ? this.curve[0].clone() : this.curve[this.curve.length - 1].clone();
        var light = this.getLight(isLeft);
        light.parent = shoulder;
        return shoulderFrom(shoulder, light);
    };
    SpikeMesh.prototype.getLight = function (isLeft) {
        var light = new BABYLON.PointLight("Omni0", new BABYLON.Vector3(0, 1, 0), this.scene);
        light.diffuse = isLeft ? new BABYLON.Color3(1, 0.5, 0.1) : new BABYLON.Color3(1, 0.5, 0.1);
        light.specular = new BABYLON.Color3(1, 1, 0.9);
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
            left.mesh.material = this.activeLeftMaterial;
            right.mesh.material = this.activeMaterial;
            left.light.intensity = 1;
            right.light.intensity = 1;
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
        var pathLeft = this.curve;
        var pathRight = reversedArrayClone(this.curve);
        var pos = Math.floor(this.curve.length / 2);
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
        for (var i = 0; i < quantity / 2; i++) {
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
        }
    };
    SpikeMesh.prototype.setMaterials = function () {
        this.material = new BABYLON.StandardMaterial('i', this.scene);
        this.material.alpha = 1;
        this.activeMaterial = new BABYLON.StandardMaterial('a', this.scene);
        this.activeMaterial.emissiveColor = new BABYLON.Color3(1, 0, 0);
        this.activeLeftMaterial = new BABYLON.StandardMaterial('a', this.scene);
        this.activeLeftMaterial.emissiveColor = new BABYLON.Color3(0, 1, 0);
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
