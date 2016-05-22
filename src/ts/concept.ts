
document.addEventListener('DOMContentLoaded', plantConcept, false);

var lifetime = 7;

var cortexSate;
var knobs;
var uiCallback;
var blockerOverlay;
var box: BABYLON.Mesh;
var camera: BABYLON.ArcRotateCamera;
var light: BABYLON.PointLight;

function plantConcept(): void {
  knobs = getUIControls();
  cortexSate = cortexConfigurationFrom(knobs, 5, 3, 0.5, 0.5, 2);

  uiCallback = (blastsAmount: number, synapcesAmountInBox?: number): void => {
    if(blastsAmount != null && blastsAmount === 0) {
      knobs.launch.attr('disabled', 'disabled');
    } else {
      knobs.launch.removeAttr('disabled');
    }
    if(synapcesAmountInBox) {
      let actualDensity = (10*synapcesAmountInBox/Math.pow(cortexSate.scale,3)).toFixed(1);
      knobs.measure.find('.actual-density span').html(actualDensity);
    }
  };

  if (!BABYLON.Engine.isSupported()) {return;}
  let canvas = <HTMLCanvasElement>jQuery(ids.canvas)[0];
  let engine = new BABYLON.Engine(canvas, true);
  let scene = getScene(engine);

  blockerOverlay = jQuery(ids.sceneBlocker);

  jQuery(ids.sceneScale).find('input').val(''+cortexSate.scale);
  jQuery(ids.wavePower).find('input').val(''+cortexSate.wavePower);
  jQuery(ids.pinMaxLength).find('input').val(''+cortexSate.pinMaxLength);
  jQuery(ids.blastRadius).find('input').val(''+cortexSate.blastRadius);
  jQuery(ids.blastPower).find('input').val(''+cortexSate.blastPower);

  camera = attachCamera(canvas, scene, cortexSate.scale);
  light = setLight(scene);
  box = createPatternSpaceBox(scene, cortexSate.scale);
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
  //scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
  //scene.fogDensity = 0.01;
  scene.clearColor = new BABYLON.Color3(0.1, 0.1, 0.13);
  return scene;
}

function showBlocker(): void {
  blockerOverlay.removeClass('hidden');
}

function wireUI(engine: BABYLON.Engine, scene: BABYLON.Scene, scale: number, canvas: HTMLCanvasElement): void {
  setTimeout(() => {blockerOverlay.addClass('hidden');}, 1300);

  cortexSate = cortexConfigurationFrom(
    knobs,
    +knobs.scale.val(),
    +knobs.wavePower.val(),
    +knobs.pinMaxLength.val(),
    +knobs.blastRadius.val(),
    +knobs.blastPower.val(),
    outOfKnobsResolution(knobs.resolution)
  );

  let space = new Space(scene, scale, lifetime, cortexSate, uiCallback);
  let time = new Time(lifetime);

  let refillConfiguration = (): void => {
    let newPinLength = +knobs.pinMaxLength.val();
    if(newPinLength !== cortexSate.pinMaxLength) {
      cortexSate.pinMaxLength = +knobs.pinMaxLength.val();
      space.cortex.resetSynapces();
    }

    cortexSate.blastRadius = +knobs.blastRadius.val();
    cortexSate.blastPower = +knobs.blastPower.val();
  }

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

  knobs.setDendritsButton.off('click').on('click', rebuildConcept);

  knobs.setSignalButton.off('click').on('click', function() {
    let newValue = +knobs.wavePower.val();
    cortexSate.wavePower = newValue;

    refillConfiguration();

    space.cortex.initSignal(cortexSate.wavePower);
    knobs.processWaveButton.removeAttr('disabled');
  });

  knobs.processWaveButton.off('click').on('click',function() {
    refillConfiguration();

    space.cortex.dropSpikes();
    space.cortex.disposeBlasts();
    space.cortex.computeBlasts();
  });

  knobs.resolution.off('click').on('click', function(e) {
    if(isSameResolution(knobs.resolution, $(e.target))) {return;}
    cortexSate.resolution = switchResolution(knobs.resolution);
    rebuildConcept();
  });

  knobs.keepSelected.off('change').on('change',function() {
    space.cortex.keepSelected(knobs.keepSelected.prop('checked'));
  });

  knobs.measure.off('mouseenter').on('mouseenter', function() {
    (<BABYLON.StandardMaterial>box.material).emissiveColor = new BABYLON.Color3(1, 1, 0);
  });
  knobs.measure.off('mouseleave').on('mouseleave', function() {
    (<BABYLON.StandardMaterial>box.material).emissiveColor = new BABYLON.Color3(0, 0, 0);
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

  function rebuildConcept() {
    showBlocker();
    knobs.processWaveButton.attr('disabled','disabled');

    knobs.keepSelected.prop('checked', false);

    cortexSate.scale = +knobs.scale.val();
    doScale(cortexSate, knobs);
    knobs.measure.find('.measure-value span').html(cortexSate.scale);

    space.dispose();
    time.dispose();
    scene.dispose();
    box.dispose();
    //light.dispose();
    camera.dispose();

    let newScene = getScene(engine);
    engine.stopRenderLoop();
    setLight(newScene);
    box = createPatternSpaceBox(newScene, cortexSate.scale);
    camera = attachCamera(canvas, newScene, cortexSate.scale);

    engine.runRenderLoop(() => {
      newScene.render();
    });
    wireUI(engine, newScene, cortexSate.scale, canvas);
  }
}

interface CortexConfiguration {
  scale: number;
  dendritsAmount: number;
  synapcesAmount: number;
  wavePower: number;
  pinMaxLength: number;
  blastRadius: number;
  blastPower: number;
  realSynapcesDistance: number;
  resolution: Resolution;
}

function cortexConfigurationFrom(
  knobs: Knobs,
  scale: number,
  wavePower: number,
  realSynapcesDistance: number,
  blastRadius: number,
  blastPower: number,
  resolution: Resolution): CortexConfiguration {

  let configuration = {
    scale: scale,
    dendritsAmount: 0,
    synapcesAmount: 0,
    wavePower: wavePower,
    pinMaxLength: realSynapcesDistance,
    blastRadius: blastRadius,
    blastPower: blastPower,
    realSynapcesDistance: realSynapcesDistance,
    resolution: resolution
  };

  doScale(configuration, knobs);

  return configuration;
}

function doScale(configuration: CortexConfiguration, knobs: Knobs): void {

  let cubicMkmInCubicMm = 1000000000;
  //let averageDendritsDensity = 400000; // per cubic millimeter
  let averageSynapcesDensity = 700000000; // per cubic millimeter

  let scaleFactorToCubicMillimeter = Math.pow(configuration.scale, 3)/cubicMkmInCubicMm;

  let synapcesPerDendritInActualScale = Math.round(configuration.scale/configuration.realSynapcesDistance);
  let synapcesTotalInActualScale = Math.ceil(averageSynapcesDensity * scaleFactorToCubicMillimeter);

  configuration.dendritsAmount = Math.ceil(synapcesTotalInActualScale/synapcesPerDendritInActualScale);
  configuration.synapcesAmount = Math.round(synapcesTotalInActualScale / configuration.dendritsAmount);

  //configuration.synapcesAmount = Math.ceil(averageSynapcesDensity * scaleFactorToCubicMillimeter);
  //configuration.dendritsAmount = Math.ceil(averageDendritsDensity * scaleFactorToCubicMillimeter);

  knobs.actualDendritsAmount.html(''+configuration.dendritsAmount);
  knobs.actualSynapcesAmount.html(''+synapcesTotalInActualScale);
}
