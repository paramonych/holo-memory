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
    attachCamera(canvas, scene, scale);
    setLight(scene);
    createPatternSpaceBox(scene, scale);
    engine.runRenderLoop(function () {
        scene.render();
    });
    wireUI(new Space(scene, scale), new Time());
}
function wireUI(space, time) {
    var knobs = getUIControls();
    knobs.launch.on('click', function () {
        time.flow();
    });
    knobs.play.click(function () { time.flow(); });
    knobs.pause.click(function () { time.stop(); });
    knobs.restart.click(function () { time.loop(); });
    time.tense.eventCallback("onUpdate", function () {
        var pg = time.tense.progress();
        console.debug('pg', pg);
        var progress = pg * 100;
        if (progress) {
            knobs.slider.slider("value", progress);
        }
    });
    knobs.slider.slider({
        range: false,
        min: 0,
        max: 100,
        step: .1
    });
    space.expose(time);
}
function getUIControls() {
    var launch = jQuery(ids.launch);
    var play = jQuery(ids.play);
    var pause = jQuery(ids.pause);
    var restart = jQuery(ids.restart);
    var slider = jQuery(ids.slider);
    return knobsFrom(launch, play, pause, restart, slider);
}
