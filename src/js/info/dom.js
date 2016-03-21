function knobsFrom(launch, slider, dendritsAmount, wavePower, blastRadius, blastPower, synapcesAmount, pinMaxLength, setDendritsButton, setSignalButton, processWaveButton, keepSelected) {
    return {
        launch: launch,
        slider: slider,
        dendritsAmount: dendritsAmount.find('input'),
        wavePower: wavePower.find('input'),
        blastRadius: blastRadius.find('input'),
        blastPower: blastPower.find('input'),
        synapcesAmount: synapcesAmount.find('input'),
        pinMaxLength: pinMaxLength.find('input'),
        setDendritsButton: setDendritsButton,
        setSignalButton: setSignalButton,
        processWaveButton: processWaveButton,
        keepSelected: keepSelected.find('input')
    };
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
    var keepSelected = jQuery(ids.keepSelected);
    var setDendritsButton = jQuery(ids.setDendritsButton);
    var setSignalButton = jQuery(ids.setSignalButton);
    var processWaveButton = jQuery(ids.processWaveButton);
    return knobsFrom(launch, slider, dendritsAmount, wavePower, blastRadius, blastPower, synapcesAmount, pinMaxLength, setDendritsButton, setSignalButton, processWaveButton, keepSelected);
}
