
document.addEventListener("DOMContentLoaded", (): void => {
    if (BABYLON.Engine.isSupported()) {
        initScene();
    }
}, false);

// This begins the creation of a function that we will 'call' just after it's built
function initScene(): void {
  // Get the canvas element from our HTML above
  var canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("renderCanvas");

  // Load the BABYLON 3D engine
  var engine = new BABYLON.Engine(canvas, true);
  // Now create a basic Babylon Scene object
  var scene = new BABYLON.Scene(engine);

  // Change the scene background color to green.
  scene.clearColor = new BABYLON.Color3(.3, .3, .3);

  var scale = 10;

  attachCamera(canvas, scene, scale);
  setLight(scene);
  setControls(scene);
  createNeurons(7, scene, scale);
  //createMediator(scene);
  createPatternSpaceBox(scene, scale);

  engine.runRenderLoop(() => scene.render());
}

function createNeurons(number: number, scene: BABYLON.Scene, scale: number): void {
  var neurons = new Array<BABYLON.Mesh>();
  for(var i=0; i< number; i++) {
    neurons.push(createNeuron(scene, scale));
  }
}

function createNeuron(scene: BABYLON.Scene, scale: number): BABYLON.Mesh {
  var neuron = BABYLON.Mesh.CreateCylinder("cylinder", scale*3, 2/scale, 2/scale, scale, 1, scene, false);
  neuron.position = randomVector(scale);
  neuron.rotation = randomAngleVector();

  if(Math.random() > 0.5) {
    var activeNeuronMaterial = new BABYLON.StandardMaterial("active-neuron", scene);
    activeNeuronMaterial.emissiveColor = new BABYLON.Color3(1, .9, 0);
    activeNeuronMaterial.ambientColor = new BABYLON.Color3(0, 0, 1);

    neuron.material = activeNeuronMaterial;
  }

  return neuron;
}

function randomAngleVector(): BABYLON.Vector3 {
  var angle = () => randomSign()*Math.PI/Math.random();
  return new BABYLON.Vector3(angle(),angle(),angle());
}

function randomVector(scale: number): BABYLON.Vector3 {
  var num = () => (scale/2)*Math.random()*randomSign();
  return new BABYLON.Vector3(num(),num(),num());
}

function randomSign(): number {
  var a = Math.random();
  var b = Math.random();
  return (a-b)/Math.abs(a-b);
}

function attachCamera(canvas: HTMLCanvasElement, scene: BABYLON.Scene, scale: number): void {
  var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI/12, 0, scale, new BABYLON.Vector3(0, 0, 0), scene);

  camera.setPosition(new BABYLON.Vector3(0, scale/3, -2.5*scale));
  var betaLimit = (Math.PI / 2) * 0.99;
  camera.lowerBetaLimit = 1/scale;
  camera.upperBetaLimit = 2*betaLimit;
  camera.lowerRadiusLimit = scale/2;
  camera.alpha = 5.5;
  camera.attachControl(canvas, false);
}

function setLight(scene: BABYLON.Scene): void {
  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = .8;
  //light.groundColor = new BABYLON.Color3(.3,.3,.3);

  var lamp = new BABYLON.PointLight("Omni", new BABYLON.Vector3(0, 50, 50), scene);
  lamp.intensity = .4;
  lamp.diffuse = new BABYLON.Color3(0,.1,.1);
  lamp.specular = new BABYLON.Color3(0,0,.1);
}

function createPatternSpaceBox(scene: BABYLON.Scene, scale: number): BABYLON.Mesh {
  var borderBox = BABYLON.Mesh.CreateBox("borders", scale, scene);
  borderBox.position = new BABYLON.Vector3(0,0,0);
  var borderBoxMaterial = new BABYLON.StandardMaterial("wire", scene);
  borderBoxMaterial.wireframe = true;
  borderBoxMaterial.alpha = 0.5;
  borderBox.material = borderBoxMaterial;
  return borderBox;
}

function createMediator(scene: BABYLON.Scene): BABYLON.Mesh {
  var sphere = BABYLON.Mesh.CreateSphere("sphere1", 2, 2, scene);
  sphere.position.y = 1;
  return sphere;
}
