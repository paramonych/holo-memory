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
function randomPath(scale, deltaRadius, deltaSegment) {
    var path = new Array();
    var next = randomVector(scale);
    var steps = Math.floor(scale / deltaSegment);
    var xSign = (-1) * next.x / Math.abs(next.x);
    var ySign = (-1) * next.y / Math.abs(next.y);
    var zSign = (-1) * next.z / Math.abs(next.z);
    for (var i = 0; i <= steps; i += 1) {
        path.push(next);
        next = vectorFrom((next.x + xSign * Math.random() * deltaRadius), (next.y + ySign * Math.random() * deltaRadius), (next.z + zSign * Math.random() * deltaRadius));
    }
    var path3D = new BABYLON.Path3D(path);
    return path3D;
}
function vectorFrom(x, y, z) {
    return new BABYLON.Vector3(x, y, z);
}
