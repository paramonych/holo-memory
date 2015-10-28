var Time = (function () {
    function Time(duration) {
        this.duration = duration;
        this.tense = new TimelineMax({ repeat: 0, paused: true });
        this.tense.to(document, duration, {}, 0);
    }
    Time.prototype.flow = function () {
        this.tense.play(0);
    };
    Time.prototype.stop = function (space) {
        this.tense.pause();
        space.freeze(this);
    };
    Time.prototype.shiftTo = function (space, point) {
        space.shift(this, point);
    };
    Time.prototype.loop = function () {
        this.tense.restart();
    };
    return Time;
})();
