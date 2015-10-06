
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

  // This creates and positions a free camera
  var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
  camera.setPosition(new BABYLON.Vector3(0, 5, -10));

   camera.lowerBetaLimit = 0.1;
   camera.upperBetaLimit = (Math.PI / 2) * 0.99;
   camera.lowerRadiusLimit = 10;
  // This attaches the camera to the canvas
  camera.attachControl(canvas, false);

  // This creates a light, aiming 0,1,0 - to the sky.
  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

  // Dim the light a small amount
  light.intensity = .5;
  light.groundColor = new BABYLON.Color3(.5,.5,.5);

  // Let's try our built-in 'sphere' shape. Params: name, subdivisions, size, scene
  var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);

  // Move the sphere upward 1/2 its height
  sphere.position.y = 1;

  createNeuron(scene);

  // Let's try our built-in 'ground' shape.  Params: name, width, depth, subdivisions, scene
  var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);

  // Register a render loop to repeatedly render the scene
  engine.runRenderLoop(function () {
    scene.render();
  });
}

function createNeuron(scene: BABYLON.Scene): BABYLON.Mesh {
  //var path: BABYLON.Vector3[] = ;
  //var neuron = BABYLON.Mesh.CreateTube('neuron', path, 20, 0, (i, n) => n, 10, scene, true);
  var neuron = BABYLON.Mesh.CreateCylinder("cylinder", 3, 3, 3, 6, 1, scene, false);
  return neuron;
}
