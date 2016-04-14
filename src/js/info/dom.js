function knobsFrom(launch, slider, actualDendritsAmount, wavePower, blastRadius, blastPower, actualSynapcesAmount, pinMaxLength, setDendritsButton, setSignalButton, processWaveButton, keepSelected, measure, scale) {
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
        scale: scale.find('input')
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
    var setDendritsButton = jQuery(ids.setDendritsButton);
    var setSignalButton = jQuery(ids.setSignalButton);
    var processWaveButton = jQuery(ids.processWaveButton);
    return knobsFrom(launch, slider, actualDendritsAmount, wavePower, blastRadius, blastPower, actualSynapcesAmount, pinMaxLength, setDendritsButton, setSignalButton, processWaveButton, keepSelected, measure, scale);
}
