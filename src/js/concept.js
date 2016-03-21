document.addEventListener('DOMContentLoaded', plantConcept, false);
var lifetime = 7;
var scale = 5;
var realSynapcesDistance = 0.2;
var cortexSate = cortexConfigurationFrom(scale, 5, 10, scale / realSynapcesDistance, 0.5, 0.2, 3);
var knobs;
var uiCallback;
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
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0.1, 0.1, 0.13);
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
    wireUI(scene, cortexSate.scale, canvas);
}
function wireUI(scene, scale, canvas) {
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
        cortexSate.dendritsAmount = +knobs.dendritsAmount.val();
        space.dispose();
        time.dispose();
        scene.dispose();
        attachCamera(canvas, scene, scale);
        setLight(scene);
        createPatternSpaceBox(scene, scale);
        scene.render();
        wireUI(scene, scale, canvas);
    });
    knobs.setSignalButton.off('click').on('click', function () {
        cortexSate.wavePower = +knobs.wavePower.val();
    });
    knobs.processWaveButton.off('click').on('click', function () {
        cortexSate.blastRadius = +knobs.blastRadius.val();
        cortexSate.blastPower = +knobs.blastPower.val();
        space.disposeBlasts();
        time.dispose();
        space.computeBlasts();
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
function getUIControls() {
    var launch = jQuery(ids.launch);
    var slider = jQuery(ids.slider);
    var dendritsAmount = jQuery(ids.dendritsAmount);
    var wavePower = jQuery(ids.wavePower);
    var synapcesAmount = jQuery(ids.synapcesAmount);
    var pinMaxLength = jQuery(ids.pinMaxLength);
    var blastRadius = jQuery(ids.blastRadius);
    var blastPower = jQuery(ids.blastPower);
    var setDendritsButton = jQuery(ids.setDendritsButton);
    var setSignalButton = jQuery(ids.setSignalButton);
    var processWaveButton = jQuery(ids.processWaveButton);
    return knobsFrom(launch, slider, dendritsAmount, wavePower, blastRadius, blastPower, synapcesAmount, pinMaxLength, setDendritsButton, setSignalButton, processWaveButton);
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
