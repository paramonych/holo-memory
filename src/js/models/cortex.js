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
var StateType;
(function (StateType) {
    StateType[StateType['Active'] = 0] = 'Active';
    StateType[StateType['Silent'] = 1] = 'Silent';
})(StateType || (StateType = {}));
