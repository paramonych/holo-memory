document.addEventListener('DOMContentLoaded', plantConcept, false);
var lifetime = 7;
var scale = 5;
var realSynapcesDistance = 0.2;
var cortexSate = cortexConfigurationFrom(scale, 5, 2, scale / realSynapcesDistance, 0.5, 0.2, 3);
var knobs;
var uiCallback;
var blockerOverlay;
function plantConcept() {
    knobs = getUIControls();
    uiCallback = function (blastsAmount) {
        if (blastsAmount === 0) {
            knobs.launch.attr('disabled', 'disabled');
        }
        else {
            knobs.launch.removeAttr('disabled');
        }
    };
    if (!BABYLON.Engine.isSupported()) {
        return;
    }
    var canvas = jQuery(ids.canvas)[0];
    var engine = new BABYLON.Engine(canvas, true);
    var scene = getScene(engine);
    blockerOverlay = jQuery(ids.sceneBlocker);
    jQuery(ids.dendritsAmount).find('input').val('' + cortexSate.dendritsAmount);
    jQuery(ids.wavePower).find('input').val('' + cortexSate.wavePower);
    jQuery(ids.synapcesAmount).find('input').val('' + cortexSate.synapcesAmount);
    jQuery(ids.pinMaxLength).find('input').val('' + cortexSate.pinMaxLength);
    jQuery(ids.blastRadius).find('input').val('' + cortexSate.blastRadius);
    jQuery(ids.blastPower).find('input').val('' + cortexSate.blastPower);
    attachCamera(canvas, scene, cortexSate.scale);
    setLight(scene);
    createPatternSpaceBox(scene, cortexSate.scale);
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
    cortexSate = cortexConfigurationFrom(scale, +knobs.dendritsAmount.val(), +knobs.wavePower.val(), +knobs.synapcesAmount.val(), +knobs.pinMaxLength.val(), +knobs.blastRadius.val(), +knobs.blastPower.val());
    var space = new Space(scene, scale, lifetime, cortexSate, uiCallback);
    var time = new Time(lifetime);
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
        knobs.keepSelected.prop('checked', false);
        cortexSate.dendritsAmount = +knobs.dendritsAmount.val();
        space.dispose();
        time.dispose();
        scene.dispose();
        var newScene = getScene(engine);
        engine.stopRenderLoop();
        setLight(newScene);
        createPatternSpaceBox(newScene, scale);
        engine.runRenderLoop(function () {
            attachCamera(canvas, newScene, scale);
            newScene.render();
        });
        wireUI(engine, newScene, scale, canvas);
    });
    knobs.setSignalButton.off('click').on('click', function () {
        var newValue = +knobs.wavePower.val();
        cortexSate.wavePower = newValue;
        space.cortex.initSignal(cortexSate.wavePower);
    });
    knobs.processWaveButton.off('click').on('click', function () {
        cortexSate.pinMaxLength = +knobs.pinMaxLength.val();
        cortexSate.blastRadius = +knobs.blastRadius.val();
        cortexSate.blastPower = +knobs.blastPower.val();
        space.cortex.disposeBlasts();
        space.cortex.computeBlasts();
    });
    knobs.keepSelected.off('change').on('change', function () {
        space.cortex.keepSelected(knobs.keepSelected.prop('checked'));
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
function cortexConfigurationFrom(scale, dendritsAmount, wavePower, synapcesAmount, pinMaxLength, blastRadius, blastPower) {
    return {
        scale: scale,
        dendritsAmount: dendritsAmount,
        wavePower: wavePower,
        synapcesAmount: synapcesAmount,
        pinMaxLength: pinMaxLength,
        blastRadius: blastRadius,
        blastPower: blastPower
    };
}
