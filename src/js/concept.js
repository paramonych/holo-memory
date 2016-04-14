document.addEventListener('DOMContentLoaded', plantConcept, false);
var lifetime = 7;
var cortexSate;
var knobs;
var uiCallback;
var blockerOverlay;
var box;
var camera;
var light;
function plantConcept() {
    knobs = getUIControls();
    cortexSate = cortexConfigurationFrom(knobs, 5, 3, 0.5, 0.5, 2);
    uiCallback = function (blastsAmount, synapcesAmountInBox) {
        if (blastsAmount != null && blastsAmount === 0) {
            knobs.launch.attr('disabled', 'disabled');
        }
        else {
            knobs.launch.removeAttr('disabled');
        }
        if (synapcesAmountInBox) {
            var actualDensity = (10 * synapcesAmountInBox / Math.pow(cortexSate.scale, 3)).toFixed(1);
            knobs.measure.find('.actual-density span').html(actualDensity);
        }
    };
    if (!BABYLON.Engine.isSupported()) {
        return;
    }
    var canvas = jQuery(ids.canvas)[0];
    var engine = new BABYLON.Engine(canvas, true);
    var scene = getScene(engine);
    blockerOverlay = jQuery(ids.sceneBlocker);
    jQuery(ids.sceneScale).find('input').val('' + cortexSate.scale);
    jQuery(ids.wavePower).find('input').val('' + cortexSate.wavePower);
    jQuery(ids.pinMaxLength).find('input').val('' + cortexSate.pinMaxLength);
    jQuery(ids.blastRadius).find('input').val('' + cortexSate.blastRadius);
    jQuery(ids.blastPower).find('input').val('' + cortexSate.blastPower);
    camera = attachCamera(canvas, scene, cortexSate.scale);
    light = setLight(scene);
    box = createPatternSpaceBox(scene, cortexSate.scale);
    engine.runRenderLoop(function () {
        scene.render();
    });
    wireUI(engine, scene, cortexSate.scale, canvas);
}
function getScene(engine) {
    var scene = new BABYLON.Scene(engine);
    scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
    scene.fogDensity = 0.01;
    scene.clearColor = new BABYLON.Color3(0.1, 0.1, 0.13);
    return scene;
}
function showBlocker() {
    blockerOverlay.removeClass('hidden');
}
function wireUI(engine, scene, scale, canvas) {
    setTimeout(function () { blockerOverlay.addClass('hidden'); }, 1300);
    cortexSate = cortexConfigurationFrom(knobs, +knobs.scale.val(), +knobs.wavePower.val(), +knobs.pinMaxLength.val(), +knobs.blastRadius.val(), +knobs.blastPower.val());
    var space = new Space(scene, scale, lifetime, cortexSate, uiCallback);
    var time = new Time(lifetime);
    var refillConfiguration = function () {
        var newPinLength = +knobs.pinMaxLength.val();
        if (newPinLength !== cortexSate.pinMaxLength) {
            cortexSate.pinMaxLength = +knobs.pinMaxLength.val();
            space.cortex.resetSynapces();
        }
        cortexSate.blastRadius = +knobs.blastRadius.val();
        cortexSate.blastPower = +knobs.blastPower.val();
    };
    knobs.launch.off('click').on('click', function () {
        var next = knobs.launch.data('type');
        var html = knobs.launch.html();
        knobs.launch.data('type', html);
        knobs.launch.html(next);
        if (next === void 0) {
            knobs.launch.html('PAUSE');
            time.flow();
        }
        else if (next === 'PAUSE') {
            time.resume(space);
        }
        else if (next === 'PLAY') {
            knobs.launch.html(next);
            time.pause(space);
        }
    });
    knobs.setDendritsButton.off('click').on('click', function () {
        showBlocker();
        knobs.processWaveButton.attr('disabled', 'disabled');
        knobs.keepSelected.prop('checked', false);
        cortexSate.scale = +knobs.scale.val();
        doScale(cortexSate, knobs);
        knobs.measure.find('.measure-value span').html(cortexSate.scale);
        space.dispose();
        time.dispose();
        scene.dispose();
        box.dispose();
        camera.dispose();
        var newScene = getScene(engine);
        engine.stopRenderLoop();
        setLight(newScene);
        box = createPatternSpaceBox(newScene, cortexSate.scale);
        camera = attachCamera(canvas, newScene, cortexSate.scale);
        engine.runRenderLoop(function () {
            newScene.render();
        });
        wireUI(engine, newScene, cortexSate.scale, canvas);
    });
    knobs.setSignalButton.off('click').on('click', function () {
        var newValue = +knobs.wavePower.val();
        cortexSate.wavePower = newValue;
        refillConfiguration();
        space.cortex.initSignal(cortexSate.wavePower);
        knobs.processWaveButton.removeAttr('disabled');
    });
    knobs.processWaveButton.off('click').on('click', function () {
        refillConfiguration();
        space.cortex.dropSpikes();
        space.cortex.disposeBlasts();
        space.cortex.computeBlasts();
    });
    knobs.keepSelected.off('change').on('change', function () {
        space.cortex.keepSelected(knobs.keepSelected.prop('checked'));
    });
    knobs.measure.off('mouseenter').on('mouseenter', function () {
        box.material.emissiveColor = new BABYLON.Color3(1, 1, 0);
    });
    knobs.measure.off('mouseleave').on('mouseleave', function () {
        box.material.emissiveColor = new BABYLON.Color3(0, 0, 0);
    });
    time.tense.eventCallback("onUpdate", function () {
        var pg = time.tense.progress();
        var progress = pg * 100;
        if (progress) {
        }
    });
    time.tense.eventCallback("onComplete", function () {
        time.restart(space);
        time.pause(space);
        knobs.launch.html('PLAY');
        knobs.launch.data('type', 'PAUSE');
    });
    space.expose(time);
}
function cortexConfigurationFrom(knobs, scale, wavePower, realSynapcesDistance, blastRadius, blastPower) {
    var configuration = {
        scale: scale,
        dendritsAmount: 0,
        synapcesAmount: 0,
        wavePower: wavePower,
        pinMaxLength: realSynapcesDistance,
        blastRadius: blastRadius,
        blastPower: blastPower,
        realSynapcesDistance: realSynapcesDistance
    };
    doScale(configuration, knobs);
    return configuration;
}
function doScale(configuration, knobs) {
    var cubicMkmInCubicMm = 1000000000;
    var averageSynapcesDensity = 700000000;
    var scaleFactorToCubicMillimeter = Math.pow(configuration.scale, 3) / cubicMkmInCubicMm;
    var synapcesPerDendritInActualScale = Math.round(configuration.scale / configuration.realSynapcesDistance);
    var synapcesTotalInActualScale = Math.ceil(averageSynapcesDensity * scaleFactorToCubicMillimeter);
    configuration.dendritsAmount = Math.ceil(synapcesTotalInActualScale / synapcesPerDendritInActualScale);
    configuration.synapcesAmount = Math.round(synapcesTotalInActualScale / configuration.dendritsAmount);
    knobs.actualDendritsAmount.html('' + configuration.dendritsAmount);
    knobs.actualSynapcesAmount.html('' + synapcesTotalInActualScale);
}
