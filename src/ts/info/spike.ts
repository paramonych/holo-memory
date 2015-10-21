interface SpikeShoulders {
  left: SpikeShoulder,
  right: SpikeShoulder
}

interface SpikeShoulder {
  mesh: BABYLON.Mesh,
  light: BABYLON.PointLight
}

function shouldersFrom(
  left: SpikeShoulder,
  right: SpikeShoulder
): SpikeShoulders {
  return {
    left: left,
    right: right
  };
}

function shoulderFrom(
  mesh: BABYLON.Mesh,
  light: BABYLON.PointLight
): SpikeShoulder {
  return {
    mesh: mesh,
    light: light
  };
}
