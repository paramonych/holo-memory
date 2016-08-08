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
  setMaterial: () => void;
}

enum Resolution {
  'Low',
  'High'
}

interface ResolutionResolver<r> {
  Low: () => r,
  High: () => r
}

function outOfResolution<r>(
  resolution: Resolution,
  resolver: ResolutionResolver<r>
): r  {
  switch (resolution) {
    case Resolution.High:
      return resolver.High();
    case Resolution.Low:
      return resolver.Low();
  }
}
