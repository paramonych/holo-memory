class Time {
  public tense: TimelineMax;

  constructor(public duration: number) {
    this.tense = new TimelineMax({repeat:0, paused:true});
    this.tense.to(document, duration, {}, 0);
  }

  public flow(): void {
    this.tense.play(0);
  }

  public stop(space: Space): void {
    this.tense.pause();
    space.freeze(this);
  }

  public shiftTo(space: Space, point: number): void {
    space.shift(this, point);
  }

  public loop(): void {
    this.tense.restart();
  }
}
