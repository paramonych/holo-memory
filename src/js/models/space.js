var Space = (function () {
    function Space(scene, scale, lifetime) {
        this.scene = scene;
        this.scale = scale;
        this.lifetime = lifetime;
        this.cortex = new Cortex(scene, scale, lifetime);
    }
    Space.prototype.expose = function (time) {
        this.time = time;
        this.cortex.draw();
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
    return Space;
})();
