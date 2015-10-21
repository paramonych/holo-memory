var Cortex = (function () {
    function Cortex(scene, scale) {
        this.scene = scene;
        this.scale = scale;
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
    Cortex.prototype.react = function () {
        _.each(this.neurons, function (neuron) { return neuron.react(); });
    };
    Cortex.prototype.dispose = function () {
        _.each(this.neurons, function (neuron) { neuron.dispose(); });
    };
    return Cortex;
})();
