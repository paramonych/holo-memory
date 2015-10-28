class Time {
  public tense: TimelineMax;

  constructor(public duration: number) {
    this.tense = new TimelineMax({repeat:0, paused:true});
    this.tense.to(document, duration, {}, 0);
  }

  public flow(): void {
    this.tense.play(0);
  }

  public resume(space: Space): void {
    this.tense.resume();
    space.resume(this);
  }

  public pause(space: Space): void {
    this.tense.pause();
    space.freeze(this);
  }

  public shiftTo(space: Space, point: number): void {
    this.tense.progress(point);
    space.shift(this, point);
  }

  public restart(space: Space): void {
    this.tense.restart();
    space.restart(this);
  }
}
