var Cortex = (function () {
    function Cortex(scene, scale, lifetime) {
        this.scene = scene;
        this.scale = scale;
        this.lifetime = lifetime;
        this.neuronsAmount = 1;
        this.createNeurons();
    }
    Cortex.prototype.createNeurons = function () {
        _.each(this.neurons, function (n) { return n.dispose(); });
        this.neurons = new Array();
        for (var i = 0; i < this.neuronsAmount; i++) {
            this.neurons.push(new Neuron(this));
        }
    };
    Cortex.prototype.draw = function () {
        _.each(this.neurons, function (neuron) { return neuron.build(); });
    };
    Cortex.prototype.chargeTense = function (time) {
        _.each(this.neurons, function (n) {
            time.tense.add(function () { return n.tense.play(); }, 0);
        });
    };
    Cortex.prototype.freezeTense = function (time) {
        _.each(this.neurons, function (n) {
            n.tense.pause(time.tense.progress() * time.duration);
        });
    };
    Cortex.prototype.shiftTense = function (time, progress) {
        _.each(this.neurons, function (n) {
            n.tense.pause(progress * time.duration);
        });
    };
    Cortex.prototype.dispose = function () {
        _.each(this.neurons, function (neuron) { neuron.dispose(); });
    };
    return Cortex;
})();
