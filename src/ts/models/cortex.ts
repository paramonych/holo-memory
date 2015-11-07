class Cortex implements Disposable {
  private neurons: Neuron[];
  public blasts: NeuroBlast[];
  private neuronsAmount = 3;

  constructor(
    public scene: BABYLON.Scene,
    public scale: number,
    public lifetime: number) {
    this.createNeurons();
  }

  private createNeurons(): void {
      _.each(this.neurons, (n) => n.dispose());
      this.neurons = new Array<Neuron>();
      for(let i=0; i< this.neuronsAmount; i++) {
        this.neurons.push( new Neuron(this));
      }
  }

  public draw(): void {
    _.each(this.neurons, (neuron) => neuron.build());
  }

  public chargeTense(time: Time): void {
    _.each(this.neurons, (n) => {
      time.tense.add(() => n.tense.play(), 0);
    });
  }

  public freezeTense(time: Time): void {
    _.each(this.neurons, (n) => {
      n.tense.pause(time.tense.progress()*time.duration);
    });
  }

  public resumeTense(time: Time): void {
    _.each(this.neurons, (n) => {
      n.tense.resume();
    });
  }

  public restartTense(time: Time): void {
    _.each(this.neurons, (n) => {
      n.restartTense();
    });
  }

  public shiftTense(time: Time, progress: number): void {
    _.each(this.neurons, (n) => {
      n.tense.progress(progress);
    });
  }

  public dispose(): void {
    _.each(this.neurons, (neuron) => {neuron.dispose();});
  }
}
