document.addEventListener('DOMContentLoaded', plantConcept, false);
function plantConcept() {
    if (!BABYLON.Engine.isSupported()) {
        return;
    }
    var canvas = jQuery(ids.canvas)[0];
    var engine = new BABYLON.Engine(canvas, true);
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(.3, .3, .3);
    var scale = 10;
    var lifetime = 2;
    attachCamera(canvas, scene, scale);
    setLight(scene);
    createPatternSpaceBox(scene, scale);
    engine.runRenderLoop(function () {
        scene.render();
    });
    wireUI(new Space(scene, scale, lifetime), new Time(lifetime));
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
    knobs.restart.on('click', function () {
        knobs.launch.html('PAUSE');
        knobs.launch.data('type', 'PLAY');
        time.restart(space);
    });
    time.tense.eventCallback("onUpdate", function () {
        var pg = time.tense.progress();
        var progress = pg * 100;
        if (progress) {
            knobs.slider.slider("value", progress);
        }
    });
    knobs.slider.slider({
        range: false,
        min: 0,
        max: 100,
        step: .1,
        slide: function (event, ui) {
            time.shiftTo(space, ui.value / 100);
        }
    });
    space.expose(time);
}
function getUIControls() {
    var launch = jQuery(ids.launch);
    var restart = jQuery(ids.restart);
    var slider = jQuery(ids.slider);
    return knobsFrom(launch, void 0, void 0, restart, slider);
}
