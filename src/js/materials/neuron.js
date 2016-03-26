var mediumMaterial = materialConfigFrom(colorFrom(0.5, 0.5, 0.5), colorFrom(1, 1, 1), colorFrom(0, 0, 1), 70, 1);
var progenyMaterial = materialConfigFrom(colorFrom(0, 0, 0.35), colorFrom(0, 0, 0), colorFrom(0, 0, 0.75), 70, 1);
var activeMaterial = materialConfigFrom(colorFrom(1, 0, 0), colorFrom(1, 1, 1), colorFrom(1, 0, 0), 70, 1);
var selectedMaterial = materialConfigFrom(colorFrom(1, 0.9, 0), colorFrom(1, 1, 1), colorFrom(1, 0.9, 0), 70, 1);
function colorizeMaterial(config, emissive) {
    config.emissive = colorFrom(emissive.r, emissive.g, emissive.b);
    return config;
}
function defaultMaterial(scene) {
    return new BABYLON.StandardMaterial('Name-' + (random() * random()), scene);
}
function colorFrom(r, g, b) {
    return {
        r: r,
        g: g,
        b: b
    };
}
function materialConfigFrom(emissive, specular, ambient, specularPower, alpha) {
    return {
        emissive: emissive,
        specular: specular,
        ambient: ambient,
        specularPower: specularPower,
        alpha: alpha
    };
}
function resetMaterial(material, c, alpha) {
    material.emissiveColor = new BABYLON.Color3(c.emissive.r, c.emissive.g, c.emissive.b);
    material.specularColor = new BABYLON.Color3(c.specular.r, c.specular.g, c.specular.b);
    material.ambientColor = new BABYLON.Color3(c.ambient.r, c.ambient.g, c.ambient.b);
    material.specularPower = c.specularPower;
    material.alpha = (alpha === void 0) ? c.alpha : alpha;
}
function setAlpha(material, alpha) {
    material.alpha = alpha;
}
var neuronMaterials = {
    Medium: 'medium-neuron',
    Progeny: 'progeny-neuron',
    Signal: 'signal-neuron',
    Selected: 'selected-neuron'
};
function forMediumNeuronGGZ(scene) {
    var material = new BABYLON.StandardMaterial("kosh", scene);
    material.diffuseColor = new BABYLON.Color3(0.5, 0, 0);
    material.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    material.alpha = 0.2;
    material.specularPower = 16;
    material.reflectionFresnelParameters = new BABYLON.FresnelParameters();
    material.reflectionFresnelParameters.bias = 0.1;
    material.emissiveFresnelParameters = new BABYLON.FresnelParameters();
    material.emissiveFresnelParameters.power = 4;
    material.emissiveFresnelParameters.leftColor = BABYLON.Color3.White();
    material.emissiveFresnelParameters.rightColor = BABYLON.Color3.Black();
    material.opacityFresnelParameters = new BABYLON.FresnelParameters();
    material.opacityFresnelParameters.leftColor = BABYLON.Color3.White();
    material.opacityFresnelParameters.rightColor = BABYLON.Color3.Black();
    return material;
}
