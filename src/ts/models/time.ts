class Time {
  public tense: TimelineMax;

  constructor() {
    this.tense = new TimelineMax({repeat:1, paused:true});
  }

  public flow(): void {
    this.tense.play(0);
  }

  public stop(): void {
    this.tense.pause();
  }

  public loop(): void {
    this.tense.restart();
  }
}
