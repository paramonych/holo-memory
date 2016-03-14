interface Knobs {
  launch: JQuery;
  slider: JQuery;
  neuronsAmount: JQuery;
  blastRadius: JQuery;
  blastPower: JQuery;
  synapcesAmount: JQuery;
  pinMaxLength: JQuery;
  applyButton: JQuery;
}

function knobsFrom(
  launch: JQuery,
  slider: JQuery,
  neuronsAmount: JQuery,
  blastRadius: JQuery,
  blastPower: JQuery,
  applyButton: JQuery,
  synapcesAmount: JQuery,
  pinMaxLength: JQuery
): Knobs {
  return {
    launch: launch,
    slider: slider,
    neuronsAmount: neuronsAmount.find('input'),
    blastRadius: blastRadius.find('input'),
    blastPower: blastPower.find('input'),
    synapcesAmount: synapcesAmount.find('input'),
    pinMaxLength: pinMaxLength.find('input'),
    applyButton: applyButton
  }
}
