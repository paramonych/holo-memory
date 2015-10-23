
document.addEventListener('DOMContentLoaded', plantConcept, false);

function plantConcept(): void {
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

function wireUI(space: Space, time: Time): void {
  let knobs = getUIControls();

  knobs.launch.on('click', function() {
    space.cortex.react();
    //time.flow();
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
