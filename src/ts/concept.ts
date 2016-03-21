
document.addEventListener('DOMContentLoaded', plantConcept, false);

var lifetime = 7;
var scale = 5;// mkm
var realSynapcesDistance = 0.2; //mkm
var cortexSate = cortexConfigurationFrom(scale, 5, 10, scale/realSynapcesDistance, 0.5, 0.2, 3);
var knobs ;
var uiCallback;
var blockerOverlay;

function plantConcept(): void {
  knobs = getUIControls();
  uiCallback = (blastsAmount: number): void => {
    if(blastsAmount === 0) {
      knobs.launch.attr('disabled', 'disabled');
    } else {
      knobs.launch.removeAttr('disabled');
    }
  };

  if (!BABYLON.Engine.isSupported()) {return;}
  let canvas = <HTMLCanvasElement>jQuery(ids.canvas)[0];
  let engine = new BABYLON.Engine(canvas, true);
  let scene = getScene(engine);

  blockerOverlay = jQuery(ids.sceneBlocker);

  jQuery(ids.dendritsAmount).find('input').val(''+cortexSate.dendritsAmount);
  jQuery(ids.wavePower).find('input').val(''+cortexSate.wavePower);
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
  wireUI(engine, scene, cortexSate.scale, canvas);
}

function getScene(engine: BABYLON.Engine): BABYLON.Scene {
  let scene = new BABYLON.Scene(engine);
  //scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
  //scene.fogDensity = 0.5;
  //scene.fogStart = 20.0;
  //scene.fogEnd = 60.0;
  //scene.fogColor = new BABYLON.Color3(0.1, 0.9, 0.15);
  scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
  scene.fogDensity = 0.01;
  scene.clearColor = new BABYLON.Color3(0.1, 0.1, 0.13);
  return scene;
}

function showBlocker(): void {
  blockerOverlay.removeClass('hidden');
}

function wireUI(engine: BABYLON.Engine, scene: BABYLON.Scene, scale: number, canvas: HTMLCanvasElement): void {
  setTimeout(() => {blockerOverlay.addClass('hidden');}, 1300);

  cortexSate = cortexConfigurationFrom(
    scale,
    +knobs.dendritsAmount.val(),
    +knobs.wavePower.val(),
    +knobs.synapcesAmount.val(),
    +knobs.pinMaxLength.val(),
    +knobs.blastRadius.val(),
    +knobs.blastPower.val()
  );

  let space = new Space(scene, scale, lifetime, cortexSate, uiCallback);
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

  knobs.setDendritsButton.off('click').on('click',function() {
    showBlocker();

    cortexSate.dendritsAmount = +knobs.dendritsAmount.val();
    space.dispose();
    time.dispose();
    scene.dispose();

    let newScene = getScene(engine);
    engine.stopRenderLoop();
    setLight(newScene);
    createPatternSpaceBox(newScene, scale);
    engine.runRenderLoop(() => {
      attachCamera(canvas, newScene, scale);
      newScene.render();
    });
    wireUI(engine, newScene, scale, canvas);
  });

  knobs.setSignalButton.off('click').on('click',function() {
    cortexSate.wavePower = +knobs.wavePower.val();
  });

  knobs.processWaveButton.off('click').on('click',function() {
    cortexSate.blastRadius = +knobs.blastRadius.val();
    cortexSate.blastPower = +knobs.blastPower.val();

    space.disposeBlasts();
    time.dispose();
    space.computeBlasts();
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
  let dendritsAmount = jQuery(ids.dendritsAmount);
  let wavePower = jQuery(ids.wavePower);
  let synapcesAmount = jQuery(ids.synapcesAmount);
  let pinMaxLength = jQuery(ids.pinMaxLength);
  let blastRadius = jQuery(ids.blastRadius);
  let blastPower = jQuery(ids.blastPower);

  let setDendritsButton = jQuery(ids.setDendritsButton);
  let setSignalButton = jQuery(ids.setSignalButton);
  let processWaveButton = jQuery(ids.processWaveButton);

  return knobsFrom(
    launch, slider, dendritsAmount,
    wavePower, blastRadius, blastPower,
    synapcesAmount, pinMaxLength ,
    setDendritsButton, setSignalButton, processWaveButton
  );
}

interface CortexConfiguration {
  scale: number;
  dendritsAmount: number;
  wavePower: number;
  synapcesAmount: number;
  pinMaxLength: number;
  blastRadius: number;
  blastPower: number;
}

function cortexConfigurationFrom(
  scale: number,
  dendritsAmount: number,
  wavePower: number,
  synapcesAmount: number,
  pinMaxLength: number,
  blastRadius: number,
  blastPower: number): CortexConfiguration {

  return {
    scale: scale,
    dendritsAmount: dendritsAmount,
    wavePower: wavePower,
    synapcesAmount: synapcesAmount,
    pinMaxLength: pinMaxLength,
    blastRadius: blastRadius,
    blastPower: blastPower
  }
}
