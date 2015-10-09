var Cortex = (function () {
    function Cortex(neuronsNum, scene, scale) {
        this.neuronsNum = neuronsNum;
        this.scene = scene;
        this.scale = scale;
    }
    Cortex.prototype.createNeurons = function () {
        this.neurons = new Array();
        for (var i = 0; i < this.neuronsNum; i++) {
            this.neurons.push(new Neuron(this.scene, this.scale));
        }
    };
    Cortex.prototype.draw = function () {
        _.each(this.neurons, function (n) { return n.dispose(); });
        this.createNeurons();
        _.each(this.neurons, function (neuron) { return neuron.draw(); });
    };
    Cortex.prototype.react = function () {
        _.each(this.neurons, function (neuron) { return neuron.react(); });
    };
    return Cortex;
})();
