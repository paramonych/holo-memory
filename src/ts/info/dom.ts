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
  processWaveButton: JQuery
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
    processWaveButton: processWaveButton
  }
}
