class SpikeMesh implements ActivatableMesh {
  public shoulders: SpikeShoulders;
  public material: BABYLON.StandardMaterial;
  public activeMaterial: BABYLON.StandardMaterial;
  //private shift = new BABYLON.Vector3(0.01, 0.01, 0.01);
  private position: BABYLON.Vector3;
  private curve: Array<BABYLON.Vector3>;

  constructor(
    public scene: BABYLON.Scene,
    public scale: number,
    public synapce: Synapce,
    public neuron: Neuron
  ) {
    this.curve = new Array<BABYLON.Vector3>();
    _.each(this.neuron.neuron.curve.path, (next) => {
      this.curve.push(next.clone());
    });

    this.position = this.curve[0].clone();//this.synapce.position.clone();
    this.setMaterials();
    this.constructShoulders();
  }

  private constructShoulders(): void {
    this.shoulders = shouldersFrom(this.constructShoulderMesh(), this.constructShoulderMesh());
    this.deactivate();
  }

  private constructShoulderMesh(): BABYLON.Mesh {
    let shoulder = BABYLON.Mesh.CreateSphere('s', 8, this.scale/10, this.scene, false);

    // TODO: remove this positioning and add another shoulder to animation circuit
    shoulder.position = this.position;

    return shoulder;
  }

  public activate(): void {
    this.styleAsActive(true);
    this.showMovingSpike();
  }

  public deactivate(): void {
    this.styleAsActive(false);
  }

  private styleAsActive(isActive: boolean): void {
    let left = this.shoulders.left;
    let right = this.shoulders.right;

    if(isActive) {
      left.material = this.activeMaterial;
      right.material = this.activeMaterial;
    } else {
      left.material = this.material;
      right.material = this.material;
    }
  }

  private showMovingSpike(): void {
    let timeline = new TimelineLite();
    let quantity = 350;
    let duration = 2;
    let path = this.curve;
    let position = {
        x: path[0].x,
        y: path[0].y,
        z: path[0].z
    };

    let tween = TweenLite.to(position, quantity, {bezier:path, ease:Linear.easeNone});

    for (let i = 0; i < quantity; i++) {
        tween.time(i);

        timeline.set(this.shoulders.left.position, {
            x: position.x,
            y: position.y,
            z: position.z
        }, i * (duration / quantity));
    }

    //~ timeline.play();
  }

  setMaterials(): void {
    this.material = new BABYLON.StandardMaterial('i', this.scene);
    this.material.alpha = 1;

    this.activeMaterial = new BABYLON.StandardMaterial('a', this.scene);
    this.activeMaterial.emissiveColor = new BABYLON.Color3(1, .2, 0);
    this.activeMaterial.ambientColor = new BABYLON.Color3(0, 0, 1);
    this.activeMaterial.alpha = 0.9;
  }

  public dispose(): void {
    this.scene.removeMesh(this.shoulders.left);
    this.scene.removeMesh(this.shoulders.right);
  }
}
