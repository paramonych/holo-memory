var Cortex = (function () {
    function Cortex(neuronsNum, scene, scale) {
        this.neuronsNum = neuronsNum;
        this.scene = scene;
        this.scale = scale;
        this.createNeurons();
    }
    Cortex.prototype.createNeurons = function () {
        _.each(this.neurons, function (n) { return n.dispose(); });
        this.neurons = new Array();
        for (var i = 0; i < this.neuronsNum; i++) {
            this.neurons.push(new Neuron(this.scene, this.scale));
        }
    };
    Cortex.prototype.draw = function () {
        _.each(this.neurons, function (neuron) { return neuron.build(); });
    };
    Cortex.prototype.react = function () {
        _.each(this.neurons, function (neuron) { return neuron.react(); });
    };
    return Cortex;
})();
