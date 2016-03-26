class SynapceMesh implements ActivatableMesh {
  public mesh: BABYLON.Mesh;
  public synapceLegMesh: BABYLON.Mesh;
  public position: BABYLON.Vector3;

  constructor(
    public scene: BABYLON.Scene, public scale: number,
    public basePosition: BABYLON.Vector3, private neuron: Neuron
  ) {
    this.position = this.shiftPosition(this.basePosition.clone());//isMedium(neuron.type) ? this.shiftPosition(this.basePosition.clone()) : basePosition.clone();
    this.draw(basePosition);
    this.setMaterial();
  }

  private shiftPosition(basePosition: BABYLON.Vector3): BABYLON.Vector3 {
    let pinMaxLength = this.neuron.cortex.cortexState.pinMaxLength;
    let synapcesAmount = this.neuron.cortex.cortexState.synapcesAmount;
    pinMaxLength = pinMaxLength / (synapcesAmount/(this.neuron.cortex.cortexState.scale/realSynapcesDistance));
    let shift = pinMaxLength * random();

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
    this.mesh = BABYLON.Mesh.CreateSphere('s', 4, this.scale/(isMedium(this.neuron.type) ? 50:100), this.scene, true);
    this.mesh.position = this.position;
    //if(isMedium(this.neuron.type)) {
      this.synapceLegMesh = BABYLON.Mesh.CreateTube('t', [basePosition, this.position], this.scale / 470, 10, null, 0, this.scene, true, BABYLON.Mesh.FRONTSIDE);

      this.mesh.material = defaultMaterial(this.scene);
      this.synapceLegMesh.material = defaultMaterial(this.scene);
    //}
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
    resetMaterial(this.mesh.material, activeMaterial);
    resetMaterial(this.synapceLegMesh.material, activeMaterial);
  }

  public deactivate(): void {
    this.setMaterial();
  }

  setMaterial(): void {
    if(isMedium(this.neuron.type)) {
      resetMaterial(this.mesh.material, mediumMaterial);
      resetMaterial(this.synapceLegMesh.material, mediumMaterial);
    } else {
      resetMaterial(this.mesh.material, progenyMaterial);
      resetMaterial(this.synapceLegMesh.material, progenyMaterial);
    }
  }

  public resetMaterials(): void {
    this.setMaterial();
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
