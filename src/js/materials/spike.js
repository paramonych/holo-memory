function forSpike(scene) {
    var material = new BABYLON.StandardMaterial('i', scene);
    material.alpha = 0;
    return material;
}
function forSpikeActive(scene) {
    var material = new BABYLON.StandardMaterial('a', scene);
    material.emissiveColor = new BABYLON.Color3(1, 0.5, 0.2);
    return material;
}
