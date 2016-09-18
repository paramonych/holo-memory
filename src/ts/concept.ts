
document.addEventListener('DOMContentLoaded', plantConcept, false);

var lifetime = 7;

var cortexState;
var knobs;
var uiCallback;
var blockerOverlay;
var box: BABYLON.Mesh;
var camera: BABYLON.ArcRotateCamera;
var light: BABYLON.PointLight;

function plantConcept(): void {
  knobs = getUIControls();
  cortexState = cortexConfigurationFrom(
    knobs, SCALE_UPPER_LIMIT,
    15, 0.5, 0.5, 2,
    Resolution.High, 0, SCALE_THRESHOLD,
    1, 2, 12);

  uiCallback = (blastsAmount: number, synapcesAmountInBox?: number, restoreLaunch?: boolean): void => {
    if(blastsAmount != null && blastsAmount === 0) {
      knobs.launch.attr('disabled', 'disabled');
    } else {
      knobs.launch.removeAttr('disabled');
    }
    if(synapcesAmountInBox) {
      let actualDensity = (10*synapcesAmountInBox/Math.pow(cortexState.scale,3)).toFixed(1);
      knobs.measure.find('.actual-density span').html(actualDensity);
    }
    if(restoreLaunch) {
      let next = knobs.launch.data('type');
      let html = knobs.launch.html();
      knobs.launch.data('type', html);
      knobs.launch.html(next);
    }
  };

  if (!BABYLON.Engine.isSupported()) {return;}
  let canvas = <HTMLCanvasElement>jQuery(ids.canvas)[0];
  let engine = new BABYLON.Engine(canvas, true);
  let scene = getScene(engine);

  blockerOverlay = jQuery(ids.sceneBlocker);

  jQuery(ids.sceneScale).find('input').val(''+cortexState.scale);
  jQuery(ids.wavePower).find('input').val(''+cortexState.wavePower);
  jQuery(ids.pinMaxLength).find('input').val(''+cortexState.pinMaxLength);
  jQuery(ids.blastRadius).find('input').val(''+cortexState.blastRadius);
  jQuery(ids.blastPower).find('input').val(''+cortexState.blastPower);
  jQuery(ids.distressDistance).find('input').val(''+cortexState.distressDistance);
  jQuery(ids.transportDistance).find('input').val(''+cortexState.transportDistance);
  jQuery(ids.patternLimit).find('input').val(''+cortexState.patternLimit).attr('max', ''+cortexState.wavePower);
  jQuery(ids.wordLength).find('input').val(''+cortexState.wordLength);
  jQuery(ids.vocabLength).find('input').val(''+cortexState.vocabLength);

  camera = attachCamera(canvas, scene, cortexState.scale);

  jQuery(document).off('wheel,mousewheel').on('wheel,mousewheel', function() {
    console.log(camera.radius);
  });
  light = setLight(scene);
  box = createPatternSpaceBox(scene, cortexState.scale);
  engine.runRenderLoop(() => {
    scene.render();
  });
  wireUI(engine, scene, cortexState.scale, canvas);
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

  cortexState = cortexConfigurationFrom(
    knobs,
    +knobs.scale.val(),
    +knobs.wavePower.val(),
    +knobs.pinMaxLength.val(),
    +knobs.blastRadius.val(),
    +knobs.blastPower.val(),
    outOfKnobsResolution(knobs.resolution),
    +knobs.distressDistance.val(),
    +knobs.transportDistance.val(),
    +knobs.patternLimit.val(),
    +knobs.wordLength.val(),
    +knobs.vocabLength.val()
  );

  outOfResolution(
    cortexState.resolution,
    {
        Low: () => {
          knobs.pinMaxLength.removeAttr('disabled');
          knobs.blastRadius.removeAttr('disabled');
          knobs.blastPower.removeAttr('disabled');
          knobs.measure.find('.actual-density').show();
          knobs.setSignalButton.removeClass('shifted');
          jQuery('.low-w').show();
          jQuery('.high-w').hide();
        },
        High: () => {
          knobs.pinMaxLength.attr('disabled', 'disabled');
          knobs.blastRadius.attr('disabled', 'disabled');
          knobs.blastPower.attr('disabled', 'disabled');
          knobs.processWaveButton.attr('disabled', 'disabled');
          knobs.launch.attr('disabled', 'disabled');
          knobs.measure.find('.actual-density').hide();
          doScale(cortexState, knobs);
          knobs.setSignalButton.addClass('shifted');
          knobs.measure.find('.measure-value span').html(cortexState.scale);
          jQuery('.low-w').hide();
          jQuery('.high-w').show();
        }
    }
  );

  let space = new Space(scene, scale, lifetime, cortexState, uiCallback);
  let time = new Time(lifetime);

  let refillConfiguration = (): void => {
    let newPinLength = +knobs.pinMaxLength.val();
    if(newPinLength !== cortexState.pinMaxLength) {
      cortexState.pinMaxLength = +knobs.pinMaxLength.val();
      space.cortex.resetSynapces();
    }

    cortexState.blastRadius = +knobs.blastRadius.val();
    cortexState.blastPower = +knobs.blastPower.val();
  }

  knobs.launch.off('click').on('click', function() {
    let next = knobs.launch.data('type');
    let html = knobs.launch.html();
    knobs.launch.data('type', html);
    knobs.launch.html(next);

    if(!next) {
      knobs.launch.html('PAUSE');
      outOfResolution(
        cortexState.resolution,
        {
            Low: () => time.flow(),
            High: () => {
              space.blow();
            }
        }
      );
    } else if(next === 'PAUSE') {
      outOfResolution(
        cortexState.resolution,
        {
            Low: () => time.resume(space),
            High: () => {
              space.wave();
            }
        }
      );
    } else if(next === 'PLAY') {
      knobs.launch.html(next);

      outOfResolution(
        cortexState.resolution,
        {
            Low: () => time.pause(space),
            High: () => space.wait()
        }
      );
    }
  });

  knobs.setDendritsButton.off('click').on('click', function() {
    cortexState.scale = +knobs.scale.val();
    let resolution = (cortexState.scale < SCALE_THRESHOLD) ? Resolution.Low : Resolution.High;

    knobs.launch.data('type', '');

    if(cortexState.resolution !== resolution) {
      cortexState.resolution = switchResolution(knobs.resolution);
    }

    rebuildConcept();
  });

  knobs.wavePower.off('blur').on('blur', function() {
    let activeDendrits = +knobs.wavePower.val();
    let patternLimit = +knobs.patternLimit.val();

    if(patternLimit > activeDendrits) {
      knobs.patternLimit.val(activeDendrits).attr('max', activeDendrits);
    }
  });

  knobs.setSignalButton.off('click').on('click', function() {
    let activeDendrits = +knobs.wavePower.val();
    let distressDistance = +knobs.distressDistance.val();
    let transportDistance = +knobs.transportDistance.val();
    let patternLimit = +knobs.patternLimit.val();
    let wordLength = +knobs.wordLength.val();
    let vocabLength = +knobs.vocabLength.val();

    cortexState.wavePower = activeDendrits;
    cortexState.distressDistance = distressDistance;
    cortexState.transportDistance = transportDistance;
    cortexState.patternLimit = patternLimit;
    cortexState.wordLength = wordLength;
    cortexState.vocabLength = vocabLength;

    refillConfiguration();

    outOfResolution(
      cortexState.resolution,
      {
          Low: () => {knobs.processWaveButton.removeAttr('disabled');},
          High: () => {
            knobs.launch.removeAttr('disabled');
            knobs.launch.data('type', '');
            knobs.launch.html('PLAY');
        }
      }
    );

    space.cortex.initSignal(
      cortexState.wavePower, cortexState.distressDistance,
      cortexState.transportDistance, cortexState.patternLimit,
      cortexState.wordLength, cortexState.vocabLength
    );
  });

  knobs.processWaveButton.off('click').on('click',function() {
    refillConfiguration();

    space.cortex.dropSpikes();
    space.cortex.disposeBlasts();
    space.cortex.computeBlasts();
  });

  knobs.resolution.off('click').on('click', function(e) {
    if(isSameResolution(knobs.resolution, $(e.target))) {return;}
    cortexState.resolution = switchResolution(knobs.resolution);

    if(isLowResolution(cortexState.resolution)) {
       knobs.scale.val(SCALE_LOWER_LIMIT); //mkm
       space.wait();
    } else {
      knobs.scale.val(SCALE_THRESHOLD); // mkm
    }

    cortexState.scale = +knobs.scale.val();

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

  /*time.tense.eventCallback("onUpdate", function() {
    let pg = time.tense.progress();
    let progress = pg * 100;

    if(progress) {
      //knobs.slider.slider("value", progress);
    }
  });*/

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

    doScale(cortexState, knobs);
    knobs.measure.find('.measure-value span').html(cortexState.scale);

    space.dispose();
    time.dispose();
    scene.dispose();
    box.dispose();
    //light.dispose();
    camera.dispose();

    let newScene = getScene(engine);
    engine.stopRenderLoop();
    setLight(newScene);
    box = createPatternSpaceBox(newScene, cortexState.scale);
    camera = attachCamera(canvas, newScene, cortexState.scale);

    engine.runRenderLoop(() => {
      newScene.render();
    });
    wireUI(engine, newScene, cortexState.scale, canvas);
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
  distressDistance: number;
  transportDistance: number;
  patternLimit: number;
  wordLength: number;
  vocabLength: number;
}

function cortexConfigurationFrom(
  knobs: Knobs,
  scale: number,
  wavePower: number,
  realSynapcesDistance: number,
  blastRadius: number,
  blastPower: number,
  resolution: Resolution,
  distressDistance: number,
  transportDistance: number,
  patternLimit: number,
  wordLength: number,
  vocabLength: number
): CortexConfiguration {

  let configuration = {
    scale: scale,
    dendritsAmount: 0,
    synapcesAmount: 0,
    wavePower: wavePower,
    pinMaxLength: realSynapcesDistance,
    blastRadius: blastRadius,
    blastPower: blastPower,
    realSynapcesDistance: realSynapcesDistance,
    resolution: resolution,
    distressDistance: distressDistance,
    transportDistance: transportDistance,
    patternLimit: patternLimit,
    wordLength: wordLength,
    vocabLength: vocabLength
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
