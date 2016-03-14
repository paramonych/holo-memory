function knobsFrom(launch, slider, neuronsAmount, blastRadius, blastPower, applyButton, synapcesAmount, pinMaxLength) {
    return {
        launch: launch,
        slider: slider,
        neuronsAmount: neuronsAmount.find('input'),
        blastRadius: blastRadius.find('input'),
        blastPower: blastPower.find('input'),
        synapcesAmount: synapcesAmount.find('input'),
        pinMaxLength: pinMaxLength.find('input'),
        applyButton: applyButton
    };
}
