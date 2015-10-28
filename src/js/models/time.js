var Time = (function () {
    function Time(duration) {
        this.duration = duration;
        this.tense = new TimelineMax({ repeat: 0, paused: true });
        this.tense.to(document, duration, {}, 0);
    }
    Time.prototype.flow = function () {
        this.tense.play(0);
    };
    Time.prototype.resume = function (space) {
        this.tense.resume();
        space.resume(this);
    };
    Time.prototype.pause = function (space) {
        this.tense.pause();
        space.freeze(this);
    };
    Time.prototype.shiftTo = function (space, point) {
        this.tense.progress(point);
        space.shift(this, point);
    };
    Time.prototype.restart = function (space) {
        this.tense.restart();
        space.restart(this);
    };
    return Time;
})();
