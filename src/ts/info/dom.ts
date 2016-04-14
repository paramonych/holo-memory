interface Knobs {
  launch: JQuery;
  slider: JQuery;
  actualDendritsAmount: JQuery;
  wavePower: JQuery;
  blastRadius: JQuery;
  blastPower: JQuery;
  actualSynapcesAmount: JQuery;
  pinMaxLength: JQuery;
  setDendritsButton: JQuery;
  setSignalButton: JQuery;
  processWaveButton: JQuery;
  keepSelected: JQuery;
  measure: JQuery;
  scale: JQuery;
}

function knobsFrom(
  launch: JQuery,
  slider: JQuery,
  actualDendritsAmount: JQuery,
  wavePower: JQuery,
  blastRadius: JQuery,
  blastPower: JQuery,
  actualSynapcesAmount: JQuery,
  pinMaxLength: JQuery,
  setDendritsButton: JQuery,
  setSignalButton: JQuery,
  processWaveButton: JQuery,
  keepSelected: JQuery,
  measure: JQuery,
  scale: JQuery
): Knobs {
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

  }
}

function getUIControls(): Knobs {
  let launch = jQuery(ids.launch);
  let slider = jQuery(ids.slider);
  let actualDendritsAmount = jQuery(ids.actualDendritsAmount);
  let wavePower = jQuery(ids.wavePower);
  let actualSynapcesAmount = jQuery(ids.actualSynapcesAmount);
  let pinMaxLength = jQuery(ids.pinMaxLength);
  let blastRadius = jQuery(ids.blastRadius);
  let blastPower = jQuery(ids.blastPower);
  let keepSelected = jQuery(ids.keepSelected);
  let measure = jQuery(ids.measure);
  let scale = jQuery(ids.sceneScale);

  let setDendritsButton = jQuery(ids.setDendritsButton);
  let setSignalButton = jQuery(ids.setSignalButton);
  let processWaveButton = jQuery(ids.processWaveButton);

  return knobsFrom(
    launch, slider, actualDendritsAmount,
    wavePower, blastRadius, blastPower,
    actualSynapcesAmount, pinMaxLength,
    setDendritsButton, setSignalButton,
    processWaveButton, keepSelected,
    measure, scale
  );
}
