var Space = (function () {
    function Space(scene, scale) {
        this.scene = scene;
        this.scale = scale;
        this.cortex = new Cortex(scene, scale);
    }
    Space.prototype.expose = function (time) {
        this.time = time;
        this.cortex.draw();
        this.cortex.chargeTense(time);
    };
    return Space;
})();
