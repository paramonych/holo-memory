var Synapce = (function () {
    function Synapce(position) {
        this.position = position;
        this.state = this.toDefaultState();
    }
    Synapce.prototype.activate = function () {
        this.state(SynapceState.Opened);
    };
    Synapce.prototype.toDefaultState = function () {
        return ko.observable(SynapceState.Closed);
    };
    return Synapce;
})();
var SynapceState;
(function (SynapceState) {
    SynapceState[SynapceState['Closed'] = 0] = 'Closed';
    SynapceState[SynapceState['Opened'] = 1] = 'Opened';
})(SynapceState || (SynapceState = {}));
