var Spike = (function () {
    function Spike(neuron, synapce) {
        this.neuron = neuron;
        this.synapce = synapce;
        this.speed = 1;
        this.time = ko.observable(0);
        this.lifeTime = 2000;
        this.timerId = 0;
        this.grain = 5;
        var neuronMesh = this.neuron.getMesh();
        var scene = this.neuron.cortex.scene;
        var scale = this.neuron.cortex.scale;
        this.mesh = new SpikeMesh(scene, scale, synapce.position);
        this.toDefaultState();
        this.deactivate();
    }
    Spike.prototype.move = function (time) {
        this.mesh.move();
    };
    Spike.prototype.activate = function () {
        this.state(StateType.Active);
    };
    Spike.prototype.deactivate = function () {
        this.state(StateType.Silent);
    };
    Spike.prototype.dispose = function () {
        this.mesh.dispose();
    };
    Spike.prototype.reset = function () {
        this.clearTimer();
        this.mesh.reset();
        this.time(0);
    };
    Spike.prototype.launch = function () {
        var _this = this;
        this.activate();
        setTimeout(function () { return _this.deactivate(); }, 3000);
    };
    Spike.prototype.tick = function () {
        var nextTime = this.time() + this.grain;
        this.move(this.checkTick(nextTime));
    };
    Spike.prototype.checkTick = function (nextTime) {
        if (nextTime >= this.lifeTime) {
            this.reset();
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
