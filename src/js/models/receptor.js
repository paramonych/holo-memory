var Receptor = (function () {
    function Receptor(position) {
        this.position = position;
        this.state = toDefaultState();
    }
    Receptor.prototype.open = function () {
        this.state.locked = ReceptorLock.Opened;
    };
    return Receptor;
})();
var ReceptorLock;
(function (ReceptorLock) {
    ReceptorLock[ReceptorLock['Closed'] = 0] = 'Closed';
    ReceptorLock[ReceptorLock['Opened'] = 1] = 'Opened';
})(ReceptorLock || (ReceptorLock = {}));
function toDefaultState() {
    return {
        locked: ReceptorLock.Closed
    };
}
