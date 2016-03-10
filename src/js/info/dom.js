function knobsFrom(launch, slider, neuronsAmount, blastRadius, blastPower, applyButton) {
    return {
        launch: launch,
        slider: slider,
        neuronsAmount: neuronsAmount.find('input'),
        blastRadius: blastRadius.find('input'),
        blastPower: blastPower.find('input'),
        applyButton: applyButton
    };
}
