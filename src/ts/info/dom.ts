interface Knobs {
  launch: JQuery;
  slider: JQuery;
  dendritsAmount: JQuery;
  wavePower: JQuery;
  blastRadius: JQuery;
  blastPower: JQuery;
  synapcesAmount: JQuery;
  pinMaxLength: JQuery;
  setDendritsButton: JQuery;
  setSignalButton: JQuery;
  processWaveButton: JQuery;
  keepSelected: JQuery;
  measure: JQuery;
}

function knobsFrom(
  launch: JQuery,
  slider: JQuery,
  dendritsAmount: JQuery,
  wavePower: JQuery,
  blastRadius: JQuery,
  blastPower: JQuery,
  synapcesAmount: JQuery,
  pinMaxLength: JQuery,
  setDendritsButton: JQuery,
  setSignalButton: JQuery,
  processWaveButton: JQuery,
  keepSelected: JQuery,
  measure: JQuery
): Knobs {
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
    keepSelected: keepSelected.find('input'),
    measure: measure
  }
}

function getUIControls(): Knobs {
  let launch = jQuery(ids.launch);
  let slider = jQuery(ids.slider);
  let dendritsAmount = jQuery(ids.dendritsAmount);
  let wavePower = jQuery(ids.wavePower);
  let synapcesAmount = jQuery(ids.synapcesAmount);
  let pinMaxLength = jQuery(ids.pinMaxLength);
  let blastRadius = jQuery(ids.blastRadius);
  let blastPower = jQuery(ids.blastPower);
  let keepSelected = jQuery(ids.keepSelected);
  let measure = jQuery(ids.measure);

  let setDendritsButton = jQuery(ids.setDendritsButton);
  let setSignalButton = jQuery(ids.setSignalButton);
  let processWaveButton = jQuery(ids.processWaveButton);

  return knobsFrom(
    launch, slider, dendritsAmount,
    wavePower, blastRadius, blastPower,
    synapcesAmount, pinMaxLength ,
    setDendritsButton, setSignalButton,
    processWaveButton, keepSelected,
    measure
  );
}
