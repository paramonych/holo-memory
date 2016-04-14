function randomAngleVector() {
    var angle = function () { return randomSign() * Math.PI / Math.random(); };
    return new BABYLON.Vector3(angle(), angle(), angle());
}
function randomVector(scale) {
    var num = function () { return scale * Math.random() * randomSign(); };
    return new BABYLON.Vector3(num(), num(), num());
}
function randomPointOnSphere(radius) {
    var num = function () { return Math.random() * randomSign(); };
    var vector = new BABYLON.Vector3(num(), num(), num());
    vector.scale(radius);
    return vector;
}
function randomPath(scale, segmentsAmount) {
    var path = new Array();
    var shift = -scale / 2;
    var point = vectorFrom(shift, shift, shift);
    var deltaRadius = scale * 2 / segmentsAmount;
    var matrix = BABYLON.Matrix.Compose(new BABYLON.Vector3(0, 0, 0), new BABYLON.Quaternion(0, 0, 0), new BABYLON.Vector3(1, 1, 1));
    for (var i = 0; i <= segmentsAmount; i += 1) {
        var rotatedVector = BABYLON.Vector3.TransformCoordinates(point.clone(), matrix);
        path.push(point);
        var doRandomSign = false;
        point = vectorFrom((point.x + random() * deltaRadius), (point.y + random() * deltaRadius), (point.z + random() * deltaRadius));
    }
    return path;
}
function vectorFrom(x, y, z) {
    return new BABYLON.Vector3(x, y, z);
}
function compareVectors(one, two) {
    var sum = one.add(two.negate());
    return sum.x === 0 && sum.y === 0 && sum.z === 0;
}
