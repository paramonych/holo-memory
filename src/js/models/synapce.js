var Synapce = (function () {
    function Synapce(neuron, position) {
        var _this = this;
        this.neuron = neuron;
        this.position = position;
        this.state = this.toDefaultState();
        var scene = this.neuron.cortex.scene;
        var scale = this.neuron.cortex.scale;
        this.mesh = new SynapceMesh(scene, scale, position);
        this.deactivate();
        this.neuron.watchState(function (state) {
            if (state === StateType.Active) {
                _this.activate();
            }
        });
    }
    Synapce.prototype.activate = function () {
        this.state(StateType.Active);
    };
    Synapce.prototype.deactivate = function () {
        this.state(StateType.Silent);
    };
    Synapce.prototype.toDefaultState = function () {
        return ko.observable(StateType.Silent);
    };
    Synapce.prototype.serveState = function (newState) {
        if (newState === StateType.Active) {
            this.mesh.activate();
        }
        else if (newState === StateType.Silent) {
            this.mesh.deactivate();
        }
    };
    Synapce.prototype.dispose = function () {
        this.mesh.dispose();
    };
    return Synapce;
})();
