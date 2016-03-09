function knobsFrom(launch, play, pause, restart, slider, neuronsAmount, blastRadius, blastPower, applyButton) {
    return {
        launch: launch,
        play: play,
        pause: pause,
        restart: restart,
        slider: slider,
        neuronsAmount: neuronsAmount.find('input'),
        blastRadius: blastRadius.find('input'),
        blastPower: blastPower.find('input'),
        applyButton: applyButton
    };
}
