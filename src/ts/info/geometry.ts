interface DoubleVector {
  one: BABYLON.Vector3;
  two: BABYLON.Vector3;
}

function doubleVectorFrom(o: BABYLON.Vector3, t: BABYLON.Vector3): DoubleVector {
  return  {
    one: o,
    two: t
  };
}

interface SpikePosition {
  x: number;
  y: number;
  z: number;
}
