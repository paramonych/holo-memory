function knobsFrom(launch, slider, dendritsAmount, wavePower, blastRadius, blastPower, synapcesAmount, pinMaxLength, setDendritsButton, setSignalButton, processWaveButton) {
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
        processWaveButton: processWaveButton
    };
}
