function randomAngleVector() {
    var angle = function () { return randomSign() * Math.PI / Math.random(); };
    return new BABYLON.Vector3(angle(), angle(), angle());
}
function randomVector(scale) {
    var num = function () { return (scale / 2) * Math.random() * randomSign(); };
    return new BABYLON.Vector3(num(), num(), num());
}
