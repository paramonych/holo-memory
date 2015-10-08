function setControls(scene) {
    var animationBox = new BABYLON.Animation('myAnimation', "scaling.x", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);
    jQuery('#launch').on('click', function () {
        console.log('OK!!');
    });
}
;document.addEventListener("DOMContentLoaded", function () {
    if (BABYLON.Engine.isSupported()) {
        initScene();
    }
}, false);
function initScene() {
    var canvas = document.getElementById("renderCanvas");
    var engine = new BABYLON.Engine(canvas, true);
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(.3, .3, .3);
    var scale = 10;
    attachCamera(canvas, scene, scale);
    setLight(scene);
    setControls(scene);
    createNeurons(7, scene, scale);
    createPatternSpaceBox(scene, scale);
    engine.runRenderLoop(function () { return scene.render(); });
}
function createNeurons(number, scene, scale) {
    var neurons = new Array();
    for (var i = 0; i < number; i++) {
        neurons.push(createNeuron(scene, scale));
    }
}
function createNeuron(scene, scale) {
    var neuron = BABYLON.Mesh.CreateCylinder("cylinder", scale * 3, 2 / scale, 2 / scale, scale, 1, scene, false);
    neuron.position = randomVector(scale);
    neuron.rotation = randomAngleVector();
    if (Math.random() > 0.5) {
        var activeNeuronMaterial = new BABYLON.StandardMaterial("active-neuron", scene);
        activeNeuronMaterial.emissiveColor = new BABYLON.Color3(1, .9, 0);
        activeNeuronMaterial.ambientColor = new BABYLON.Color3(0, 0, 1);
        neuron.material = activeNeuronMaterial;
    }
    return neuron;
}
function randomAngleVector() {
    var angle = function () { return randomSign() * Math.PI / Math.random(); };
    return new BABYLON.Vector3(angle(), angle(), angle());
}
function randomVector(scale) {
    var num = function () { return (scale / 2) * Math.random() * randomSign(); };
    return new BABYLON.Vector3(num(), num(), num());
}
function randomSign() {
    var a = Math.random();
    var b = Math.random();
    return (a - b) / Math.abs(a - b);
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
;function setControls(scene) {
    var animationBox = new BABYLON.Animation('myAnimation', "scaling.x", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);
    jQuery('#launch').on('click', function () {
        console.log('OK!!');
    });
}
;document.addEventListener("DOMContentLoaded", function () {
    if (BABYLON.Engine.isSupported()) {
        initScene();
    }
}, false);
function initScene() {
    var canvas = document.getElementById("renderCanvas");
    var engine = new BABYLON.Engine(canvas, true);
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(.3, .3, .3);
    var scale = 10;
    attachCamera(canvas, scene, scale);
    setLight(scene);
    setControls(scene);
    createNeurons(7, scene, scale);
    createPatternSpaceBox(scene, scale);
    engine.runRenderLoop(function () { return scene.render(); });
}
function createNeurons(number, scene, scale) {
    var neurons = new Array();
    for (var i = 0; i < number; i++) {
        neurons.push(createNeuron(scene, scale));
    }
}
function createNeuron(scene, scale) {
    var neuron = BABYLON.Mesh.CreateCylinder("cylinder", scale * 3, 2 / scale, 2 / scale, scale, 1, scene, false);
    neuron.position = randomVector(scale);
    neuron.rotation = randomAngleVector();
    if (Math.random() > 0.5) {
        var activeNeuronMaterial = new BABYLON.StandardMaterial("active-neuron", scene);
        activeNeuronMaterial.emissiveColor = new BABYLON.Color3(1, .9, 0);
        activeNeuronMaterial.ambientColor = new BABYLON.Color3(0, 0, 1);
        neuron.material = activeNeuronMaterial;
    }
    return neuron;
}
function randomAngleVector() {
    var angle = function () { return randomSign() * Math.PI / Math.random(); };
    return new BABYLON.Vector3(angle(), angle(), angle());
}
function randomVector(scale) {
    var num = function () { return (scale / 2) * Math.random() * randomSign(); };
    return new BABYLON.Vector3(num(), num(), num());
}
function randomSign() {
    var a = Math.random();
    var b = Math.random();
    return (a - b) / Math.abs(a - b);
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
;function setControls(scene) {
    var animationBox = new BABYLON.Animation('myAnimation', "scaling.x", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);
    jQuery('#launch').on('click', function () {
        console.log('OK!!');
    });
}
;document.addEventListener("DOMContentLoaded", function () {
    if (BABYLON.Engine.isSupported()) {
        initScene();
    }
}, false);
function initScene() {
    var canvas = document.getElementById("renderCanvas");
    var engine = new BABYLON.Engine(canvas, true);
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(.3, .3, .3);
    var scale = 10;
    attachCamera(canvas, scene, scale);
    setLight(scene);
    setControls(scene);
    createNeurons(7, scene, scale);
    createPatternSpaceBox(scene, scale);
    engine.runRenderLoop(function () { return scene.render(); });
}
function createNeurons(number, scene, scale) {
    var neurons = new Array();
    for (var i = 0; i < number; i++) {
        neurons.push(createNeuron(scene, scale));
    }
}
function createNeuron(scene, scale) {
    var neuron = BABYLON.Mesh.CreateCylinder("cylinder", scale * 3, 2 / scale, 2 / scale, scale, 1, scene, false);
    neuron.position = randomVector(scale);
    neuron.rotation = randomAngleVector();
    if (Math.random() > 0.5) {
        var activeNeuronMaterial = new BABYLON.StandardMaterial("active-neuron", scene);
        activeNeuronMaterial.emissiveColor = new BABYLON.Color3(1, .9, 0);
        activeNeuronMaterial.ambientColor = new BABYLON.Color3(0, 0, 1);
        neuron.material = activeNeuronMaterial;
    }
    return neuron;
}
function randomAngleVector() {
    var angle = function () { return randomSign() * Math.PI / Math.random(); };
    return new BABYLON.Vector3(angle(), angle(), angle());
}
function randomVector(scale) {
    var num = function () { return (scale / 2) * Math.random() * randomSign(); };
    return new BABYLON.Vector3(num(), num(), num());
}
function randomSign() {
    var a = Math.random();
    var b = Math.random();
    return (a - b) / Math.abs(a - b);
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
;function setControls(scene) {
    var animationBox = new BABYLON.Animation('myAnimation', "scaling.x", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);
    jQuery('#launch').on('click', function () {
        console.log('OK!!');
    });
}
;document.addEventListener("DOMContentLoaded", function () {
    if (BABYLON.Engine.isSupported()) {
        initScene();
    }
}, false);
function initScene() {
    var canvas = document.getElementById("renderCanvas");
    var engine = new BABYLON.Engine(canvas, true);
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(.3, .3, .3);
    var scale = 10;
    attachCamera(canvas, scene, scale);
    setLight(scene);
    setControls(scene);
    createNeurons(7, scene, scale);
    createPatternSpaceBox(scene, scale);
    engine.runRenderLoop(function () { return scene.render(); });
}
function createNeurons(number, scene, scale) {
    var neurons = new Array();
    for (var i = 0; i < number; i++) {
        neurons.push(createNeuron(scene, scale));
    }
}
function createNeuron(scene, scale) {
    var neuron = BABYLON.Mesh.CreateCylinder("cylinder", scale * 3, 2 / scale, 2 / scale, scale, 1, scene, false);
    neuron.position = randomVector(scale);
    neuron.rotation = randomAngleVector();
    if (Math.random() > 0.5) {
        var activeNeuronMaterial = new BABYLON.StandardMaterial("active-neuron", scene);
        activeNeuronMaterial.emissiveColor = new BABYLON.Color3(1, .9, 0);
        activeNeuronMaterial.ambientColor = new BABYLON.Color3(0, 0, 1);
        neuron.material = activeNeuronMaterial;
    }
    return neuron;
}
function randomAngleVector() {
    var angle = function () { return randomSign() * Math.PI / Math.random(); };
    return new BABYLON.Vector3(angle(), angle(), angle());
}
function randomVector(scale) {
    var num = function () { return (scale / 2) * Math.random() * randomSign(); };
    return new BABYLON.Vector3(num(), num(), num());
}
function randomSign() {
    var a = Math.random();
    var b = Math.random();
    return (a - b) / Math.abs(a - b);
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
;function setControls(scene) {
    var animationBox = new BABYLON.Animation('myAnimation', "scaling.x", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);
    jQuery('#launch').on('click', function () {
        console.log('OK!!');
    });
}
;document.addEventListener("DOMContentLoaded", function () {
    if (BABYLON.Engine.isSupported()) {
        initScene();
    }
}, false);
function initScene() {
    var canvas = document.getElementById("renderCanvas");
    var engine = new BABYLON.Engine(canvas, true);
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(.3, .3, .3);
    var scale = 10;
    attachCamera(canvas, scene, scale);
    setLight(scene);
    setControls(scene);
    createNeurons(7, scene, scale);
    createPatternSpaceBox(scene, scale);
    engine.runRenderLoop(function () { return scene.render(); });
}
function createNeurons(number, scene, scale) {
    var neurons = new Array();
    for (var i = 0; i < number; i++) {
        neurons.push(createNeuron(scene, scale));
    }
}
function createNeuron(scene, scale) {
    var neuron = BABYLON.Mesh.CreateCylinder("cylinder", scale * 3, 2 / scale, 2 / scale, scale, 1, scene, false);
    neuron.position = randomVector(scale);
    neuron.rotation = randomAngleVector();
    if (Math.random() > 0.5) {
        var activeNeuronMaterial = new BABYLON.StandardMaterial("active-neuron", scene);
        activeNeuronMaterial.emissiveColor = new BABYLON.Color3(1, .9, 0);
        activeNeuronMaterial.ambientColor = new BABYLON.Color3(0, 0, 1);
        neuron.material = activeNeuronMaterial;
    }
    return neuron;
}
function randomAngleVector() {
    var angle = function () { return randomSign() * Math.PI / Math.random(); };
    return new BABYLON.Vector3(angle(), angle(), angle());
}
function randomVector(scale) {
    var num = function () { return (scale / 2) * Math.random() * randomSign(); };
    return new BABYLON.Vector3(num(), num(), num());
}
function randomSign() {
    var a = Math.random();
    var b = Math.random();
    return (a - b) / Math.abs(a - b);
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
;function setControls(scene) {
    var animationBox = new BABYLON.Animation('myAnimation', "scaling.x", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);
    jQuery('#launch').on('click', function () {
        console.log('OK!!');
    });
}
;document.addEventListener("DOMContentLoaded", function () {
    if (BABYLON.Engine.isSupported()) {
        initScene();
    }
}, false);
function initScene() {
    var canvas = document.getElementById("renderCanvas");
    var engine = new BABYLON.Engine(canvas, true);
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(.3, .3, .3);
    var scale = 10;
    attachCamera(canvas, scene, scale);
    setLight(scene);
    setControls(scene);
    createNeurons(7, scene, scale);
    createPatternSpaceBox(scene, scale);
    engine.runRenderLoop(function () { return scene.render(); });
}
function createNeurons(number, scene, scale) {
    var neurons = new Array();
    for (var i = 0; i < number; i++) {
        neurons.push(createNeuron(scene, scale));
    }
}
function createNeuron(scene, scale) {
    var neuron = BABYLON.Mesh.CreateCylinder("cylinder", scale * 3, 2 / scale, 2 / scale, scale, 1, scene, false);
    neuron.position = randomVector(scale);
    neuron.rotation = randomAngleVector();
    if (Math.random() > 0.5) {
        var activeNeuronMaterial = new BABYLON.StandardMaterial("active-neuron", scene);
        activeNeuronMaterial.emissiveColor = new BABYLON.Color3(1, .9, 0);
        activeNeuronMaterial.ambientColor = new BABYLON.Color3(0, 0, 1);
        neuron.material = activeNeuronMaterial;
    }
    return neuron;
}
function randomAngleVector() {
    var angle = function () { return randomSign() * Math.PI / Math.random(); };
    return new BABYLON.Vector3(angle(), angle(), angle());
}
function randomVector(scale) {
    var num = function () { return (scale / 2) * Math.random() * randomSign(); };
    return new BABYLON.Vector3(num(), num(), num());
}
function randomSign() {
    var a = Math.random();
    var b = Math.random();
    return (a - b) / Math.abs(a - b);
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
;function setControls(scene) {
    var animationBox = new BABYLON.Animation('myAnimation', "scaling.x", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);
    jQuery('#launch').on('click', function () {
        console.log('OK!!');
    });
}
;document.addEventListener("DOMContentLoaded", function () {
    if (BABYLON.Engine.isSupported()) {
        initScene();
    }
}, false);
function initScene() {
    var canvas = document.getElementById("renderCanvas");
    var engine = new BABYLON.Engine(canvas, true);
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(.3, .3, .3);
    var scale = 10;
    attachCamera(canvas, scene, scale);
    setLight(scene);
    setControls(scene);
    createNeurons(7, scene, scale);
    createPatternSpaceBox(scene, scale);
    engine.runRenderLoop(function () { return scene.render(); });
}
function createNeurons(number, scene, scale) {
    var neurons = new Array();
    for (var i = 0; i < number; i++) {
        neurons.push(createNeuron(scene, scale));
    }
}
function createNeuron(scene, scale) {
    var neuron = BABYLON.Mesh.CreateCylinder("cylinder", scale * 3, 2 / scale, 2 / scale, scale, 1, scene, false);
    neuron.position = randomVector(scale);
    neuron.rotation = randomAngleVector();
    if (Math.random() > 0.5) {
        var activeNeuronMaterial = new BABYLON.StandardMaterial("active-neuron", scene);
        activeNeuronMaterial.emissiveColor = new BABYLON.Color3(1, .9, 0);
        activeNeuronMaterial.ambientColor = new BABYLON.Color3(0, 0, 1);
        neuron.material = activeNeuronMaterial;
    }
    return neuron;
}
function randomAngleVector() {
    var angle = function () { return randomSign() * Math.PI / Math.random(); };
    return new BABYLON.Vector3(angle(), angle(), angle());
}
function randomVector(scale) {
    var num = function () { return (scale / 2) * Math.random() * randomSign(); };
    return new BABYLON.Vector3(num(), num(), num());
}
function randomSign() {
    var a = Math.random();
    var b = Math.random();
    return (a - b) / Math.abs(a - b);
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
;function setControls(scene) {
    var animationBox = new BABYLON.Animation('myAnimation', "scaling.x", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);
    jQuery('#launch').on('click', function () {
        console.log('OK!!');
    });
}
;document.addEventListener("DOMContentLoaded", function () {
    if (BABYLON.Engine.isSupported()) {
        initScene();
    }
}, false);
function initScene() {
    var canvas = document.getElementById("renderCanvas");
    var engine = new BABYLON.Engine(canvas, true);
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(.3, .3, .3);
    var scale = 10;
    attachCamera(canvas, scene, scale);
    setLight(scene);
    setControls(scene);
    createNeurons(7, scene, scale);
    createPatternSpaceBox(scene, scale);
    engine.runRenderLoop(function () { return scene.render(); });
}
function createNeurons(number, scene, scale) {
    var neurons = new Array();
    for (var i = 0; i < number; i++) {
        neurons.push(createNeuron(scene, scale));
    }
}
function createNeuron(scene, scale) {
    var neuron = BABYLON.Mesh.CreateCylinder("cylinder", scale * 3, 2 / scale, 2 / scale, scale, 1, scene, false);
    neuron.position = randomVector(scale);
    neuron.rotation = randomAngleVector();
    if (Math.random() > 0.5) {
        var activeNeuronMaterial = new BABYLON.StandardMaterial("active-neuron", scene);
        activeNeuronMaterial.emissiveColor = new BABYLON.Color3(1, .9, 0);
        activeNeuronMaterial.ambientColor = new BABYLON.Color3(0, 0, 1);
        neuron.material = activeNeuronMaterial;
    }
    return neuron;
}
function randomAngleVector() {
    var angle = function () { return randomSign() * Math.PI / Math.random(); };
    return new BABYLON.Vector3(angle(), angle(), angle());
}
function randomVector(scale) {
    var num = function () { return (scale / 2) * Math.random() * randomSign(); };
    return new BABYLON.Vector3(num(), num(), num());
}
function randomSign() {
    var a = Math.random();
    var b = Math.random();
    return (a - b) / Math.abs(a - b);
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
