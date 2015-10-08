var Neuron = (function () {
    function Neuron(start, end) {
        this.state = toDefaultState();
        this.receptorCluster = new Array();
        this.spike = new Spike(start, start, end);
    }
    Neuron.prototype.activate = function () {
        activate(this.state);
    };
    return Neuron;
})();
var StateType;
(function (StateType) {
    StateType[StateType['Locked'] = 0] = 'Locked';
    StateType[StateType['Active'] = 1] = 'Active';
    StateType[StateType['Silent'] = 2] = 'Silent';
})(StateType || (StateType = {}));
function toDefaultState() {
    return {
        type: StateType.Silent
    };
}
function activate(state) {
    state.type = StateType.Active;
}
