var Spike = (function () {
    function Spike(scene, position, rotation, neuronLength, neuronState) {
        var _this = this;
        this.scene = scene;
        this.position = position;
        this.rotation = rotation;
        this.neuronLength = neuronLength;
        this.speed = 1;
        this.time = ko.observable(0);
        this.lifeTime = 2000;
        this.timerId = 0;
        this.grain = 5;
        this.shift = new BABYLON.Vector3(0.01, 0.01, 0.01);
        this.toDefaultState();
        this.setMaterials();
        this.constructShoulders();
        this.deactivate();
        this.time.subscribe(function (time) { return _this.moveShoulders(time); });
        neuronState.subscribe(function (state) {
            if (state === StateType.Active) {
                _this.launch();
            }
        });
    }
    Spike.prototype.constructShoulders = function () {
        this.shoulders = shouldersFrom(this.constructShoulderMesh(), this.constructShoulderMesh());
        this.deactivate();
    };
    Spike.prototype.activate = function () {
        this.state(StateType.Active);
    };
    Spike.prototype.deactivate = function () {
        this.state(StateType.Silent);
        this.reset();
    };
    Spike.prototype.dispose = function () {
        this.scene.removeMesh(this.shoulders.left);
        this.scene.removeMesh(this.shoulders.right);
    };
    Spike.prototype.constructShoulderMesh = function () {
        var scale = this.neuronLength / 3;
        var shoulder = BABYLON.Mesh.CreateCylinder('cylinder', scale / 50, 2 / scale, 2 / scale, scale, 1, this.scene, false);
        shoulder.position = this.position;
        shoulder.rotation = this.rotation;
        return shoulder;
    };
    Spike.prototype.moveShoulders = function (time) {
        var left = this.shoulders.left.position;
        var right = this.shoulders.right.position;
        var newLeft = left.add(this.shift);
        var newRight = newLeft.negate();
        this.shoulders.left.position = newLeft;
        this.shoulders.right.position = newRight;
    };
    Spike.prototype.reset = function () {
        this.clearTimer();
        this.shoulders.left.position = this.position;
        this.shoulders.right.position = this.position;
        this.time(0);
    };
    Spike.prototype.launch = function () {
        var _this = this;
        this.activate();
        this.timerId = window.setInterval(function () { return _this.tick(); }, this.grain);
    };
    Spike.prototype.tick = function () {
        var nextTime = this.time() + this.grain;
        this.time(this.checkTick(nextTime));
    };
    Spike.prototype.checkTick = function (nextTime) {
        if (nextTime >= this.lifeTime) {
            this.clearTimer();
            this.deactivate();
            return 0;
        }
        else {
            return nextTime;
        }
    };
    Spike.prototype.clearTimer = function () {
        window.clearInterval(this.timerId);
    };
    Spike.prototype.serveState = function (newState) {
        if (newState === StateType.Active) {
            this.shoulders.left.material = this.movingSpikeMaterial;
            this.shoulders.right.material = this.movingSpikeMaterial;
        }
        else if (newState === StateType.Silent) {
            this.shoulders.left.material = this.spikeMaterial;
            this.shoulders.right.material = this.spikeMaterial;
        }
    };
    Spike.prototype.setMaterials = function () {
        this.spikeMaterial = new BABYLON.StandardMaterial('silent-spike', this.scene);
        this.spikeMaterial.alpha = 0;
        this.movingSpikeMaterial = new BABYLON.StandardMaterial('moving-spike', this.scene);
        this.movingSpikeMaterial.emissiveColor = new BABYLON.Color3(1, .2, 0);
        this.movingSpikeMaterial.ambientColor = new BABYLON.Color3(0, 0, 1);
        this.movingSpikeMaterial.alpha = 0.9;
    };
    Spike.prototype.toDefaultState = function () {
        var _this = this;
        this.state = ko.observable(StateType.Silent);
        this.state.subscribe(function (state) { return _this.serveState(state); });
    };
    return Spike;
})();
function shouldersFrom(left, right) {
    return {
        left: left,
        right: right
    };
}
