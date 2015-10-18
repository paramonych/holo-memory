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
        this.position = this.curve[0].clone();
        this.setMaterials();
        this.constructShoulders();
    }
    SpikeMesh.prototype.constructShoulders = function () {
        this.shoulders = shouldersFrom(this.constructShoulderMesh(), this.constructShoulderMesh());
        this.deactivate();
    };
    SpikeMesh.prototype.constructShoulderMesh = function () {
        var shoulder = BABYLON.Mesh.CreateSphere('s', 8, this.scale / 10, this.scene, false);
        shoulder.position = this.position;
        return shoulder;
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
            left.material = this.activeMaterial;
            right.material = this.activeMaterial;
        }
        else {
            left.material = this.material;
            right.material = this.material;
        }
    };
    SpikeMesh.prototype.showMovingSpike = function () {
        var timeline = new TimelineLite();
        var quantity = 350;
        var duration = 2;
        var path = this.curve;
        var position = {
            x: path[0].x,
            y: path[0].y,
            z: path[0].z
        };
        var tween = TweenLite.to(position, quantity, { bezier: path, ease: Linear.easeNone });
        for (var i = 0; i < quantity; i++) {
            tween.time(i);
            timeline.set(this.shoulders.left.position, {
                x: position.x,
                y: position.y,
                z: position.z
            }, i * (duration / quantity));
        }
    };
    SpikeMesh.prototype.setMaterials = function () {
        this.material = new BABYLON.StandardMaterial('i', this.scene);
        this.material.alpha = 1;
        this.activeMaterial = new BABYLON.StandardMaterial('a', this.scene);
        this.activeMaterial.emissiveColor = new BABYLON.Color3(1, .2, 0);
        this.activeMaterial.ambientColor = new BABYLON.Color3(0, 0, 1);
        this.activeMaterial.alpha = 0.9;
    };
    SpikeMesh.prototype.dispose = function () {
        this.scene.removeMesh(this.shoulders.left);
        this.scene.removeMesh(this.shoulders.right);
    };
    return SpikeMesh;
})();
