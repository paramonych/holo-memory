function forMediumNeuron(scene) {
    var material = new BABYLON.StandardMaterial('i', scene);
    material.emissiveColor = new BABYLON.Color3(0.17, 0.57, 1);
    material.alpha = 0.3;
    return material;
}
function forMediumActiveNeuron(scene) {
    var material = new BABYLON.StandardMaterial('a', scene);
    material.emissiveColor = new BABYLON.Color3(1, .9, 0);
    material.ambientColor = new BABYLON.Color3(0, 0, 1);
    material.alpha = 0.3;
    return material;
}
function forProgenyNeuron(scene) {
    var material = new BABYLON.StandardMaterial('i', scene);
    material.emissiveColor = new BABYLON.Color3(0.57, 0.17, 1);
    material.alpha = 0.3;
    return material;
}
function forProgenyActiveNeuron(scene) {
    var material = new BABYLON.StandardMaterial('a', scene);
    material.emissiveColor = new BABYLON.Color3(.9, 1, 0);
    material.ambientColor = new BABYLON.Color3(0, 0, 1);
    material.alpha = 0.3;
    return material;
}
