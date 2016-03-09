class SynapceMesh implements ActivatableMesh {
  public mesh: BABYLON.Mesh;
  public synapceLegMesh: BABYLON.Mesh;
  public material: BABYLON.StandardMaterial;
  public activeMaterial: BABYLON.StandardMaterial;
  public position: BABYLON.Vector3;

  constructor(
    public scene: BABYLON.Scene, public scale: number,
    basePosition: BABYLON.Vector3, private neuron: Neuron
  ) {
    this.position = isMedium(neuron.type) ? this.shiftPosition(basePosition) : basePosition;
    this.setMaterials();
    this.draw(basePosition);
  }

  private shiftPosition(basePosition: BABYLON.Vector3): BABYLON.Vector3 {
    let shift = this.scale/3;

    let neuronPath = this.neuron.mesh.curve.path;
    let first = neuronPath[0];
    let last = neuronPath[neuronPath.length-1];

    let baseVector = last.subtract(first).normalize();

    let delta = 0.49;
    let rotation = new BABYLON.Quaternion(limitedRandomWithRandomSign(delta), limitedRandomWithRandomSign(delta), limitedRandomWithRandomSign(delta));
    let scaleVector = new BABYLON.Vector3(shift,shift,shift);
    let zeroVector = new BABYLON.Vector3(0,0,0);
    let matrix = BABYLON.Matrix.Compose(scaleVector, rotation, zeroVector);
    let rotatedVector = BABYLON.Vector3.TransformCoordinates(baseVector, matrix);
    let result = basePosition.add(rotatedVector);
    return result;
  }

  private draw(basePosition: BABYLON.Vector3): void {
    this.mesh = BABYLON.Mesh.CreateSphere('s', 4, this.scale/(isMedium(this.neuron.type) ? 50:100), this.scene, false);
    this.mesh.position = this.position;
    if(isMedium(this.neuron.type)) {
      this.synapceLegMesh = BABYLON.Mesh.CreateTube('t', [basePosition, this.position], this.scale / 470, 10, null, 0, this.scene, true, BABYLON.Mesh.FRONTSIDE);
      this.synapceLegMesh.material = this.material;
    }
    this.deactivate();
  }

  public affect(frontPosition: DoubleVector): boolean {
    return this.isCloseEnough(frontPosition.one) || this.isCloseEnough(frontPosition.two);
  }

  private isCloseEnough(vector: BABYLON.Vector3): boolean {
    let delta = this.scale/4;
    let x = Math.abs(this.position.x - vector.x);
    let y = Math.abs(this.position.y - vector.y);
    let z = Math.abs(this.position.z - vector.z);
    console.debug('delta', x, y, z, delta);
    return x < delta && y < delta && z < delta;
  }

  public activate(): void {
    this.mesh.material = this.activeMaterial;
    this.synapceLegMesh.material = this.activeMaterial;
  }

  public deactivate(): void {
    this.mesh.material = this.material;
  }

  setMaterials(): void {
    if(isMedium(this.neuron.type)) {
      this.material = forMediumNeuron(this.scene);
      this.activeMaterial = forMediumActiveNeuron(this.scene);
    } else {
      this.material = forProgenyNeuron(this.scene);
      this.activeMaterial = forProgenyActiveNeuron(this.scene);
    }
  }

  public dispose(): void {
    this.scene.removeMesh(this.mesh);
    this.mesh.dispose();
    this.mesh = null;
    this.scene.removeMesh(this.synapceLegMesh);
    if(this.synapceLegMesh && this.synapceLegMesh.dispose) {
      this.synapceLegMesh.dispose();
    }
    this.synapceLegMesh = null;
  }
}
