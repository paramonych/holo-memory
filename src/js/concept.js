document.addEventListener('DOMContentLoaded', plantConcept, false);
var lifetime = 7;
function plantConcept() {
    if (!BABYLON.Engine.isSupported()) {
        return;
    }
    var canvas = jQuery(ids.canvas)[0];
    var engine = new BABYLON.Engine(canvas, true);
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0.1, 0.1, 0.13);
    var scale = 10;
    var neuronsAmount = 20;
    var blastRadius = 3;
    var blastPower = 3;
    jQuery(ids.neuronsAmount).find('input').val('' + neuronsAmount);
    jQuery(ids.blastRadius).find('input').val('' + blastRadius);
    jQuery(ids.blastPower).find('input').val('' + blastPower);
    attachCamera(canvas, scene, scale);
    setLight(scene);
    createPatternSpaceBox(scene, scale);
    engine.runRenderLoop(function () {
        scene.render();
    });
    wireUI(scene, scale, canvas);
}
function wireUI(scene, scale, canvas) {
    var knobs = getUIControls();
    var neuronsAmount = +knobs.neuronsAmount.val();
    var blastRadius = +knobs.blastRadius.val();
    var blastPower = +knobs.blastPower.val();
    var uiCallback = function (blastsAmount) {
        if (blastsAmount === 0) {
            knobs.launch.attr('disabled', 'disabled');
        }
        else {
            knobs.launch.removeAttr('disabled');
        }
    };
    var space = new Space(scene, scale, lifetime, neuronsAmount, blastRadius, blastPower, uiCallback);
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
    knobs.applyButton.off('click').on('click', function () {
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
    var neuronsAmount = jQuery(ids.neuronsAmount);
    var blastRadius = jQuery(ids.blastRadius);
    var blastPower = jQuery(ids.blastPower);
    var applyButton = jQuery(ids.applyButton);
    return knobsFrom(launch, slider, neuronsAmount, blastRadius, blastPower, applyButton);
}
