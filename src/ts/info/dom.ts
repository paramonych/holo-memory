interface Knobs {
  launch: JQuery;
  slider: JQuery;
  neuronsAmount: JQuery;
  blastRadius: JQuery;
  blastPower: JQuery;
  applyButton: JQuery;
}

function knobsFrom(
  launch: JQuery,
  slider: JQuery,
  neuronsAmount: JQuery,
  blastRadius: JQuery,
  blastPower: JQuery,
  applyButton: JQuery
): Knobs {
  return {
    launch: launch,
    slider: slider,
    neuronsAmount: neuronsAmount.find('input'),
    blastRadius: blastRadius.find('input'),
    blastPower: blastPower.find('input'),
    applyButton: applyButton
  }
}
