class NeuroBlast {
  public sphere: BABYLON.Mesh;
  public synapcesMap: Map<Synapce>;

  constructor(
    private synapce: Synapce,
    private radius: number,
    private synapces: Array<Synapce>,
    private scene: BABYLON.Scene) {

    this.synapcesMap = newMap<Synapce>();
    this.synapces.forEach((nextSynapce) => {
      this.checkIntersection(nextSynapce);
    });

    this.dispose();
  }

  private checkIntersection(nextSynapce: Synapce): void {

    if(this.checkIntersections(nextSynapce.position)) {
      nextSynapce.mesh.mesh.material = forBlastSphere(this.scene);
      mapAdd(this.synapcesMap, nextSynapce.getId(), nextSynapce);
    }
  }

  private checkIntersections(np: BABYLON.Vector3): boolean {
    let pos = this.synapce.position;
    let x = Math.pow((pos.x - np.x), 2);
    let y = Math.pow((pos.y - np.y), 2);
    let z = Math.pow((pos.z - np.z), 2);
    let distance = Math.sqrt(x + y + z);
    console.log(distance,this.radius);
    if(distance > 0 && distance < this.radius) {
      return true;
    }

    return false;
  }

  private dispose(): void {
    this.scene.removeMesh(this.sphere);
  }
}
