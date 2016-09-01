document.addEventListener('DOMContentLoaded', plantConcept, false);
var lifetime = 7;
var cortexState;
var knobs;
var uiCallback;
var blockerOverlay;
var box;
var camera;
var light;
function plantConcept() {
    knobs = getUIControls();
    cortexState = cortexConfigurationFrom(knobs, SCALE_UPPER_LIMIT, 3, 0.5, 0.5, 2, Resolution.High, SCALE_LOWER_LIMIT, SCALE_THRESHOLD);
    uiCallback = function (blastsAmount, synapcesAmountInBox, restoreLaunch) {
        if (blastsAmount != null && blastsAmount === 0) {
            knobs.launch.attr('disabled', 'disabled');
        }
        else {
            knobs.launch.removeAttr('disabled');
        }
        if (synapcesAmountInBox) {
            var actualDensity = (10 * synapcesAmountInBox / Math.pow(cortexState.scale, 3)).toFixed(1);
            knobs.measure.find('.actual-density span').html(actualDensity);
        }
        if (restoreLaunch) {
            var next = knobs.launch.data('type');
            var html = knobs.launch.html();
            knobs.launch.data('type', html);
            knobs.launch.html(next);
        }
    };
    if (!BABYLON.Engine.isSupported()) {
        return;
    }
    var canvas = jQuery(ids.canvas)[0];
    var engine = new BABYLON.Engine(canvas, true);
    var scene = getScene(engine);
    blockerOverlay = jQuery(ids.sceneBlocker);
    jQuery(ids.sceneScale).find('input').val('' + cortexState.scale);
    jQuery(ids.wavePower).find('input').val('' + cortexState.wavePower);
    jQuery(ids.pinMaxLength).find('input').val('' + cortexState.pinMaxLength);
    jQuery(ids.blastRadius).find('input').val('' + cortexState.blastRadius);
    jQuery(ids.blastPower).find('input').val('' + cortexState.blastPower);
    jQuery(ids.distressDistance).find('input').val('' + cortexState.distressDistance);
    jQuery(ids.transportDistance).find('input').val('' + cortexState.transportDistance);
    camera = attachCamera(canvas, scene, cortexState.scale);
    light = setLight(scene);
    box = createPatternSpaceBox(scene, cortexState.scale);
    engine.runRenderLoop(function () {
        scene.render();
    });
    wireUI(engine, scene, cortexState.scale, canvas);
}
function getScene(engine) {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0.1, 0.1, 0.13);
    return scene;
}
function showBlocker() {
    blockerOverlay.removeClass('hidden');
}
function wireUI(engine, scene, scale, canvas) {
    setTimeout(function () { blockerOverlay.addClass('hidden'); }, 1300);
    cortexState = cortexConfigurationFrom(knobs, +knobs.scale.val(), +knobs.wavePower.val(), +knobs.pinMaxLength.val(), +knobs.blastRadius.val(), +knobs.blastPower.val(), outOfKnobsResolution(knobs.resolution), +knobs.distressDistance.val(), +knobs.transportDistance.val());
    outOfResolution(cortexState.resolution, {
        Low: function () {
            knobs.pinMaxLength.removeAttr('disabled');
            knobs.blastRadius.removeAttr('disabled');
            knobs.blastPower.removeAttr('disabled');
            knobs.measure.find('.actual-density').show();
            knobs.setSignalButton.removeClass('shifted');
            jQuery('.low-w').show();
            jQuery('.high-w').hide();
        },
        High: function () {
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
    });
    var space = new Space(scene, scale, lifetime, cortexState, uiCallback);
    var time = new Time(lifetime);
    var refillConfiguration = function () {
        var newPinLength = +knobs.pinMaxLength.val();
        if (newPinLength !== cortexState.pinMaxLength) {
            cortexState.pinMaxLength = +knobs.pinMaxLength.val();
            space.cortex.resetSynapces();
        }
        cortexState.blastRadius = +knobs.blastRadius.val();
        cortexState.blastPower = +knobs.blastPower.val();
    };
    knobs.launch.off('click').on('click', function () {
        var next = knobs.launch.data('type');
        var html = knobs.launch.html();
        knobs.launch.data('type', html);
        knobs.launch.html(next);
        if (!next) {
            knobs.launch.html('PAUSE');
            outOfResolution(cortexState.resolution, {
                Low: function () { return time.flow(); },
                High: function () {
                    space.blow();
                }
            });
        }
        else if (next === 'PAUSE') {
            outOfResolution(cortexState.resolution, {
                Low: function () { return time.resume(space); },
                High: function () {
                    space.wave();
                }
            });
        }
        else if (next === 'PLAY') {
            knobs.launch.html(next);
            outOfResolution(cortexState.resolution, {
                Low: function () { return time.pause(space); },
                High: function () { return space.wait(); }
            });
        }
    });
    knobs.setDendritsButton.off('click').on('click', function () {
        cortexState.scale = +knobs.scale.val();
        var resolution = (cortexState.scale < SCALE_THRESHOLD) ? Resolution.Low : Resolution.High;
        knobs.launch.data('type', '');
        if (cortexState.resolution !== resolution) {
            cortexState.resolution = switchResolution(knobs.resolution);
        }
        rebuildConcept();
    });
    knobs.setSignalButton.off('click').on('click', function () {
        var newValue = +knobs.wavePower.val();
        var distressDistance = +knobs.distressDistance.val();
        var transportDistance = +knobs.transportDistance.val();
        cortexState.wavePower = newValue;
        cortexState.distressDistance = distressDistance;
        cortexState.transportDistance = transportDistance;
        refillConfiguration();
        outOfResolution(cortexState.resolution, {
            Low: function () { knobs.processWaveButton.removeAttr('disabled'); },
            High: function () {
                knobs.launch.removeAttr('disabled');
                knobs.launch.data('type', '');
                knobs.launch.html('PLAY');
            }
        });
        space.cortex.initSignal(cortexState.wavePower, cortexState.distressDistance, cortexState.transportDistance);
    });
    knobs.processWaveButton.off('click').on('click', function () {
        refillConfiguration();
        space.cortex.dropSpikes();
        space.cortex.disposeBlasts();
        space.cortex.computeBlasts();
    });
    knobs.resolution.off('click').on('click', function (e) {
        if (isSameResolution(knobs.resolution, $(e.target))) {
            return;
        }
        cortexState.resolution = switchResolution(knobs.resolution);
        if (isLowResolution(cortexState.resolution)) {
            knobs.scale.val(SCALE_LOWER_LIMIT);
            space.wait();
        }
        else {
            knobs.scale.val(SCALE_THRESHOLD);
        }
        cortexState.scale = +knobs.scale.val();
        rebuildConcept();
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
    time.tense.eventCallback("onComplete", function () {
        time.restart(space);
        time.pause(space);
        knobs.launch.html('PLAY');
        knobs.launch.data('type', 'PAUSE');
    });
    space.expose(time);
    function rebuildConcept() {
        showBlocker();
        knobs.processWaveButton.attr('disabled', 'disabled');
        knobs.keepSelected.prop('checked', false);
        doScale(cortexState, knobs);
        knobs.measure.find('.measure-value span').html(cortexState.scale);
        space.dispose();
        time.dispose();
        scene.dispose();
        box.dispose();
        camera.dispose();
        var newScene = getScene(engine);
        engine.stopRenderLoop();
        setLight(newScene);
        box = createPatternSpaceBox(newScene, cortexState.scale);
        camera = attachCamera(canvas, newScene, cortexState.scale);
        engine.runRenderLoop(function () {
            newScene.render();
        });
        wireUI(engine, newScene, cortexState.scale, canvas);
    }
}
function cortexConfigurationFrom(knobs, scale, wavePower, realSynapcesDistance, blastRadius, blastPower, resolution, distressDistance, transportDistance) {
    var configuration = {
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
        transportDistance: transportDistance
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
