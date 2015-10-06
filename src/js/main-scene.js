document.addEventListener("DOMContentLoaded", () => {
    if (BABYLON.Engine.isSupported()) {
        initScene();
    }
}, false);
function initScene() {
    var canvas = document.getElementById("renderCanvas");
    var engine = new BABYLON.Engine(canvas, true);
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(.3, .3, .3);
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
    camera.setPosition(new BABYLON.Vector3(0, 5, -10));
    camera.lowerBetaLimit = 0.1;
    camera.upperBetaLimit = (Math.PI / 2) * 0.99;
    camera.lowerRadiusLimit = 10;
    camera.attachControl(canvas, false);
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = .5;
    light.groundColor = new BABYLON.Color3(.5, .5, .5);
    var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
    sphere.position.y = 1;
    createNeuron(scene);
    var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);
    engine.runRenderLoop(function () {
        scene.render();
    });
}
function createNeuron(scene) {
    var neuron = BABYLON.Mesh.CreateCylinder("cylinder", 3, 3, 3, 6, 1, scene, false);
    return neuron;
}
