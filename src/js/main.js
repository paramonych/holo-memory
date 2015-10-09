function bindControls(cortex) {
    jQuery('#launch').on('click', function () {
        console.log('OK!!');
        cortex.draw();
        cortex.react();
    });
}
;function randomSign() {
    var a = Math.random();
    var b = Math.random();
    return (a - b) / Math.abs(a - b);
}
;function randomAngleVector() {
    var angle = function () { return randomSign() * Math.PI / Math.random(); };
    return new BABYLON.Vector3(angle(), angle(), angle());
}
function randomVector(scale) {
    var num = function () { return (scale / 2) * Math.random() * randomSign(); };
    return new BABYLON.Vector3(num(), num(), num());
}
;document.addEventListener('DOMContentLoaded', initScene, false);
var scale = 10;
var amount = 7;
function initScene() {
    if (!BABYLON.Engine.isSupported()) {
        return;
    }
    var canvas = document.getElementById("renderCanvas");
    var engine = new BABYLON.Engine(canvas, true);
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(.3, .3, .3);
    attachCamera(canvas, scene, scale);
    setLight(scene);
    createPatternSpaceBox(scene, scale);
    var cortex = new Cortex(amount, scene, scale);
    engine.runRenderLoop(function () { return scene.render(); });
    bindControls(cortex);
}
function attachCamera(canvas, scene, scale) {
    var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 12, 0, scale, new BABYLON.Vector3(0, 0, 0), scene);
    camera.setPosition(new BABYLON.Vector3(0, scale / 3, -2.5 * scale));
    var betaLimit = (Math.PI / 2) * 0.99;
    camera.lowerBetaLimit = 1 / scale;
    camera.upperBetaLimit = 2 * betaLimit;
    camera.lowerRadiusLimit = scale / 2;
    camera.alpha = 5.5;
    camera.attachControl(canvas, false);
}
function setLight(scene) {
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = .8;
    var lamp = new BABYLON.PointLight("Omni", new BABYLON.Vector3(0, 50, 50), scene);
    lamp.intensity = .4;
    lamp.diffuse = new BABYLON.Color3(0, .1, .1);
    lamp.specular = new BABYLON.Color3(0, 0, .1);
}
function createPatternSpaceBox(scene, scale) {
    var borderBox = BABYLON.Mesh.CreateBox("borders", scale, scene);
    borderBox.position = new BABYLON.Vector3(0, 0, 0);
    var borderBoxMaterial = new BABYLON.StandardMaterial("wire", scene);
    borderBoxMaterial.wireframe = true;
    borderBoxMaterial.alpha = 0.5;
    borderBox.material = borderBoxMaterial;
    return borderBox;
}
function createMediator(scene) {
    var sphere = BABYLON.Mesh.CreateSphere("sphere1", 2, 2, scene);
    sphere.position.y = 1;
    return sphere;
}
;var Cortex = (function () {
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
;var Mediator = (function () {
    function Mediator(name, color) {
        this.name = name;
        this.color = color;
    }
    return Mediator;
})();
;var Neuron = (function () {
    function Neuron(scene, scale) {
        var _this = this;
        this.scene = scene;
        this.scale = scale;
        this.receptorCluster = new Array();
        this.activatable = false;
        this.position = randomVector(scale);
        this.rotation = randomAngleVector();
        this.length = scale * 3;
        this.setMaterials();
        this.toDefaultState();
        this.spike = new Spike(this.scene, this.position, this.rotation, this.length, this.state);
        this.spike.state.subscribe(function (state) {
            if (state === StateType.Silent) {
                _this.deactivate();
            }
        });
    }
    Neuron.prototype.dispose = function () {
        this.spike.dispose();
        this.scene.removeMesh(this.mesh);
    };
    Neuron.prototype.draw = function () {
        var scale = this.scale;
        this.mesh = BABYLON.Mesh.CreateCylinder('cylinder', this.length, 2 / scale, 2 / scale, scale, 1, this.scene, false);
        this.mesh.position = this.position;
        this.mesh.rotation = this.rotation;
        if (Math.random() > 0.5) {
            this.activatable = true;
        }
    };
    Neuron.prototype.react = function () {
        if (this.activatable) {
            this.activate();
        }
    };
    Neuron.prototype.activate = function () {
        this.state(StateType.Active);
    };
    Neuron.prototype.deactivate = function () {
        this.state(StateType.Silent);
    };
    Neuron.prototype.serveState = function (newState) {
        if (newState === StateType.Active) {
            this.mesh.material = this.activeNeuronMaterial;
        }
        else if (newState === StateType.Silent) {
            this.mesh.material = this.neuronMaterial;
        }
    };
    Neuron.prototype.toDefaultState = function () {
        var _this = this;
        this.state = ko.observable(StateType.Silent);
        this.state.subscribe(function (state) { return _this.serveState(state); });
    };
    Neuron.prototype.setMaterials = function () {
        this.neuronMaterial = new BABYLON.StandardMaterial('silent-neuron', this.scene);
        this.neuronMaterial.alpha = 1;
        this.activeNeuronMaterial = new BABYLON.StandardMaterial('active-neuron', this.scene);
        this.activeNeuronMaterial.emissiveColor = new BABYLON.Color3(1, .9, 0);
        this.activeNeuronMaterial.ambientColor = new BABYLON.Color3(0, 0, 1);
        this.activeNeuronMaterial.alpha = 0.3;
    };
    return Neuron;
})();
var StateType;
(function (StateType) {
    StateType[StateType['Active'] = 0] = 'Active';
    StateType[StateType['Silent'] = 1] = 'Silent';
})(StateType || (StateType = {}));
;var Receptor = (function () {
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
;var Spike = (function () {
    function Spike(scene, position, rotation, neuronLength, neuronState) {
        var _this = this;
        this.scene = scene;
        this.position = position;
        this.rotation = rotation;
        this.neuronLength = neuronLength;
        this.speed = 1;
        this.time = ko.observable(0);
        this.lifeTime = 2000;
        this.timerId = 0;
        this.grain = 5;
        this.shift = new BABYLON.Vector3(0.1, 0.1, 0.1);
        this.toDefaultState();
        this.setMaterials();
        this.constructShoulders();
        this.deactivate();
        this.time.subscribe(function (time) { return _this.moveShoulders(time); });
        neuronState.subscribe(function (state) {
            if (state === StateType.Active) {
                _this.launch();
            }
        });
    }
    Spike.prototype.constructShoulders = function () {
        this.shoulders = shouldersFrom(this.constructShoulderMesh(), this.constructShoulderMesh());
        this.deactivate();
    };
    Spike.prototype.activate = function () {
        this.state(StateType.Active);
    };
    Spike.prototype.deactivate = function () {
        this.state(StateType.Silent);
    };
    Spike.prototype.dispose = function () {
        this.scene.removeMesh(this.shoulders.left);
        this.scene.removeMesh(this.shoulders.right);
    };
    Spike.prototype.constructShoulderMesh = function () {
        var scale = this.neuronLength / 3;
        var shoulder = BABYLON.Mesh.CreateCylinder('cylinder', scale / 50, 2 / scale, 2 / scale, scale, 1, this.scene, false);
        shoulder.position = this.position;
        shoulder.rotation = this.rotation;
        return shoulder;
    };
    Spike.prototype.moveShoulders = function (time) {
        var left = this.shoulders.left.position;
        var right = this.shoulders.right.position;
        var newLeft = new BABYLON.Vector3(left.x + 1, left.y + 1, left.z + 1);
        var newRight = newLeft.negate();
    };
    Spike.prototype.resetPosition = function () {
        this.shoulders.left.position = this.position;
        this.shoulders.right.position = this.position;
    };
    Spike.prototype.launch = function () {
        var _this = this;
        this.activate();
        this.timerId = window.setInterval(function () { return _this.tick(); }, this.grain);
    };
    Spike.prototype.tick = function () {
        var currentTime = this.time() + this.grain;
        if (currentTime >= this.lifeTime) {
            window.clearInterval(this.timerId);
            this.deactivate();
            this.resetPosition();
        }
        else {
            this.time(currentTime);
        }
    };
    Spike.prototype.serveState = function (newState) {
        if (newState === StateType.Active) {
            this.shoulders.left.material = this.movingSpikeMaterial;
            this.shoulders.right.material = this.movingSpikeMaterial;
        }
        else if (newState === StateType.Silent) {
            this.shoulders.left.material = this.spikeMaterial;
            this.shoulders.right.material = this.spikeMaterial;
        }
    };
    Spike.prototype.setMaterials = function () {
        this.spikeMaterial = new BABYLON.StandardMaterial('silent-spike', this.scene);
        this.spikeMaterial.alpha = 1;
        this.movingSpikeMaterial = new BABYLON.StandardMaterial('moving-spike', this.scene);
        this.movingSpikeMaterial.emissiveColor = new BABYLON.Color3(1, .2, 0);
        this.movingSpikeMaterial.ambientColor = new BABYLON.Color3(0, 0, 1);
        this.movingSpikeMaterial.alpha = 0.9;
    };
    Spike.prototype.toDefaultState = function () {
        var _this = this;
        this.state = ko.observable(StateType.Silent);
        this.state.subscribe(function (state) { return _this.serveState(state); });
    };
    return Spike;
})();
function shouldersFrom(left, right) {
    return {
        left: left,
        right: right
    };
}
;var Synapce = (function () {
    function Synapce() {
    }
    return Synapce;
})();
