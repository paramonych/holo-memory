document.addEventListener('DOMContentLoaded', plantConcept, false);
var lifetime = 8;
function plantConcept() {
    if (!BABYLON.Engine.isSupported()) {
        return;
    }
    var canvas = jQuery(ids.canvas)[0];
    var engine = new BABYLON.Engine(canvas, true);
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0.1, 0.1, 0.13);
    var scale = 10;
    var neuronsAmount = 2;
    var blastRadius = 3;
    var blastPower = 4;
    jQuery(ids.neuronsAmount).find('input').val('' + neuronsAmount);
    jQuery(ids.blastRadius).find('input').val('' + blastRadius);
    jQuery(ids.blastPower).find('input').val('' + blastPower);
    attachCamera(canvas, scene, scale);
    setLight(scene);
    createPatternSpaceBox(scene, scale);
    engine.runRenderLoop(function () {
        scene.render();
    });
    wireUI(new Space(scene, scale, lifetime, neuronsAmount, blastRadius, blastPower), new Time(lifetime));
}
function wireUI(space, time) {
    var knobs = getUIControls();
    knobs.launch.on('click', function () {
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
    knobs.applyButton.on('click', function () {
        var neuronsAmount = +knobs.neuronsAmount.val();
        var blastRadius = +knobs.blastRadius.val();
        var blastPower = +knobs.blastPower.val();
        space.applyConfig(neuronsAmount, blastRadius, blastPower);
    });
    time.tense.eventCallback("onUpdate", function () {
        var pg = time.tense.progress();
        var progress = pg * 100;
        if (progress) {
        }
    });
    space.expose(time);
}
function getUIControls() {
    var launch = jQuery(ids.launch);
    var restart = jQuery(ids.restart);
    var slider = jQuery(ids.slider);
    var neuronsAmount = jQuery(ids.neuronsAmount);
    var blastRadius = jQuery(ids.blastRadius);
    var blastPower = jQuery(ids.blastPower);
    var applyButton = jQuery(ids.applyButton);
    return knobsFrom(launch, void 0, void 0, restart, slider, neuronsAmount, blastRadius, blastPower, applyButton);
}
