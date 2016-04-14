var Space = (function () {
    function Space(scene, scale, lifetime, cortexState, uiCallback) {
        this.scene = scene;
        this.scale = scale;
        this.lifetime = lifetime;
        this.cortexState = cortexState;
        this.cortex = new Cortex(scene, scale, lifetime, cortexState, uiCallback);
    }
    Space.prototype.expose = function (time) {
        this.time = time;
        this.cortex.chargeTense(time);
    };
    Space.prototype.freeze = function (time) {
        this.cortex.freezeTense(time);
    };
    Space.prototype.resume = function (time) {
        this.cortex.resumeTense(time);
    };
    Space.prototype.restart = function (time) {
        this.cortex.restartTense(time);
    };
    Space.prototype.shift = function (time, progress) {
        this.cortex.shiftTense(time, progress);
    };
    Space.prototype.dispose = function () {
        this.cortex.dispose();
        this.cortex = null;
        this.time = null;
        this.scene = null;
        this.cortexState = null;
    };
    return Space;
}());
