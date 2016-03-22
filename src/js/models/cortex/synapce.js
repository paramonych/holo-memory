var Synapce = (function () {
    function Synapce(neuron, position) {
        this.neuron = neuron;
        this.id = getUniqueId();
        this.code = getRandomFourArray();
        this.toDefaultState();
        var scene = this.neuron.cortex.scene;
        var scale = this.neuron.cortex.scale;
        this.mesh = new SynapceMesh(scene, scale, position, neuron);
        this.setMediator();
        this.deactivate();
    }
    Synapce.prototype.setMediumCodeMesh = function (count, isBiggestCount) {
        var scene = this.neuron.cortex.scene;
        var scale = this.neuron.cortex.scale;
        if (count > 0) {
            this.codeMesh = new Code(scene, scale, this.mesh.mesh.position, '' + count, isBiggestCount);
        }
    };
    Synapce.prototype.reset = function () {
        this.mesh.resetMaterials();
        if (this.codeMesh) {
            this.codeMesh.dispose();
            this.codeMesh = null;
        }
    };
    Synapce.prototype.allowMediator = function () {
        this.mediator.willBeUsed();
    };
    Synapce.prototype.getId = function () {
        return this.id.toString();
    };
    Synapce.prototype.setMediator = function () {
        this.mediator = new Mediator(this);
    };
    Synapce.prototype.activate = function () {
        this.state(StateType.Active);
    };
    Synapce.prototype.activateUntil = function (timeInMillis) {
        var _this = this;
        this.state(StateType.Active);
        setTimeout(function () { return _this.deactivate(); }, timeInMillis);
    };
    Synapce.prototype.deactivate = function () {
        this.state(StateType.Silent);
    };
    Synapce.prototype.toDefaultState = function () {
        var _this = this;
        this.state = ko.observable(StateType.Silent);
        this.state.subscribe(function (state) { return _this.serveState(state); });
    };
    Synapce.prototype.serveState = function (newState) {
        if (isActiveState(newState)) {
            this.mesh.activate();
            this.mediator.activate();
        }
        else {
            this.mesh.deactivate();
            this.mediator.deactivate();
        }
    };
    Synapce.prototype.isActive = function () {
        return isActiveState(this.state());
    };
    Synapce.prototype.dispose = function () {
        this.mesh.dispose();
        this.mesh = null;
        if (this.codeMesh && this.codeMesh.dispose) {
            this.codeMesh.dispose();
            this.codeMesh = null;
        }
        this.mediator.dispose();
        this.mediator = null;
        this.state = null;
    };
    return Synapce;
}());
