function knobsFrom(launch, slider, actualDendritsAmount, wavePower, blastRadius, blastPower, actualSynapcesAmount, pinMaxLength, setDendritsButton, setSignalButton, processWaveButton, keepSelected, measure, scale, resolution, minDistance, maxDistance) {
    return {
        launch: launch,
        slider: slider,
        actualDendritsAmount: actualDendritsAmount.find('span'),
        wavePower: wavePower.find('input'),
        blastRadius: blastRadius.find('input'),
        blastPower: blastPower.find('input'),
        actualSynapcesAmount: actualSynapcesAmount.find('span'),
        pinMaxLength: pinMaxLength.find('input'),
        setDendritsButton: setDendritsButton,
        setSignalButton: setSignalButton,
        processWaveButton: processWaveButton,
        keepSelected: keepSelected.find('input'),
        measure: measure,
        scale: scale.find('input'),
        resolution: resolution.find('label'),
        minDistance: minDistance.find('input'),
        maxDistance: maxDistance.find('input')
    };
}
function getUIControls() {
    var launch = jQuery(ids.launch);
    var slider = jQuery(ids.slider);
    var actualDendritsAmount = jQuery(ids.actualDendritsAmount);
    var wavePower = jQuery(ids.wavePower);
    var actualSynapcesAmount = jQuery(ids.actualSynapcesAmount);
    var pinMaxLength = jQuery(ids.pinMaxLength);
    var blastRadius = jQuery(ids.blastRadius);
    var blastPower = jQuery(ids.blastPower);
    var keepSelected = jQuery(ids.keepSelected);
    var measure = jQuery(ids.measure);
    var scale = jQuery(ids.sceneScale);
    var resolution = jQuery(ids.resolution);
    var setDendritsButton = jQuery(ids.setDendritsButton);
    var setSignalButton = jQuery(ids.setSignalButton);
    var processWaveButton = jQuery(ids.processWaveButton);
    var minDistance = jQuery(ids.minDistance);
    var maxDistance = jQuery(ids.maxDistance);
    return knobsFrom(launch, slider, actualDendritsAmount, wavePower, blastRadius, blastPower, actualSynapcesAmount, pinMaxLength, setDendritsButton, setSignalButton, processWaveButton, keepSelected, measure, scale, resolution, minDistance, maxDistance);
}
function outOfKnobsResolution(resolution) {
    var isHigh = resolution.filter('.active').hasClass('high');
    return isHigh ? Resolution.High : Resolution.Low;
}
function switchResolution(resolution) {
    var active = resolution.filter('.active');
    var inactive = resolution.filter(':not(.active)');
    active.removeClass('active');
    inactive.addClass('active');
    return outOfKnobsResolution(resolution);
}
function isSameResolution(resolution, selectedResolution) {
    return outOfResolution(outOfKnobsResolution(resolution), {
        Low: function () { return selectedResolution.hasClass('low'); },
        High: function () { return selectedResolution.hasClass('high'); }
    });
}
function isLowResolution(resolution) {
    return (resolution == Resolution.Low);
}
