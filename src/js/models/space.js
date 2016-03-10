var Space = (function () {
    function Space(scene, scale, lifetime, neuronsAmount, blastRadius, blastPower) {
        this.scene = scene;
        this.scale = scale;
        this.lifetime = lifetime;
        this.cortex = new Cortex(scene, scale, lifetime, neuronsAmount, blastRadius, blastPower);
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
    Space.prototype.applyConfig = function (neuronsAmount, blastRadius, blastPower) {
        this.cortex.dispose();
        this.cortex = new Cortex(this.scene, this.scale, this.lifetime, neuronsAmount, blastRadius, blastPower);
    };
    Space.prototype.dispose = function () {
        this.cortex.dispose();
        this.cortex = null;
        this.time = null;
    };
    return Space;
}());
