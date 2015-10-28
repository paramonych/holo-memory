
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
  let lifetime = 2;
  attachCamera(canvas, scene, scale);
  setLight(scene);
  createPatternSpaceBox(scene, scale);

  engine.runRenderLoop(() => {
    scene.render();
  });
  wireUI(new Space(scene, scale, lifetime), new Time(lifetime));
}

function wireUI(space: Space, time: Time): void {
  let knobs = getUIControls();

  knobs.launch.on('click', function() {
    let next = knobs.launch.data('type');
    let html = knobs.launch.html();
    knobs.launch.data('type', html);
    knobs.launch.html(next);

    if(next === 'PAUSE') {
      time.flow();
    } else {
      knobs.launch.html(next);
      time.stop(space);
    }
  });

  knobs.restart.on('click',function() { time.loop(); });

  time.tense.eventCallback("onUpdate", function() {
    let pg = time.tense.progress();
    let progress = pg * 100;
    if(progress) {
      knobs.slider.slider("value", progress);
    }
  });

  knobs.slider.slider({
    range: false,
    min: 0,
    max: 100,
    step:.1,
    slide: function ( event, ui ) {
      time.shiftTo(space, ui.value/100);
    }
  });

  space.expose(time);
}

function getUIControls(): Knobs {
  let launch = jQuery(ids.launch);
  let restart = jQuery(ids.restart);
  let slider = jQuery(ids.slider);
  return knobsFrom(launch, void 0, void 0, restart, slider);
}
