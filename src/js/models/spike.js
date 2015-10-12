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
        this.mesh = new SpikeMesh(this.scene, this.position, this.rotation, this.neuronLength);
        this.toDefaultState();
        this.deactivate();
        this.time.subscribe(function (time) { return _this.move(time); });
        neuronState.subscribe(function (state) {
            if (state === StateType.Active) {
                _this.launch();
            }
        });
    }
    Spike.prototype.move = function (time) {
        this.mesh.move();
    };
    Spike.prototype.activate = function () {
        this.state(StateType.Active);
    };
    Spike.prototype.deactivate = function () {
        this.state(StateType.Silent);
        this.reset();
    };
    Spike.prototype.dispose = function () {
        this.scene.removeMesh(this.mesh.shoulders.left);
        this.scene.removeMesh(this.mesh.shoulders.right);
    };
    Spike.prototype.reset = function () {
        this.clearTimer();
        this.mesh.reset();
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
            this.mesh.activate();
        }
        else if (newState === StateType.Silent) {
            this.mesh.deactivate();
        }
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
