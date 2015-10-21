interface Knobs {
  launch: JQuery;
  play: JQuery;
  pause: JQuery;
  restart: JQuery;
  slider: JQuery;
}

function knobsFrom(
  launch: JQuery,
  play: JQuery,
  pause: JQuery,
  restart: JQuery,
  slider: JQuery
): Knobs {
  return {
    launch: launch,
    play: play,
    pause: pause,
    restart: restart,
    slider: slider
  }
}
