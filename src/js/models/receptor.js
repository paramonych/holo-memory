var Receptor = (function () {
    function Receptor(position) {
        this.position = position;
        this.state = this.toDefaultState();
    }
    Receptor.prototype.activate = function () {
        this.state(ReceptorState.Opened);
    };
    Receptor.prototype.toDefaultState = function () {
        return ko.observable(ReceptorState.Closed);
    };
    return Receptor;
})();
var ReceptorState;
(function (ReceptorState) {
    ReceptorState[ReceptorState['Closed'] = 0] = 'Closed';
    ReceptorState[ReceptorState['Opened'] = 1] = 'Opened';
})(ReceptorState || (ReceptorState = {}));
