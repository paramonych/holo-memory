var Time = (function () {
    function Time() {
        this.tense = new TimelineMax({ repeat: 1, paused: true });
    }
    Time.prototype.flow = function () {
        this.tense.play(0);
    };
    Time.prototype.stop = function () {
        this.tense.pause();
    };
    Time.prototype.loop = function () {
        this.tense.restart();
    };
    return Time;
})();
