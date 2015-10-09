
document.addEventListener('DOMContentLoaded', initScene, false);

const scale = 10;
const amount = 7;

function initScene(): void {
  if (!BABYLON.Engine.isSupported()) {return;}
  let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("renderCanvas");
  let engine = new BABYLON.Engine(canvas, true);
  let scene = new BABYLON.Scene(engine);

  scene.clearColor = new BABYLON.Color3(.3, .3, .3);
  attachCamera(canvas, scene, scale);
  setLight(scene);

  createPatternSpaceBox(scene, scale);

  let cortex = new Cortex(amount, scene, scale);

  engine.runRenderLoop(() => scene.render());
  cortex.draw();
  bindControls(cortex);
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
