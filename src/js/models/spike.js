var Spike = (function () {
    function Spike(position, start, end) {
        this.position = position;
        this.start = start;
        this.end = end;
        this.speed = 1;
        this.time = 0;
        this.lifeTime = 100;
        this.timerId = 0;
        this.grain = 5;
    }
    Spike.prototype.launch = function (callback) {
        var _this = this;
        this.timerId = window.setInterval(function () {
            callback(calculateShoulders(_this));
            _this.tick();
        }, this.grain);
    };
    Spike.prototype.tick = function () {
        this.time += this.grain;
        if (this.time >= this.lifeTime) {
            window.clearInterval(this.timerId);
        }
    };
    return Spike;
})();
function calculateShoulders(spike) {
    return shouldersFrom(spike.position, spike.position);
}
function shouldersFrom(left, right) {
    return {
        left: left,
        right: right
    };
}
