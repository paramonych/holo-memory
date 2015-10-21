interface Disposable {
  dispose: () => void
}

interface Dualistic {
  state: KnockoutObservable<StateType>;
  activate: () => void;
  deactivate: () => void;
  serveState: (state: StateType) => void;
  toDefaultState: () => void;
}

interface ActivatableMesh {
  material: BABYLON.StandardMaterial;
  activeMaterial: BABYLON.StandardMaterial;
  setMaterials: () => void;
}
