class Spike {
  private speed: number = 1; // micrometers/milliseconds
  private time: number = 0; // milliseconds
  private lifeTime: number = 100; // milliseconds
  private timerId: number = 0;
  private grain: number = 5; //milliseconds
  public shoulders: KnockoutObservable<SpikeShoulders>
  constructor(
    public position: BABYLON.Vector3,
    private start: BABYLON.Vector3,
    private end: BABYLON.Vector3
  ) {

  }

  public launch(callback: (shoulders: SpikeShoulders) => void): void {
    this.timerId = window.setInterval(() => {
      callback(calculateShoulders(this));
      this.tick();
    }, this.grain);
  }

  private tick(): void {
    this.time += this.grain;
    if(this.time >= this.lifeTime) {
      window.clearInterval(this.timerId);
    }
  }
}

interface SpikeShoulders {
  left: BABYLON.Vector3,
  right: BABYLON.Vector3
}

function calculateShoulders(spike: Spike): SpikeShoulders {
  // TODO: calculate using dendrit direction
  return shouldersFrom(spike.position, spike.position);
}

function shouldersFrom(left: BABYLON.Vector3, right: BABYLON.Vector3): SpikeShoulders {
  return {
    left: left,
    right: right
  };
}
