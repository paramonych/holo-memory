var Synapce = (function () {
    function Synapce(neuron, position) {
        var _this = this;
        this.neuron = neuron;
        this.position = position;
        this.state = this.toDefaultState();
        var scene = this.neuron.cortex.scene;
        var scale = this.neuron.cortex.scale;
        this.mesh = new SynapceMesh(scene, scale, position);
        this.setMediator();
        this.deactivate();
        this.neuron.watchState(function (state) {
            if (state === StateType.Active) {
                _this.activate();
            }
        });
    }
    Synapce.prototype.setMediator = function () {
        this.mediator = new Mediator(this);
    };
    Synapce.prototype.activate = function () {
        this.state(StateType.Active);
    };
    Synapce.prototype.deactivate = function () {
        this.state(StateType.Silent);
    };
    Synapce.prototype.toDefaultState = function () {
        var _this = this;
        return ko.observable(StateType.Silent);
        this.state.subscribe(function (state) { return _this.serveState(state); });
    };
    Synapce.prototype.serveState = function (newState) {
        if (newState === StateType.Active) {
            this.mesh.activate();
            this.mediator.activate();
        }
        else if (newState === StateType.Silent) {
            this.mesh.deactivate();
            this.mediator.deactivate();
        }
    };
    Synapce.prototype.dispose = function () {
        this.mesh.dispose();
    };
    return Synapce;
})();
