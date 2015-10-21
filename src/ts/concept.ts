
document.addEventListener('DOMContentLoaded', plant, false);

function plant(): void {
  if (!BABYLON.Engine.isSupported()) {return;}
  let canvas = <HTMLCanvasElement>jQuery(ids.canvas)[0];
  let engine = new BABYLON.Engine(canvas, true);
  let scene = new BABYLON.Scene(engine);
  //scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
  //scene.fogDensity = 0.5;
  //scene.fogStart = 20.0;
  //scene.fogEnd = 60.0;
  //scene.fogColor = new BABYLON.Color3(0.1, 0.9, 0.15);

  scene.clearColor = new BABYLON.Color3(.3, .3, .3);

  let scale = 10;
  attachCamera(canvas, scene, scale);
  setLight(scene);
  createPatternSpaceBox(scene, scale);

  engine.runRenderLoop(() => {
    scene.render();
  });
  wireUI(new Space(scene, scale), new Time());
}

function attachCamera(canvas: HTMLCanvasElement, scene: BABYLON.Scene, scale: number): BABYLON.ArcRotateCamera {
  var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI/12, 0, scale, new BABYLON.Vector3(0, 0, 0), scene);

  camera.setPosition(new BABYLON.Vector3(0, scale/3, -2.5*scale));
  var betaLimit = (Math.PI / 2) * 0.99;
  camera.lowerBetaLimit = 1/scale;
  camera.upperBetaLimit = 2*betaLimit;
  camera.lowerRadiusLimit = scale/2;
  camera.alpha = 5.5;
  camera.attachControl(canvas, false);

  return camera;
}

function setLight(scene: BABYLON.Scene): BABYLON.PointLight {
  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = .8;
  //light.groundColor = new BABYLON.Color3(.3,.3,.3);

  var lamp = new BABYLON.PointLight("Omni", new BABYLON.Vector3(0, 50, 50), scene);
  lamp.intensity = .4;
  lamp.diffuse = new BABYLON.Color3(0,.1,.1);
  lamp.specular = new BABYLON.Color3(0,0,.1);
  return lamp;
}

function createPatternSpaceBox(scene: BABYLON.Scene, scale: number): BABYLON.Mesh {
  var borderBox = BABYLON.Mesh.CreateBox("borders", scale, scene);
  borderBox.position = new BABYLON.Vector3(0,0,0);
  var borderBoxMaterial = new BABYLON.StandardMaterial("wire", scene);
  borderBoxMaterial.ambientColor = new BABYLON.Color3(1, 1, 1);
  borderBoxMaterial.wireframe = true;
  borderBoxMaterial.alpha = 0.5;
  borderBox.material = borderBoxMaterial;
  return borderBox;
}

function wireUI(space: Space, time: Time): void {
  let knobs = getUIControls();

  knobs.launch.on('click', function() {
    space.cortex.react();
    time.flow();
  });

  knobs.play.click(function() { time.flow()});
  knobs.pause.click(function() { time.stop()});
  knobs.restart.click(function() { time.loop()});

  //when the timeline updates, call the updateSlider function
  time.tense.eventCallback("onUpdate", function() {
    let progress = time.tense.progress() * 100;
    if(progress) {
      knobs.slider.slider("value", progress);
    }
  });

  knobs.slider.slider({
    range: false,
    min: 0,
    max: 100,
    step:.1
  });

  space.expose(time);
}

function getUIControls(): Knobs {
  let launch = jQuery(ids.launch);
  let play = jQuery(ids.play);
  let pause = jQuery(ids.pause);
  let restart = jQuery(ids.restart);
  let slider = jQuery(ids.slider);
  return knobsFrom(launch, play, pause, restart, slider);
}
