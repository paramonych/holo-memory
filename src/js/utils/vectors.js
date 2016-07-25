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
    var defaultHelper = new Array();
    var rotationHelper = new Array();
    var point = vectorFrom(0, 0, 0);
    var deltaRadius = (segmentsAmount > 1) ? (scale * 2) / segmentsAmount : 15;
    for (var i = 0; i <= segmentsAmount; i += 1) {
        defaultHelper.push(point);
        var doRandomSign = (i % 7 == 0) || (i % 6 == 0) ? true : false;
        point = vectorFrom((point.x + ((segmentsAmount > 1) ? random() : 1) * deltaRadius * (doRandomSign ? randomSign() : 1)), (point.y + ((segmentsAmount > 1) ? random() : 1) * deltaRadius * (doRandomSign ? randomSign() : 1)), (point.z + ((segmentsAmount > 1) ? random() : 1) * deltaRadius * (doRandomSign ? randomSign() : 1)));
    }
    var quaternion = (new BABYLON.Quaternion(random() * randomSign(), random() * randomSign(), random() * randomSign())).normalize();
    var rotationMatrix = BABYLON.Matrix.Compose(new BABYLON.Vector3(1, 1, 1), quaternion, new BABYLON.Vector3(0, 0, 0));
    for (var i = 0; i < defaultHelper.length; i += 1) {
        var rotatedVector = BABYLON.Vector3.TransformCoordinates(defaultHelper[i].clone(), rotationMatrix);
        rotationHelper.push(rotatedVector);
    }
    if (rotationHelper.length) {
        var rotatedPathEndPoint = rotationHelper[rotationHelper.length - 1];
        var endPointX = rotatedPathEndPoint.x;
        var endPointY = rotatedPathEndPoint.y;
        var endPointZ = rotatedPathEndPoint.z;
        var shift = scale / ((segmentsAmount > 1) ? 2.2 : 1.8);
        var xShift = negate(endPointX / 2) + random() * randomSign() * shift;
        var yShift = negate(endPointY / 2) + random() * randomSign() * shift;
        var zShift = negate(endPointZ / 2) + random() * randomSign() * shift;
        var translationMatrix = BABYLON.Matrix.Compose(new BABYLON.Vector3(1, 1, 1), quaternion, new BABYLON.Vector3(xShift, yShift, zShift));
        for (var i = 0; i < defaultHelper.length; i += 1) {
            var rotatedVector = BABYLON.Vector3.TransformCoordinates(defaultHelper[i].clone(), translationMatrix);
            path.push(rotatedVector);
        }
        return path;
    }
    return rotationHelper;
}
function vectorFrom(x, y, z) {
    return new BABYLON.Vector3(x, y, z);
}
function vectorFromTwoPoints(one, two) {
    return new BABYLON.Vector3((two.x - one.x), (two.y - one.y), (two.z - one.z));
}
function compareVectors(one, two) {
    var sum = one.add(two.negate());
    return sum.x === 0 && sum.y === 0 && sum.z === 0;
}
function vectorMiddlePoint(start, end) {
    var x = (start.x + end.x) / 2;
    var y = (start.y + end.y) / 2;
    var z = (start.z + end.z) / 2;
    return vectorFrom(x, y, z);
}
