
document.addEventListener('DOMContentLoaded', plantConcept, false);

var lifetime = 7;

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

  let cortexSate = cortexConfigurationFrom(5, 100, 5, 0.5, 0.2, 3);

  jQuery(ids.neuronsAmount).find('input').val(''+cortexSate.neuronsAmount);
  jQuery(ids.synapcesAmount).find('input').val(''+cortexSate.synapcesAmount);
  jQuery(ids.pinMaxLength).find('input').val(''+cortexSate.pinMaxLength);
  jQuery(ids.blastRadius).find('input').val(''+cortexSate.blastRadius);
  jQuery(ids.blastPower).find('input').val(''+cortexSate.blastPower);

  attachCamera(canvas, scene, cortexSate.scale);
  setLight(scene);
  createPatternSpaceBox(scene, cortexSate.scale);

  engine.runRenderLoop(() => {
    scene.render();
  });
  wireUI(scene, cortexSate.scale, canvas);
}

function wireUI(scene: BABYLON.Scene, scale: number, canvas: HTMLCanvasElement): void {
  let knobs = getUIControls();

  let neuronsAmount = +knobs.neuronsAmount.val();
  let synapcesAmount = +knobs.synapcesAmount.val();
  let pinMaxLength = +knobs.pinMaxLength.val();
  let blastRadius = +knobs.blastRadius.val();
  let blastPower = +knobs.blastPower.val();
  let uiCallback = (blastsAmount: number): void => {
    if(blastsAmount === 0) {
      knobs.launch.attr('disabled', 'disabled');
    } else {
      knobs.launch.removeAttr('disabled');
    }
  };

  let space = new Space(scene, scale, lifetime, neuronsAmount, blastRadius, blastPower, uiCallback);
  let time = new Time(lifetime);

  knobs.launch.off('click').on('click', function() {
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

  knobs.applyButton.off('click').on('click',function() {
    neuronsAmount = +knobs.neuronsAmount.val();
    blastRadius = +knobs.blastRadius.val();
    blastPower = +knobs.blastPower.val();
    space.dispose();
    time.dispose();
    scene.dispose();
    attachCamera(canvas, scene, scale);
    setLight(scene);
    createPatternSpaceBox(scene, scale);
    scene.render();
    wireUI(scene, scale, canvas);
  });

  time.tense.eventCallback("onUpdate", function() {
    let pg = time.tense.progress();
    let progress = pg * 100;

    if(progress) {
      //knobs.slider.slider("value", progress);
    }
  });

  time.tense.eventCallback("onComplete", function() {
    time.restart(space);
    time.pause(space);
    knobs.launch.html('PLAY');
    knobs.launch.data('type', 'PAUSE');
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
  let slider = jQuery(ids.slider);
  let neuronsAmount = jQuery(ids.neuronsAmount);
  let synapcesAmount = jQuery(ids.synapcesAmount);
  let pinMaxLength = jQuery(ids.pinMaxLength);
  let blastRadius = jQuery(ids.blastRadius);
  let blastPower = jQuery(ids.blastPower);
  let applyButton = jQuery(ids.applyButton);
  return knobsFrom(launch, slider, neuronsAmount, blastRadius, blastPower, applyButton, synapcesAmount, pinMaxLength);
}

interface CortexConfiguration {
  scale: number;
  neuronsAmount: number;
  synapcesAmount: number;
  pinMaxLength: number;
  blastRadius: number;
  blastPower: number;
}

function cortexConfigurationFrom(
  scale: number,
  neuronsAmount: number,
  synapcesAmount: number,
  pinMaxLength: number,
  blastRadius: number,
  blastPower: number): CortexConfiguration {

  return {
    scale: scale,
    neuronsAmount: neuronsAmount,
    synapcesAmount: synapcesAmount,
    pinMaxLength: pinMaxLength,
    blastRadius: blastRadius,
    blastPower: blastPower
  }
}
