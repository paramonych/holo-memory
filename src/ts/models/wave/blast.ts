class NeuroBlast {
  public sphere: BABYLON.Mesh;
  public neuronsMap: Map<Neuron>;
  public synapcesMap: Map<Synapce>;
  public isExists: boolean = false;
  private synapcesCount: number = 0;
  private color = new BABYLON.Color3(ra(),ra(),ra());

  constructor(
    private synapce: Synapce,
    private radius: number,
    private synapces: Array<Synapce>,
    private scene: BABYLON.Scene,
    private blastPowerLimit: number) {

    this.neuronsMap = newMap<Neuron>();
    this.synapcesMap = newMap<Synapce>();

    this.synapces.forEach((nextSynapce) => {
      let hasIntersections = this.checkIntersection(nextSynapce);
      let nextNeuron = nextSynapce.neuron;
      if(hasIntersections) {
        if(!mapHasKey(this.neuronsMap, nextNeuron.getId())) {
          mapAdd(this.neuronsMap, nextNeuron.getId(), nextNeuron);
        }
        if(!mapHasKey(this.synapcesMap, nextSynapce.getId())) {
          mapAdd(this.synapcesMap, nextSynapce.getId(), nextSynapce);
        }
        if(!nextNeuron.hasCodeMesh()) {
          //nextNeuron.setProgenyCodeMesh();
        }
      }
    });

    this.synapcesCount = mapSize(this.synapcesMap);

    let isEnoughIntersections = (this.synapcesCount >= this.blastPowerLimit);
    this.synapce.setMediumCodeMesh(this.synapcesCount, isEnoughIntersections);

    if(this.isExists && isEnoughIntersections) {
      this.sphere = BABYLON.Mesh.CreateSphere('s', 32, this.radius*2, this.scene, false);
      this.sphere.material = glass(this.scene);
      this.sphere.position = this.synapce.mesh.position.clone();

      this.synapce.allowMediator();
      this.synapce.mesh.mesh.material = forBlastSphere(this.scene, this.color);
      useMap(this.synapcesMap, (synapce) => {
        synapce.allowMediator();
        synapce.mesh.mesh.material = forBlastSphere(this.scene, this.color);
      });
    } else {
      this.dispose();
    }
  }

  private checkIntersection(nextSynapce: Synapce): boolean {
    let hasIntersections = this.checkIntersections(nextSynapce.mesh.position);

    if(hasIntersections) {
      if(!this.isExists) {
        this.isExists = true;
      }
    }

    return hasIntersections;
  }

  private checkIntersections(np: BABYLON.Vector3): boolean {
    let pos = this.synapce.mesh.position;
    let x = Math.pow((pos.x - np.x), 2);
    let y = Math.pow((pos.y - np.y), 2);
    let z = Math.pow((pos.z - np.z), 2);
    let distance = Math.sqrt(x + y + z);

    if(distance > 0 && distance < this.radius) {
      return true;
    }
    return false;
  }

  public getIntersectionsCount(): number {
    return this.synapcesCount;
  }

  public dispose(): void {
    this.scene.removeMesh(this.sphere);
    if(this.sphere && this.sphere.dispose) {
      this.sphere.dispose();
    }
    this.neuronsMap = null;
    this.synapcesMap = null;
  }
}
