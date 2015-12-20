function forBlastSphere(scene) {
    var material = new BABYLON.StandardMaterial('i', scene);
    material.emissiveColor = new BABYLON.Color3(1, 1, 0);
    material.specularColor = new BABYLON.Color3(0, 0, 0);
    material.alpha = 1;
    return material;
}
function forIndicator(scene) {
    var material = new BABYLON.StandardMaterial('i', scene);
    material.diffuseColor = new BABYLON.Color3(0, 1, 0);
    material.emissiveColor = new BABYLON.Color3(0, 1, 0);
    material.specularColor = new BABYLON.Color3(0, 0, 0);
    material.alpha = 0;
    return material;
}
