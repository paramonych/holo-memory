
document.addEventListener('DOMContentLoaded', plantConcept, false);

var lifetime = 8;

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

  scene.clearColor = new BABYLON.Color3(0.1, 0.1, 0.13);

  let scale = 10;
  let neuronsAmount = 2;
  let blastRadius = 3;
  let blastPower = 4;

  jQuery(ids.neuronsAmount).find('input').val(''+neuronsAmount);
  jQuery(ids.blastRadius).find('input').val(''+blastRadius);
  jQuery(ids.blastPower).find('input').val(''+blastPower);

  attachCamera(canvas, scene, scale);
  setLight(scene);
  createPatternSpaceBox(scene, scale);

  engine.runRenderLoop(() => {
    scene.render();
  });
  wireUI(new Space(scene, scale, lifetime, neuronsAmount, blastRadius, blastPower), new Time(lifetime));
}

function wireUI(space: Space, time: Time): void {
  let knobs = getUIControls();

  knobs.launch.on('click', function() {
    let next = knobs.launch.data('type');
    let html = knobs.launch.html();
    knobs.launch.data('type', html);
    knobs.launch.html(next);

    if(next === void 0) {
      knobs.launch.html('PAUSE');
      time.flow();
    } else if(next === 'PAUSE') {
      time.resume(space);
    } else if(next === 'PLAY') {
      knobs.launch.html(next);
      time.pause(space);
    }
  });

  knobs.applyButton.on('click',function() {
    let neuronsAmount = +knobs.neuronsAmount.val();
    let blastRadius = +knobs.blastRadius.val();
    let blastPower = +knobs.blastPower.val();
    space.applyConfig(neuronsAmount, blastRadius, blastPower);
  });
  /*knobs.restart.on('click',function() {
    knobs.launch.html('PAUSE');
    knobs.launch.data('type', 'PLAY');
    time.restart(space);
  });*/

  time.tense.eventCallback("onUpdate", function() {
    let pg = time.tense.progress();
    let progress = pg * 100;
    if(progress) {
      //knobs.slider.slider("value", progress);
    }
  });

  /*knobs.slider.slider({
    range: false,
    min: 0,
    max: 100,
    step:.1,
    slide: function ( event, ui ) {
      time.shiftTo(space, ui.value/100);
    }
  });*/

  space.expose(time);
}

function getUIControls(): Knobs {
  let launch = jQuery(ids.launch);
  let restart = jQuery(ids.restart);
  let slider = jQuery(ids.slider);
  let neuronsAmount = jQuery(ids.neuronsAmount);
  let blastRadius = jQuery(ids.blastRadius);
  let blastPower = jQuery(ids.blastPower);
  let applyButton = jQuery(ids.applyButton);
  return knobsFrom(launch, void 0, void 0, restart, slider, neuronsAmount, blastRadius, blastPower, applyButton);
}
