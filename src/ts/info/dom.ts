interface Knobs {
  launch: JQuery;
  play: JQuery;
  pause: JQuery;
  restart: JQuery;
  slider: JQuery;
  neuronsAmount: JQuery;
  blastRadius: JQuery;
  blastPower: JQuery;
  applyButton: JQuery;
}

function knobsFrom(
  launch: JQuery,
  play: JQuery,
  pause: JQuery,
  restart: JQuery,
  slider: JQuery,
  neuronsAmount: JQuery,
  blastRadius: JQuery,
  blastPower: JQuery,
  applyButton: JQuery
): Knobs {
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
  }
}
